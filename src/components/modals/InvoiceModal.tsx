import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import { useProductsForModals } from '@/hooks/useProductsForModals';

interface InvoiceItem {
  id: string;
  product_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  total: number;
}

interface InvoiceModalProps {
  open: boolean;
  onClose: () => void;
  invoice?: any;
  onSave: (data: any) => void;
}

export function InvoiceModal({ open, onClose, invoice, onSave }: InvoiceModalProps) {
  const { clients, loading: clientsLoading } = useClients();
  const { products, loading: productsLoading } = useProductsForModals();
  
  const [formData, setFormData] = useState({
    invoice_number: '',
    client_id: '',
    date: new Date().toISOString().split('T')[0],
    due_date: '',
    notes: ''
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: '1',
      description: '',
      quantity: 1,
      unit_price: 0,
      tax_rate: 20,
      total: 0
    }
  ]);

  useEffect(() => {
    if (open) {
      if (invoice) {
        setFormData({
          invoice_number: invoice.invoice_number || '',
          client_id: invoice.client_id || '',
          date: invoice.date || new Date().toISOString().split('T')[0],
          due_date: invoice.due_date || '',
          notes: invoice.notes || ''
        });
        
        if (invoice.invoice_items && invoice.invoice_items.length > 0) {
          const convertedItems = invoice.invoice_items.map((item: any, index: number) => ({
            id: item.id || `${index + 1}`,
            product_id: item.product_id || '',
            description: item.description || '',
            quantity: Number(item.quantity) || 1,
            unit_price: Number(item.unit_price) || 0,
            tax_rate: Number(item.tax_rate) || 20,
            total: Number(item.total_price) || 0
          }));
          setItems(convertedItems);
        } else {
          setItems([{
            id: '1',
            description: '',
            quantity: 1,
            unit_price: 0,
            tax_rate: 20,
            total: 0
          }]);
        }
      } else {
        // Reset form for new invoice
        setFormData({
          invoice_number: '',
          client_id: '',
          date: new Date().toISOString().split('T')[0],
          due_date: '',
          notes: ''
        });
        setItems([{
          id: '1',
          description: '',
          quantity: 1,
          unit_price: 0,
          tax_rate: 20,
          total: 0
        }]);
      }
    }
  }, [open, invoice]);

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unit_price: 0,
      tax_rate: 20,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculer le total
        if (field === 'quantity' || field === 'unit_price') {
          updatedItem.total = updatedItem.quantity * updatedItem.unit_price;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const handleProductSelect = (itemId: string, productId: string) => {
    const selectedProduct = products.find(p => p.id === productId);
    if (selectedProduct) {
      updateItem(itemId, 'product_id', productId);
      updateItem(itemId, 'description', selectedProduct.name);
      updateItem(itemId, 'unit_price', selectedProduct.unit_price);
      updateItem(itemId, 'tax_rate', selectedProduct.tax_rate);
      
      // Recalculer le total avec la nouvelle quantité
      const currentItem = items.find(item => item.id === itemId);
      if (currentItem) {
        updateItem(itemId, 'total', currentItem.quantity * selectedProduct.unit_price);
      }
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTotalTax = () => {
    return items.reduce((sum, item) => sum + (item.total * item.tax_rate / 100), 0);
  };

  const calculateTotalTTC = () => {
    return calculateSubtotal() + calculateTotalTax();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const invoiceData = {
      ...formData,
      items: items.map(item => ({
        ...item,
        total_price: item.total
      })),
      subtotal: calculateSubtotal(),
      tax_amount: calculateTotalTax(),
      total_amount: calculateTotalTTC()
    };
    
    onSave(invoiceData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {invoice ? 'Modifier la facture' : 'Créer une nouvelle facture'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoice_number">Numéro de facture</Label>
              <Input
                id="invoice_number"
                value={formData.invoice_number}
                onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                placeholder="FAC-2024-001"
                required
              />
            </div>

            <div>
              <Label htmlFor="client_id">Client</Label>
              <Select
                value={formData.client_id}
                onValueChange={(value) => setFormData({ ...formData, client_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {!clientsLoading && clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} {client.company && `(${client.company})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="due_date">Date d'échéance</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
          </div>

          {/* Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Articles
                <Button type="button" onClick={addItem} size="sm" variant="outline">
                  <Plus size={16} className="mr-2" />
                  Ajouter un article
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-end border-b pb-4">
                  <div className="col-span-3">
                    <Label>Produit</Label>
                    <Select
                      value={item.product_id || ''}
                      onValueChange={(value) => handleProductSelect(item.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un produit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="custom">Produit personnalisé</SelectItem>
                        {!productsLoading && products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} - {product.unit_price.toFixed(2)}€
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-3">
                    <Label>Description</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Description de l'article"
                      required
                    />
                  </div>

                  <div className="col-span-1">
                    <Label>Quantité</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Prix unitaire HT</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unit_price}
                      onChange={(e) => updateItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="col-span-1">
                    <Label>TVA (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.tax_rate}
                      onChange={(e) => updateItem(item.id, 'tax_rate', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="col-span-1">
                    <Label>Total HT</Label>
                    <Input
                      type="number"
                      value={item.total.toFixed(2)}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Totaux */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total HT :</span>
                    <span>{calculateSubtotal().toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVA :</span>
                    <span>{calculateTotalTax().toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total TTC :</span>
                    <span>{calculateTotalTTC().toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notes additionnelles..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {invoice ? 'Modifier' : 'Créer'} la facture
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
