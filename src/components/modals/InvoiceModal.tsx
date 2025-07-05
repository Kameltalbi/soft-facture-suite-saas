import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Trash2, FileText, User, Calendar, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useClients } from '@/hooks/useClients';
import { useProducts } from '@/hooks/useProducts';
import { useInvoiceNumber } from '@/hooks/useInvoiceNumber';
import { useCustomTaxes } from '@/hooks/useCustomTaxes';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useCurrencies } from '@/hooks/useCurrencies';
import { calculateCustomTaxes, getTotalCustomTaxAmount } from '@/utils/customTaxCalculations';
import { InvoiceSettingsPopup } from '@/components/modals/InvoiceSettingsPopup';

interface InvoiceItem {
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

interface InvoiceModalProps {
  open: boolean;
  onClose: () => void;
  invoice?: any;
  onSave: (data: any) => void;
}

export function InvoiceModal({ open, onClose, invoice, onSave }: InvoiceModalProps) {
  const { organization, user } = useAuth();
  const { clients, loading: clientsLoading } = useClients();
  const { products, loading: productsLoading } = useProducts();
  const { nextInvoiceNumber, generateNextInvoiceNumber, isLoading: numberLoading } = useInvoiceNumber();
  const { customTaxes } = useCustomTaxes();
  const { currency } = useCurrency();
  const { currencies } = useCurrencies();
  
  // Form state variables
  const [invoiceNumber, setInvoiceNumber] = useState(invoice?.number || '');
  const [invoiceDate, setInvoiceDate] = useState(invoice?.date || new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(invoice?.dueDate || '');
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState(invoice?.client || null);
  const [subject, setSubject] = useState(invoice?.subject || '');
  const [notes, setNotes] = useState(invoice?.notes || '');
  
  // Invoice settings popup
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [invoiceSettings, setInvoiceSettings] = useState({
    useVat: invoice?.use_vat ?? true,
    customTaxesUsed: invoice?.custom_taxes_used || [],
    hasAdvance: invoice?.has_advance ?? false,
    advanceAmount: invoice?.advance_amount || 0,
    currencyId: invoice?.currency_id || (currencies.length > 0 ? currencies[0].id : ''),
    useDiscount: true // Nouveau paramètre pour les remises
  });
  
  // Invoice items
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>(invoice?.items || [
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

  // Filter clients based on search
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(clientSearch.toLowerCase()))
  );
  
  // Set default invoice number when modal opens for new invoice
  React.useEffect(() => {
    if (open && !invoice && nextInvoiceNumber && !invoiceNumber) {
      setInvoiceNumber(nextInvoiceNumber);
    }
  }, [open, invoice, nextInvoiceNumber, invoiceNumber]);

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
    
    setInvoiceItems(invoiceItems.map(item => {
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
  
  // Add a new empty invoice item
  const addInvoiceItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: 20,
      discount: 0,
      total: 0
    };
    setInvoiceItems([...invoiceItems, newItem]);
  };
  
  // Update an invoice item field and recalculate total
  const updateInvoiceItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoiceItems(invoiceItems.map(item => {
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
  
  // Remove an invoice item by id
  const removeInvoiceItem = (id: string) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== id));
  };
  
  // Calculate totals including custom taxes
  const calculateTotals = () => {
    const subtotalHT = invoiceItems.reduce((sum, item) => sum + item.total, 0);
    
    // Calculate discount only if enabled
    const totalDiscount = invoiceSettings.useDiscount 
      ? invoiceItems.reduce((sum, item) => {
          const subtotal = item.quantity * item.unitPrice;
          return sum + (subtotal * item.discount / 100);
        }, 0)
      : 0;
    
    // Apply VAT only if enabled
    const totalVAT = invoiceSettings.useVat 
      ? invoiceItems.reduce((sum, item) => sum + (item.total * item.vatRate / 100), 0)
      : 0;
    
    // Calculate custom taxes based on subtotal (only active ones)
    const activeCustomTaxes = customTaxes.filter(tax => invoiceSettings.customTaxesUsed.includes(tax.id));
    const customTaxCalculations = calculateCustomTaxes(subtotalHT, activeCustomTaxes, 'invoice');
    const totalCustomTaxes = getTotalCustomTaxAmount(customTaxCalculations);
    
    const totalTTC = subtotalHT + totalVAT + totalCustomTaxes;
    
    // Calculate advance and balance due
    const advanceAmount = invoiceSettings.hasAdvance ? invoiceSettings.advanceAmount : 0;
    const balanceDue = totalTTC - advanceAmount;
    
    return { 
      subtotalHT, 
      totalDiscount, 
      totalVAT, 
      totalCustomTaxes, 
      totalTTC, 
      customTaxCalculations,
      advanceAmount,
      balanceDue
    };
  };
  
  const { subtotalHT, totalDiscount, totalVAT, totalCustomTaxes, totalTTC, customTaxCalculations, advanceAmount, balanceDue } = calculateTotals();
  
  // Set default due date (30 days from now) if not set
  React.useEffect(() => {
    if (!dueDate) {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 30);
      setDueDate(defaultDate.toISOString().split('T')[0]);
    }
  }, [dueDate]);
  
  // Handle save as draft action
  const handleSaveAsDraft = async () => {
    // If new invoice and number not modified, generate new unique number
    let finalInvoiceNumber = invoiceNumber;
    if (!invoice && (!invoiceNumber || invoiceNumber === nextInvoiceNumber)) {
      finalInvoiceNumber = await generateNextInvoiceNumber();
    }

    const invoiceData = {
      number: finalInvoiceNumber,
      date: invoiceDate,
      dueDate,
      client: selectedClient,
      subject,
      items: invoiceItems,
      notes,
      totals: { subtotalHT, totalDiscount, totalVAT, totalCustomTaxes, totalTTC },
      customTaxes: customTaxCalculations,
      status: 'draft'
    };
    onSave(invoiceData);
    onClose();
  };

  // Handle validate action (finalize invoice)
  const handleValidate = async () => {
    // If new invoice and number not modified, generate new unique number
    let finalInvoiceNumber = invoiceNumber;
    if (!invoice && (!invoiceNumber || invoiceNumber === nextInvoiceNumber)) {
      finalInvoiceNumber = await generateNextInvoiceNumber();
    }

    const invoiceData = {
      number: finalInvoiceNumber,
      date: invoiceDate,
      dueDate,
      client: selectedClient,
      subject,
      items: invoiceItems,
      notes,
      totals: { subtotalHT, totalDiscount, totalVAT, totalCustomTaxes, totalTTC },
      customTaxes: customTaxCalculations,
      status: 'sent'
    };
    onSave(invoiceData);
    onClose();
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600">
            {invoice ? 'Modifier la facture' : 'Nouvelle facture'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with logo and organization info */}
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
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-blue-600">FACTURE</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSettingsPopup(true)}
                      className="ml-4 bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700"
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Paramètres
                    </Button>
                  </div>
                  <div className="space-y-2 mt-2">
                    <div>
                      <Label htmlFor="invoiceNumber">Numéro</Label>
                      <Input
                        id="invoiceNumber"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                        className="w-40"
                        placeholder={numberLoading ? "Génération..." : "FAC-2025-001"}
                        disabled={numberLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="invoiceDate">Date</Label>
                      <Input
                        id="invoiceDate"
                        type="date"
                        value={invoiceDate}
                        onChange={(e) => setInvoiceDate(e.target.value)}
                        className="w-40"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dueDate">Échéance</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-40"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Client Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Facturer à
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
                  <div className="bg-blue-50 p-4 rounded-lg">
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
                
                <div>
                  <Label htmlFor="subject">Objet de la facture</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Objet de la facture..."
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products/Services Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Produits / Services
                </CardTitle>
                <Button onClick={addInvoiceItem} size="sm" className="bg-blue-600 hover:bg-blue-700">
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
                    {invoiceSettings.useDiscount && <TableHead className="w-[10%] text-center">Remise %</TableHead>}
                    {invoiceSettings.useVat && <TableHead className="w-[10%] text-center">TVA</TableHead>}
                    <TableHead className="w-[12%] text-right">Total HT</TableHead>
                    <TableHead className="w-[5%]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoiceItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="relative">
                        <Input
                          value={item.description}
                          onChange={(e) => {
                            updateInvoiceItem(item.id, 'description', e.target.value);
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
                                className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 flex justify-between items-start transition-colors"
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
                                <div className="text-sm font-medium text-blue-600 ml-3">
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
                          onChange={(e) => updateInvoiceItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="text-center"
                          min="0"
                          step="0.5"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateInvoiceItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="text-right"
                          min="0"
                          step="0.01"
                        />
                      </TableCell>
                      {invoiceSettings.useDiscount && (
                        <TableCell>
                          <Input
                            type="number"
                            value={item.discount}
                            onChange={(e) => updateInvoiceItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                            className="text-center"
                            min="0"
                            max="100"
                          />
                        </TableCell>
                      )}
                      {invoiceSettings.useVat && (
                        <TableCell>
                          <Input
                            type="number"
                            value={item.vatRate}
                            onChange={(e) => updateInvoiceItem(item.id, 'vatRate', parseFloat(e.target.value) || 0)}
                            className="text-center"
                            min="0"
                            max="100"
                          />
                        </TableCell>
                      )}
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.total)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeInvoiceItem(item.id)}
                          disabled={invoiceItems.length === 1}
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

          {/* Totals Section */}
          <div className="flex justify-end">
            <Card className="w-80">
              <CardHeader>
                <CardTitle>Totaux</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total HT:</span>
                    <span className="font-medium">{formatCurrency(subtotalHT + totalDiscount)}</span>
                  </div>
                   {invoiceSettings.useDiscount && totalDiscount > 0 && (
                     <div className="flex justify-between text-green-600">
                       <span>Remise totale:</span>
                       <span className="font-medium">-{formatCurrency(totalDiscount)}</span>
                     </div>
                   )}
                   <div className="flex justify-between">
                     <span>Net HT:</span>
                     <span className="font-medium">{formatCurrency(subtotalHT)}</span>
                   </div>
                   
                   {/* Afficher la TVA seulement si elle est activée */}
                   {invoiceSettings.useVat && (
                     <div className="flex justify-between">
                       <span>TVA:</span>
                       <span className="font-medium">{formatCurrency(totalVAT)}</span>
                     </div>
                   )}
                  
                  {/* Display custom taxes */}
                  {customTaxCalculations.map((tax) => (
                    <div key={tax.id} className="flex justify-between text-orange-600">
                      <span>{tax.name} ({tax.type === 'percentage' ? `${tax.value}%` : `${tax.value} ${currency.symbol}`}):</span>
                      <span className="font-medium">{formatCurrency(tax.amount)}</span>
                    </div>
                  ))}
                  
                   <div className="border-t pt-2">
                     <div className="flex justify-between text-lg font-bold">
                       <span>Total TTC:</span>
                       <span className="text-blue-600">{formatCurrency(totalTTC)}</span>
                     </div>
                     
                     {/* Avance perçue et solde à payer */}
                     {invoiceSettings.hasAdvance && (
                       <>
                         <div className="flex justify-between items-center text-purple-600 mt-2">
                           <span>Avance perçue:</span>
                           <div className="flex items-center gap-2">
                             <Input
                               type="number"
                               min="0"
                               step="0.01"
                               value={invoiceSettings.advanceAmount}
                               onChange={(e) => setInvoiceSettings(prev => ({
                                 ...prev,
                                 advanceAmount: parseFloat(e.target.value) || 0
                               }))}
                               className="w-24 h-8 text-right text-sm"
                               placeholder="0.00"
                             />
                             <span className="font-medium">TND</span>
                           </div>
                         </div>
                         <div className="flex justify-between text-xl font-bold text-red-600 border-t mt-2 pt-2">
                           <span>Solde à payer:</span>
                           <span>{formatCurrency(balanceDue)}</span>
                         </div>
                       </>
                     )}
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes Section */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes additionnelles..."
                className="w-full h-32 p-3 border rounded-md resize-none"
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button variant="ghost" onClick={handleSaveAsDraft}>
              Enregistrer (comme brouillon)
            </Button>
            <Button onClick={handleValidate} className="bg-blue-600 hover:bg-blue-700">
              Valider (générer la facture)
            </Button>
          </div>
        </div>

        {/* Settings Popup */}
        <InvoiceSettingsPopup
          isOpen={showSettingsPopup}
          onClose={() => setShowSettingsPopup(false)}
          onApply={(settings) => setInvoiceSettings(settings)}
          currentSettings={invoiceSettings}
          totalAmount={totalTTC}
        />
      </DialogContent>
    </Dialog>
  );
}
