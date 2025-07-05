
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Trash2, FileText, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useClients } from '@/hooks/useClients';
import { useProducts } from '@/hooks/useProducts';
import { useCurrency } from '@/contexts/CurrencyContext';

interface CreditNoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  discount: number;
  total: number;
  productId?: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  unit: string | null;
  tax_rate?: number;
}

interface CreditNoteModalProps {
  open: boolean;
  onClose: () => void;
  creditNote?: any;
  onSave: (data: any) => void;
}

export function CreditNoteModal({ open, onClose, creditNote, onSave }: CreditNoteModalProps) {
  const { organization, user } = useAuth();
  const { clients, loading: clientsLoading } = useClients();
  const { products, loading: productsLoading } = useProducts();
  const { currency } = useCurrency();
  
  // Form state
  const [creditNoteNumber, setCreditNoteNumber] = useState(creditNote?.number || 'AV-2025-001');
  const [creditNoteDate, setCreditNoteDate] = useState(creditNote?.date || new Date().toISOString().split('T')[0]);
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState(creditNote?.client || null);
  const [reason, setReason] = useState(creditNote?.reason || '');
  const [originalInvoiceNumber, setOriginalInvoiceNumber] = useState(creditNote?.originalInvoiceNumber || '');
  const [notes, setNotes] = useState(creditNote?.notes || '');
  
  // Credit note items
  const [creditNoteItems, setCreditNoteItems] = useState<CreditNoteItem[]>(creditNote?.items || [
    { id: '1', description: '', quantity: 1, unitPrice: 0, vatRate: 20, discount: 0, total: 0 }
  ]);
  
  // Product search inline
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fonction de nettoyage des timeouts
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);
  
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(clientSearch.toLowerCase()))
  );

  // Fonction de recherche de produits avec debounce
  const handleProductSearch = (itemId: string, searchTerm: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    setActiveItemId(itemId);
    
    if (searchTerm.length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        const filtered = products.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setSearchSuggestions(filtered.slice(0, 5));
        setShowSuggestions(true);
      }, 300);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Sélectionner un produit depuis les suggestions
  const selectProduct = (itemId: string, product: Product) => {
    const taxRate = product.tax_rate || 0;
    const unitPrice = product.price;
    
    setCreditNoteItems(creditNoteItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          description: product.name,
          unitPrice: unitPrice,
          vatRate: taxRate,
          total: unitPrice,
          productId: product.id
        };
      }
      return item;
    }));
    setShowSuggestions(false);
    setActiveItemId(null);
    setSearchSuggestions([]);
  };
  
  const addCreditNoteItem = () => {
    const newItem: CreditNoteItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: 20,
      discount: 0,
      total: 0
    };
    setCreditNoteItems([...creditNoteItems, newItem]);
  };
  
  const updateCreditNoteItem = (id: string, field: keyof CreditNoteItem, value: any) => {
    setCreditNoteItems(creditNoteItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice' || field === 'discount') {
          const subtotal = updated.quantity * updated.unitPrice;
          const discountAmount = subtotal * (updated.discount / 100);
          updated.total = subtotal - discountAmount;
        }
        return updated;
      }
      return item;
    }));
  };

  // Format currency display
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-FR', { 
      style: 'currency', 
      currency: currency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };
  
  const removeCreditNoteItem = (id: string) => {
    setCreditNoteItems(creditNoteItems.filter(item => item.id !== id));
  };
  
  const calculateTotals = () => {
    const subtotalHT = creditNoteItems.reduce((sum, item) => sum + item.total, 0);
    const totalDiscount = creditNoteItems.reduce((sum, item) => {
      const subtotal = item.quantity * item.unitPrice;
      return sum + (subtotal * item.discount / 100);
    }, 0);
    const totalVAT = creditNoteItems.reduce((sum, item) => sum + (item.total * item.vatRate / 100), 0);
    const totalTTC = subtotalHT + totalVAT;
    
    return { subtotalHT, totalDiscount, totalVAT, totalTTC };
  };
  
  const { subtotalHT, totalDiscount, totalVAT, totalTTC } = calculateTotals();
  
  const handleSave = () => {
    const creditNoteData = {
      number: creditNoteNumber,
      date: creditNoteDate,
      client: selectedClient,
      reason,
      originalInvoiceNumber,
      items: creditNoteItems,
      notes,
      totals: { subtotalHT, totalDiscount, totalVAT, totalTTC }
    };
    onSave(creditNoteData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-red-600">
            {creditNote ? 'Modifier l\'avoir' : 'Nouvel avoir'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header avec logo et infos organisation */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  {organization?.logo_url && (
                    <img src={organization.logo_url} alt="Logo" className="h-16 w-16 object-contain" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{organization?.name || user?.user_metadata?.company_name || 'Mon Entreprise'}</h3>
                    <p className="text-sm text-gray-600">{organization?.address || user?.user_metadata?.company_address}</p>
                    <p className="text-sm text-gray-600">{organization?.email || user?.email}</p>
                    <p className="text-sm text-gray-600">{organization?.phone || user?.user_metadata?.company_phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold text-red-600">AVOIR</h2>
                  <div className="space-y-2 mt-2">
                    <div>
                      <Label htmlFor="creditNoteNumber">Numéro</Label>
                      <Input
                        id="creditNoteNumber"
                        value={creditNoteNumber}
                        onChange={(e) => setCreditNoteNumber(e.target.value)}
                        className="w-40"
                      />
                    </div>
                    <div>
                      <Label htmlFor="creditNoteDate">Date</Label>
                      <Input
                        id="creditNoteDate"
                        type="date"
                        value={creditNoteDate}
                        onChange={(e) => setCreditNoteDate(e.target.value)}
                        className="w-40"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Section Client */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Avoir pour
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un client..."
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    className="pl-10"
                    disabled={clientsLoading}
                  />
                  {clientsLoading && <p className="text-sm text-gray-500 mt-2">Chargement des clients...</p>}
                </div>
                
                {clientSearch && !selectedClient && (
                  <div className="border rounded-lg max-h-48 overflow-y-auto">
                    {filteredClients.map((client) => (
                      <div
                        key={client.id}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                        onClick={() => {
                          setSelectedClient(client);
                          setClientSearch('');
                        }}
                      >
                        <div className="font-medium">{client.company || client.name}</div>
                        <div className="text-sm text-gray-600">{client.name}</div>
                        <div className="text-sm text-gray-500">{client.address}, {client.city}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                {selectedClient && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{selectedClient.company || selectedClient.name}</h4>
                        <p className="text-sm text-gray-600">{selectedClient.name}</p>
                        <p className="text-sm text-gray-600">{selectedClient.address}</p>
                        <p className="text-sm text-gray-600">{selectedClient.city} {selectedClient.postal_code}</p>
                        <p className="text-sm text-gray-600">{selectedClient.email}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedClient(null)}
                      >
                        Changer
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="originalInvoiceNumber">Facture d'origine</Label>
                    <Input
                      id="originalInvoiceNumber"
                      value={originalInvoiceNumber}
                      onChange={(e) => setOriginalInvoiceNumber(e.target.value)}
                      placeholder="Numéro de facture..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reason">Motif de l'avoir</Label>
                    <Input
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Motif de l'avoir..."
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Table des produits/services */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                 <CardTitle className="flex items-center">
                   <FileText className="mr-2 h-5 w-5" />
                   Éléments à créditer
                 </CardTitle>
                 <Button onClick={addCreditNoteItem} size="sm" className="bg-red-600 hover:bg-red-700">
                   <Plus className="h-4 w-4 mr-1" />
                   Ajouter une ligne
                 </Button>
              </div>
            </CardHeader>
             <CardContent>
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[35%]">Description</TableHead>
                    <TableHead className="w-[12%] text-center">Quantité</TableHead>
                    <TableHead className="w-[12%] text-right">Prix unitaire HT</TableHead>
                    <TableHead className="w-[10%] text-center">Remise %</TableHead>
                    <TableHead className="w-[10%] text-center">TVA</TableHead>
                    <TableHead className="w-[12%] text-right">Total HT</TableHead>
                    <TableHead className="w-[5%]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                   {creditNoteItems.map((item) => (
                     <TableRow key={item.id}>
                       <TableCell className="relative">
                         <Input
                           value={item.description}
                           onChange={(e) => {
                             updateCreditNoteItem(item.id, 'description', e.target.value);
                             handleProductSearch(item.id, e.target.value);
                           }}
                           placeholder="Tapez pour rechercher un produit..."
                           onFocus={() => {
                             setActiveItemId(item.id);
                             if (item.description.length >= 2) {
                               handleProductSearch(item.id, item.description);
                             }
                           }}
                           onBlur={(e) => {
                             // Délai pour permettre le clic sur une suggestion
                             setTimeout(() => {
                               const currentTarget = e.currentTarget;
                               const activeElement = document.activeElement;
                               if (!currentTarget || !activeElement || !currentTarget.contains(activeElement)) {
                                 setShowSuggestions(false);
                                 setActiveItemId(null);
                               }
                             }, 200);
                           }}
                           onKeyDown={(e) => {
                             if (e.key === 'Escape') {
                               setShowSuggestions(false);
                               setActiveItemId(null);
                             }
                           }}
                         />
                         
                         {/* Suggestions dropdown */}
                         {showSuggestions && activeItemId === item.id && searchSuggestions.length > 0 && (
                           <div 
                             className="fixed bg-white border border-gray-300 rounded-md shadow-xl max-h-48 overflow-y-auto min-w-[400px]"
                             style={{
                               zIndex: 9999,
                               top: `${(document.activeElement as HTMLElement)?.getBoundingClientRect().bottom + window.scrollY + 4}px`,
                               left: `${(document.activeElement as HTMLElement)?.getBoundingClientRect().left + window.scrollX}px`,
                               width: `${(document.activeElement as HTMLElement)?.getBoundingClientRect().width}px`
                             }}
                           >
                             {searchSuggestions.map((product) => (
                               <div
                                 key={product.id}
                                 className="p-3 hover:bg-red-50 cursor-pointer border-b last:border-b-0 flex justify-between items-start transition-colors"
                                 onMouseDown={(e) => {
                                   e.preventDefault(); // Empêche le blur de l'input
                                   selectProduct(item.id, product);
                                 }}
                               >
                                 <div className="flex-1">
                                   <div className="font-medium text-sm text-gray-900">{product.name}</div>
                                   {product.description && (
                                     <div className="text-xs text-gray-500 mt-1">{product.description}</div>
                                   )}
                                   <div className="text-xs text-gray-400 mt-1">
                                     {product.unit && `Unité: ${product.unit}`}
                                   </div>
                                 </div>
                                 <div className="text-sm font-medium text-red-600 ml-3">
                                   {formatCurrency(product.price)}
                                 </div>
                               </div>
                             ))}
                           </div>
                         )}
                         
                         {/* Message si aucun résultat */}
                         {showSuggestions && activeItemId === item.id && searchSuggestions.length === 0 && item.description.length >= 2 && (
                           <div className="absolute top-full left-0 right-0 z-[100] bg-white border border-gray-200 rounded-md shadow-lg p-3 text-center text-gray-500 text-sm mt-1">
                             Aucun produit trouvé pour "{item.description}"
                           </div>
                         )}
                       </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateCreditNoteItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="text-center"
                          min="0"
                          step="0.5"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateCreditNoteItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="text-right"
                          min="0"
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.discount}
                          onChange={(e) => updateCreditNoteItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                          className="text-center"
                          min="0"
                          max="100"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.vatRate}
                          onChange={(e) => updateCreditNoteItem(item.id, 'vatRate', parseFloat(e.target.value) || 0)}
                          className="text-center"
                          min="0"
                          max="100"
                        />
                      </TableCell>
                       <TableCell className="text-right font-medium">
                         {formatCurrency(item.total)}
                       </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCreditNoteItem(item.id)}
                          disabled={creditNoteItems.length === 1}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Section Totaux */}
          <div className="flex justify-end">
            <Card className="w-80">
              <CardHeader>
                <CardTitle>Totaux à créditer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                   <div className="flex justify-between">
                     <span>Sous-total HT:</span>
                     <span className="font-medium">{formatCurrency(subtotalHT + totalDiscount)}</span>
                   </div>
                   {totalDiscount > 0 && (
                     <div className="flex justify-between text-green-600">
                       <span>Remise totale:</span>
                       <span className="font-medium">-{formatCurrency(totalDiscount)}</span>
                     </div>
                   )}
                   <div className="flex justify-between">
                     <span>Net HT:</span>
                     <span className="font-medium">{formatCurrency(subtotalHT)}</span>
                   </div>
                   <div className="flex justify-between">
                     <span>TVA:</span>
                     <span className="font-medium">{formatCurrency(totalVAT)}</span>
                   </div>
                   <div className="border-t pt-2">
                     <div className="flex justify-between text-lg font-bold">
                       <span>Total TTC:</span>
                       <span className="text-red-600">{formatCurrency(totalTTC)}</span>
                     </div>
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes additionnelles sur l'avoir..."
                className="w-full h-32 p-3 border rounded-md resize-none"
              />
            </CardContent>
          </Card>

           {/* Actions */}
           <div className="flex justify-end space-x-3">
             <Button variant="outline" onClick={onClose}>
               Annuler
             </Button>
             <Button variant="ghost" onClick={handleSave}>
               Enregistrer (comme brouillon)
             </Button>
             <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
               Valider (générer l'avoir)
             </Button>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
