
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp } from 'lucide-react';

interface StockEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Array<{
    id: string;
    nom: string;
    unite: string;
  }>;
  onSave: (productId: string, quantity: number, comment: string) => void;
}

export function StockEntryModal({ isOpen, onClose, products, onSave }: StockEntryModalProps) {
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 0,
    date: new Date().toISOString().split('T')[0],
    comment: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        productId: '',
        quantity: 0,
        date: new Date().toISOString().split('T')[0],
        comment: ''
      });
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productId || formData.quantity <= 0) {
      return;
    }

    onSave(formData.productId, formData.quantity, formData.comment);
    onClose();
  };

  const selectedProduct = products.find(p => p.id === formData.productId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Entrée de stock
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="product">Produit *</Label>
            <Select value={formData.productId} onValueChange={(value) => setFormData({...formData, productId: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un produit" />
              </SelectTrigger>
              <SelectContent>
                {products.map(product => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="quantity">Quantité entrée *</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="quantity"
                type="number"
                min="1"
                step="1"
                value={formData.quantity || ''}
                onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                placeholder="0"
                required
              />
              {selectedProduct && (
                <span className="text-sm text-neutral-500">{selectedProduct.unite}</span>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="date">Date d'entrée</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="comment">Commentaire</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({...formData, comment: e.target.value})}
              placeholder="Motif de l'entrée (réception fournisseur, retour client, etc.)"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700"
              disabled={!formData.productId || formData.quantity <= 0}
            >
              <TrendingUp size={16} className="mr-2" />
              Enregistrer l'entrée
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
