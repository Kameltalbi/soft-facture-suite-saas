
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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface QuoteItem {
  id: string;
  product_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  total: number;
}

interface QuoteModalProps {
  open: boolean;
  onClose: () => void;
  quote?: any;
  onSave: (data: any) => void;
}

export function QuoteModal({ open, onClose, quote, onSave }: QuoteModalProps) {
  const { clients, loading: clientsLoading } = useClients();
  const { products, loading: productsLoading } = useProductsForModals();
  const { organization } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    quote_number: '',
    client_id: '',
    date: new Date().toISOString().split('T')[0],
    valid_until: '',
    notes: ''
  });

  const [items, setItems] = useState<QuoteItem[]>([
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
    if (quote) {
      setFormData({
        quote_number: quote.quote_number || '',
        client_id: quote.client_id || '',
        date: quote.date || new Date().toISOString().split('T')[0],
        valid_until: quote.valid_until || '',
        notes: quote.notes || ''
      });
      
      if (quote.quote_items && quote.quote_items.length > 0) {
        const convertedItems = quote.quote_items.map((item: any, index: number) => ({
          id: item.id || `${index + 1}`,
          product_id: item.product_id || '',
          description: item.description || '',
          quantity: Number(item.quantity) || 1,
          unit_price: Number(item.unit_price) || 0,
          tax_rate: Number(item.tax_rate) || 20,
          total: Number(item.total_price) || 0
        }));
        setItems(convertedItems);
      }
    } else {
      // Reset form for new quote
      setFormData({
        quote_number: '',
        client_id: '',
        date: new Date().toISOString().split('T')[0],
        valid_until: '',
        notes: ''
      });
      setItems([
        {
          id: '1',
          description: '',
          quantity: 1,
          unit_price: 0,
          tax_rate: 20,
          total: 0
        }
      ]);
    }
  }, [quote, open]);

  const addItem = () => {
    const newItem: QuoteItem = {
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

  const updateItem = (id: string, field: keyof QuoteItem, value: any) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!organization?.id) {
      toast.error('Organisation non trouvée');
      return;
    }

    if (!formData.quote_number.trim()) {
      toast.error('Le numéro de devis est requis');
      return;
    }

    if (!formData.client_id) {
      toast.error('Veuillez sélectionner un client');
      return;
    }

    if (items.length === 0 || !items.some(item => item.description.trim())) {
      toast.error('Veuillez ajouter au moins un article');
      return;
    }

    setIsSubmitting(true);

    try {
      const quoteData = {
        quote_number: formData.quote_number,
        client_id: formData.client_id,
        organization_id: organization.id,
        date: formData.date,
        valid_until: formData.valid_until || null,
        notes: formData.notes || null,
        status: 'draft',
        subtotal: calculateSubtotal(),
        tax_amount: calculateTotalTax(),
        total_amount: calculateTotalTTC()
      };

      let result;
      if (quote?.id) {
        // Update existing quote
        const { data: updatedQuote, error: updateError } = await supabase
          .from('quotes')
          .update(quoteData)
          .eq('id', quote.id)
          .select()
          .single();

        if (updateError) throw updateError;
        result = updatedQuote;

        // Delete existing items
        await supabase
          .from('quote_items')
          .delete()
          .eq('quote_id', quote.id);
      } else {
        // Create new quote
        const { data: newQuote, error: createError } = await supabase
          .from('quotes')
          .insert(quoteData)
          .select()
          .single();

        if (createError) throw createError;
        result = newQuote;
      }

      // Insert quote items with organization_id
      const quoteItems = items
        .filter(item => item.description.trim())
        .map(item => ({
          quote_id: result.id,
          organization_id: organization.id, // Added missing organization_id
          product_id: item.product_id || null,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          tax_rate: item.tax_rate,
          total_price: item.total
        }));

      if (quoteItems.length > 0) {
        const { error: itemsError } = await supabase
          .from('quote_items')
          .insert(quoteItems);

        if (itemsError) throw itemsError;
      }

      toast.success(quote ? 'Devis modifié avec succès' : 'Devis créé avec succès');
      onSave(result);
      onClose();
    } catch (error) {
      console.error('Error saving quote:', error);
      toast.error('Erreur lors de la sauvegarde du devis');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {quote ? 'Modifier le devis' : 'Créer un nouveau devis'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quote_number">Numéro de devis *</Label>
              <Input
                id="quote_number"
                value={formData.quote_number}
                onChange={(e) => setFormData({ ...formData, quote_number: e.target.value })}
                placeholder="DEV-2024-001"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="client_id">Client *</Label>
              <Select
                value={formData.client_id}
                onValueChange={(value) => setFormData({ ...formData, client_id: value })}
                required
                disabled={isSubmitting || clientsLoading}
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
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="valid_until">Valide jusqu'au</Label>
              <Input
                id="valid_until"
                type="date"
                value={formData.valid_until}
                onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Articles
                <Button 
                  type="button" 
                  onClick={addItem} 
                  size="sm" 
                  variant="outline"
                  disabled={isSubmitting}
                >
                  <Plus size={16} className="mr-2" />
                  Ajouter un article
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-end border-b pb-4">
                  <div className="col-span-3">
                    <Label>Produit</Label>
                    <Select
                      value={item.product_id || ''}
                      onValueChange={(value) => handleProductSelect(item.id, value)}
                      disabled={isSubmitting || productsLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un produit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Produit personnalisé</SelectItem>
                        {!productsLoading && products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} - {product.unit_price.toFixed(2)}€
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-3">
                    <Label>Description *</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Description de l'article"
                      required
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                      disabled={items.length === 1 || isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="bg-[#6A9C89] hover:bg-[#5A8B7A]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sauvegarde...' : (quote ? 'Modifier' : 'Créer')} le devis
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
