
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Trash2, Building2, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
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
  
  // Form state
  const [invoiceNumber, setInvoiceNumber] = useState(invoice?.number || 'FAC-2025-001');
  const [invoiceDate, setInvoiceDate] = useState(invoice?.date || new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(invoice?.dueDate || '');
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState(invoice?.client || null);
  const [notes, setNotes] = useState(invoice?.notes || '');
  
  // Line items
  const [lineItems, setLineItems] = useState<LineItem[]>(invoice?.lineItems || [
    { id: '1', description: '', quantity: 1, unitPrice: 0, vatRate: 20, total: 0 }
  ]);
  
  // Product search
  const [productSearch, setProductSearch] = useState('');
  
  // Mock clients for search
  const mockClients = [
    { id: '1', name: 'Client ABC', company: 'ABC SARL', address: 'Espace Tunis immeuble H. Bureau B3-1\nMontplaisir 1073 Tunis', email: 'contact@abc-sarl.info', phone: '+216 55 053 505' },
    { id: '2', name: 'Entreprise XYZ', company: 'XYZ Solutions', address: '456 Avenue République, 69000 Lyon', email: 'info@xyz.fr', phone: '+33 4 72 00 00 00' },
    { id: '3', name: 'Société Tech', company: 'Tech Innovation', address: '789 Boulevard Tech, 31000 Toulouse', email: 'hello@tech.fr', phone: '+33 5 61 00 00 00' }
  ];
  
  // Mock products for search
  const mockProducts = [
    { id: '1', name: 'Prestation de conseil', price: 60, vat: 20 },
    { id: '2', name: 'Développement web', price: 80, vat: 20 },
    { id: '3', name: 'Formation', price: 120, vat: 20 }
  ];
  
  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.company.toLowerCase().includes(clientSearch.toLowerCase())
  );
  
  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );
  
  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: 20,
      total: 0
    };
    setLineItems([...lineItems, newItem]);
  };
  
  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return item;
    }));
  };
  
  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };
  
  const calculateTotals = () => {
    const subtotalHT = lineItems.reduce((sum, item) => sum + item.total, 0);
    const totalVAT = lineItems.reduce((sum, item) => sum + (item.total * item.vatRate / 100), 0);
    return { subtotalHT, totalVAT, totalTTC: subtotalHT + totalVAT };
  };
  
  const { subtotalHT, totalVAT, totalTTC } = calculateTotals();
  
  const handleSave = () => {
    const invoiceData = {
      number: invoiceNumber,
      date: invoiceDate,
      dueDate,
      client: selectedClient,
      lineItems,
      notes,
      totals: { subtotalHT, totalVAT, totalTTC }
    };
    onSave(invoiceData);
    onClose();
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
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  {/* Logo de l'organisation */}
                  <div className="flex-shrink-0">
                    {organization?.logo_url ? (
                      <img 
                        src={organization.logo_url} 
                        alt="Logo organisation" 
                        className="h-20 w-20 object-contain border rounded-lg p-2"
                      />
                    ) : (
                      <div className="h-20 w-20 bg-gray-100 border rounded-lg flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Informations de l'organisation */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {organization?.name || user?.user_metadata?.company_name || 'Mon Entreprise'}
                    </h3>
                    <div className="mt-2 text-sm text-gray-600 space-y-1">
                      <p>{organization?.address || user?.user_metadata?.company_address || 'Adresse de l\'entreprise'}</p>
                      <p>{organization?.email || user?.email || 'email@entreprise.com'}</p>
                      <p>{organization?.phone || user?.user_metadata?.company_phone || 'Téléphone'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Section FACTURE */}
                <div className="text-right">
                  <h2 className="text-3xl font-bold text-blue-600 mb-4">FACTURE</h2>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="invoiceNumber" className="text-sm font-medium">Numéro</Label>
                      <Input
                        id="invoiceNumber"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                        className="w-48 mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="invoiceDate" className="text-sm font-medium">Date</Label>
                      <Input
                        id="invoiceDate"
                        type="date"
                        value={invoiceDate}
                        onChange={(e) => setInvoiceDate(e.target.value)}
                        className="w-48 mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dueDate" className="text-sm font-medium">Échéance</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-48 mt-1"
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
              <CardTitle className="flex items-center text-lg">
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
                  />
                </div>
                
                {clientSearch && !selectedClient && (
                  <div className="border rounded-lg max-h-48 overflow-y-auto bg-white">
                    {filteredClients.map((client) => (
                      <div
                        key={client.id}
                        className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                        onClick={() => {
                          setSelectedClient(client);
                          setClientSearch('');
                        }}
                      >
                        <div className="font-semibold text-gray-900">{client.company}</div>
                        <div className="text-sm text-gray-600">{client.name}</div>
                        <div className="text-sm text-gray-500 mt-1 whitespace-pre-line">{client.address}</div>
                        <div className="text-sm text-gray-500">{client.email}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                {selectedClient && (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-blue-900">{selectedClient.company}</h4>
                        <p className="text-sm text-blue-700">{selectedClient.name}</p>
                        <p className="text-sm text-blue-600 mt-1 whitespace-pre-line">{selectedClient.address}</p>
                        <p className="text-sm text-blue-600">{selectedClient.email}</p>
                        {selectedClient.phone && (
                          <p className="text-sm text-blue-600">{selectedClient.phone}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedClient(null)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Changer
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Articles / Services */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Articles / Services</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher un produit..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button onClick={addLineItem} size="sm" className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {productSearch && (
                <div className="mb-4 border rounded-lg max-h-32 overflow-y-auto bg-white">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex justify-between items-center"
                      onClick={() => {
                        const newItem: LineItem = {
                          id: Date.now().toString(),
                          description: product.name,
                          quantity: 1,
                          unitPrice: product.price,
                          vatRate: product.vat,
                          total: product.price
                        };
                        setLineItems([...lineItems, newItem]);
                        setProductSearch('');
                      }}
                    >
                      <span className="font-medium">{product.name}</span>
                      <span className="text-sm text-gray-500 font-medium">{product.price.toFixed(2)} €</span>
                    </div>
                  ))}
                </div>
              )}
              
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[40%] font-semibold">Description</TableHead>
                    <TableHead className="w-[12%] text-center font-semibold">Qté</TableHead>
                    <TableHead className="w-[15%] text-right font-semibold">P.U. HT</TableHead>
                    <TableHead className="w-[12%] text-center font-semibold">TVA</TableHead>
                    <TableHead className="w-[15%] text-right font-semibold">Total HT</TableHead>
                    <TableHead className="w-[6%]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Input
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                          placeholder="Description du produit/service"
                          className="border-0 bg-transparent p-0 focus-visible:ring-0"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="text-center border-0 bg-transparent p-0 focus-visible:ring-0"
                          min="0"
                          step="0.1"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="text-right border-0 bg-transparent p-0 focus-visible:ring-0"
                          min="0"
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.vatRate}
                          onChange={(e) => updateLineItem(item.id, 'vatRate', parseFloat(e.target.value) || 0)}
                          className="text-center border-0 bg-transparent p-0 focus-visible:ring-0"
                          min="0"
                          max="100"
                        />
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {item.total.toFixed(2)} €
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLineItem(item.id)}
                          disabled={lineItems.length === 1}
                          className="p-1 h-auto"
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
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total HT:</span>
                    <span className="font-medium">{subtotalHT.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>TVA:</span>
                    <span className="font-medium">{totalVAT.toFixed(2)} €</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>TOTAL TTC:</span>
                      <span className="text-blue-600">{totalTTC.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes additionnelles..."
                className="w-full h-24 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
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
