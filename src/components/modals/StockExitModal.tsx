
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingDown } from 'lucide-react';

interface StockExitModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Array<{
    id: string;
    nom: string;
    unite: string;
    stock_actuel: number;
  }>;
  onSave: (productId: string, quantity: number, reason: string, comment: string) => void;
}

const exitReasons = [
  'Livraison client',
  'Vente directe',
  'Retour fournisseur',
  'Casse/Perte',
  'Utilisation interne',
  'Échantillon',
  'Autre'
];

export function StockExitModal({ isOpen, onClose, products, onSave }: StockExitModalProps) {
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 0,
    reason: '',
    date: new Date().toISOString().split('T')[0],
    comment: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        productId: '',
        quantity: 0,
        reason: '',
        date: new Date().toISOString().split('T')[0],
        comment: ''
      });
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productId || formData.quantity <= 0 || !formData.reason) {
      return;
    }

    onSave(formData.productId, formData.quantity, formData.reason, formData.comment);
    onClose();
  };

  const selectedProduct = products.find(p => p.id === formData.productId);
  const maxQuantity = selectedProduct?.stock_actuel || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-600" />
            Sortie de stock
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
                    {product.nom} (Stock: {product.stock_actuel} {product.unite})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="quantity">Quantité sortie *</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="quantity"
                type="number"
                min="1"
                max={maxQuantity}
                step="1"
                value={formData.quantity || ''}
                onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                placeholder="0"
                required
              />
              {selectedProduct && (
                <span className="text-sm text-neutral-500">
                  {selectedProduct.unite} (max: {maxQuantity})
                </span>
              )}
            </div>
            {formData.quantity > maxQuantity && (
              <p className="text-sm text-red-600 mt-1">
                Quantité supérieure au stock disponible
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="reason">Motif *</Label>
            <Select value={formData.reason} onValueChange={(value) => setFormData({...formData, reason: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un motif" />
              </SelectTrigger>
              <SelectContent>
                {exitReasons.map(reason => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date">Date de sortie</Label>
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
              placeholder="Détails supplémentaires (référence client, numéro de commande, etc.)"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="bg-red-600 hover:bg-red-700"
              disabled={!formData.productId || formData.quantity <= 0 || !formData.reason || formData.quantity > maxQuantity}
            >
              <TrendingDown size={16} className="mr-2" />
              Enregistrer la sortie
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
