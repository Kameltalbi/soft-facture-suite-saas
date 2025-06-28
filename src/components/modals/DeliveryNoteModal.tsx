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

interface DeliveryNoteItem {
  id: string;
  product_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  total: number;
}

interface DeliveryNoteModalProps {
  open: boolean;
  onClose: () => void;
  deliveryNote?: any;
  onSave: (data: any) => void;
}

export function DeliveryNoteModal({ open, onClose, deliveryNote, onSave }: DeliveryNoteModalProps) {
  const { clients, loading: clientsLoading } = useClients();
  const { products, loading: productsLoading } = useProductsForModals();
  
  const [formData, setFormData] = useState({
    delivery_number: '',
    client_id: '',
    date: new Date().toISOString().split('T')[0],
    expected_delivery_date: '',
    delivery_address: '',
    notes: ''
  });

  const [items, setItems] = useState<DeliveryNoteItem[]>([
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
      if (deliveryNote) {
        setFormData({
          delivery_number: deliveryNote.delivery_number || '',
          client_id: deliveryNote.client_id || '',
          date: deliveryNote.date || new Date().toISOString().split('T')[0],
          expected_delivery_date: deliveryNote.expected_delivery_date || '',
          delivery_address: deliveryNote.delivery_address || '',
          notes: deliveryNote.notes || ''
        });
        
        if (deliveryNote.delivery_note_items && deliveryNote.delivery_note_items.length > 0) {
          const convertedItems = deliveryNote.delivery_note_items.map((item: any, index: number) => ({
            id: item.id || `${index + 1}`,
            product_id: item.product_id || '',
            description: item.description || '',
            quantity: Number(item.quantity) || 1,
            unit_price: 0, // Les bons de livraison peuvent ne pas avoir de prix
            tax_rate: 20,
            total: 0
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
        // Reset form for new delivery note
        setFormData({
          delivery_number: '',
          client_id: '',
          date: new Date().toISOString().split('T')[0],
          expected_delivery_date: '',
          delivery_address: '',
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
  }, [open, deliveryNote]);

  const addItem = () => {
    const newItem: DeliveryNoteItem = {
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

  const updateItem = (id: string, field: keyof DeliveryNoteItem, value: any) => {
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
    
    const deliveryData = {
      ...formData,
      items: items.map(item => ({
        ...item,
        total_price: item.total
      })),
      subtotal: calculateSubtotal(),
      tax_amount: calculateTotalTax(),
      total_amount: calculateTotalTTC()
    };
    
    onSave(deliveryData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {deliveryNote ? 'Modifier le bon de livraison' : 'Créer un nouveau bon de livraison'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="delivery_number">Numéro de bon de livraison</Label>
              <Input
                id="delivery_number"
                value={formData.delivery_number}
                onChange={(e) => setFormData({ ...formData, delivery_number: e.target.value })}
                placeholder="BL-2024-001"
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
              <Label htmlFor="expected_delivery_date">Date de livraison prévue</Label>
              <Input
                id="expected_delivery_date"
                type="date"
                value={formData.expected_delivery_date}
                onChange={(e) => setFormData({ ...formData, expected_delivery_date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="delivery_address">Adresse de livraison</Label>
            <Textarea
              id="delivery_address"
              value={formData.delivery_address}
              onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
              placeholder="Adresse de livraison..."
              rows={2}
            />
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
                  <div className="col-span-4">
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
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-4">
                    <Label>Description</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Description de l'article"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Quantité</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
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
            <Button type="submit" className="bg-success hover:bg-success/90">
              {deliveryNote ? 'Modifier' : 'Créer'} le bon de livraison
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
