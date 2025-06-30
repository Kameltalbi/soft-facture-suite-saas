
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Trash2, FileText, User, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useClients } from '@/hooks/useClients';
import { useProducts } from '@/hooks/useProducts';
import { useInvoiceNumber } from '@/hooks/useInvoiceNumber';
import { useCurrency } from '@/contexts/CurrencyContext';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  discount: number;
  total: number;
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
  const { currency } = useCurrency();
  
  // Form state
  const [invoiceNumber, setInvoiceNumber] = useState(invoice?.number || '');
  const [invoiceDate, setInvoiceDate] = useState(invoice?.date || new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(invoice?.dueDate || '');
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState(invoice?.client || null);
  const [subject, setSubject] = useState(invoice?.subject || '');
  const [notes, setNotes] = useState(invoice?.notes || '');
  
  // Invoice items
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>(invoice?.items || [
    { id: '1', description: '', quantity: 1, unitPrice: 0, vatRate: 20, discount: 0, total: 0 }
  ]);
  
  // Product search
  const [productSearch, setProductSearch] = useState('');
  
  // Set default invoice number when modal opens for new invoice
  React.useEffect(() => {
    if (open && !invoice && nextInvoiceNumber && !invoiceNumber) {
      setInvoiceNumber(nextInvoiceNumber);
    }
  }, [open, invoice, nextInvoiceNumber, invoiceNumber]);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(clientSearch.toLowerCase()))
  );
  
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(productSearch.toLowerCase()))
  );
  
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
  
  const removeInvoiceItem = (id: string) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== id));
  };
  
  const calculateTotals = () => {
    const subtotalHT = invoiceItems.reduce((sum, item) => sum + item.total, 0);
    const totalDiscount = invoiceItems.reduce((sum, item) => {
      const subtotal = item.quantity * item.unitPrice;
      return sum + (subtotal * item.discount / 100);
    }, 0);
    const totalVAT = invoiceItems.reduce((sum, item) => sum + (item.total * item.vatRate / 100), 0);
    const totalTTC = subtotalHT + totalVAT;
    
    return { subtotalHT, totalDiscount, totalVAT, totalTTC };
  };
  
  const { subtotalHT, totalDiscount, totalVAT, totalTTC } = calculateTotals();
  
  // Set default due date (30 days from now)
  React.useEffect(() => {
    if (!dueDate) {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 30);
      setDueDate(defaultDate.toISOString().split('T')[0]);
    }
  }, [dueDate]);
  
  const handleSave = async () => {
    // Si c'est une nouvelle facture et que le numéro n'a pas été modifié, générer un nouveau numéro unique
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
      totals: { subtotalHT, totalDiscount, totalVAT, totalTTC }
    };
    onSave(invoiceData);
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-FR', { 
      style: 'currency', 
      currency: currency.code 
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
                  <h2 className="text-2xl font-bold text-blue-600">FACTURE</h2>
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

          {/* Section Client */}
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

          {/* Table des produits/services */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Produits / Services
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher un produit..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="pl-10 w-64"
                      disabled={productsLoading}
                    />
                    {productsLoading && <p className="text-xs text-gray-500 mt-1">Chargement...</p>}
                  </div>
                  <Button onClick={addInvoiceItem} size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {productSearch && (
                <div className="mb-4 border rounded-lg max-h-32 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="p-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex justify-between"
                      onClick={() => {
                        const newItem: InvoiceItem = {
                          id: Date.now().toString(),
                          description: product.name,
                          quantity: 1,
                          unitPrice: product.price,
                          vatRate: 20,
                          discount: 0,
                          total: product.price
                        };
                        setInvoiceItems([...invoiceItems, newItem]);
                        setProductSearch('');
                      }}
                    >
                      <div>
                        <span className="font-medium">{product.name}</span>
                        {product.description && <p className="text-xs text-gray-500">{product.description}</p>}
                      </div>
                      <span className="text-sm text-gray-500">{formatCurrency(product.price)}</span>
                    </div>
                  ))}
                </div>
              )}
              
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
                  {invoiceItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Input
                          value={item.description}
                          onChange={(e) => updateInvoiceItem(item.id, 'description', e.target.value)}
                          placeholder="Description du produit/service"
                        />
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

          {/* Section Totaux */}
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
                      <span className="text-blue-600">{formatCurrency(totalTTC)}</span>
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
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              {invoice ? 'Mettre à jour' : 'Créer la facture'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
