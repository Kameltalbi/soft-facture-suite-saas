
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Save } from 'lucide-react';

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  product?: any;
}

export function ProductModal({ open, onClose, product }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'product' as 'product' | 'service',
    price: 0,
    unit: 'unité',
    vatRate: 20,
    category: '',
    stockTracking: false,
    stock: 0
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        type: product.type || 'product',
        price: product.price || 0,
        unit: product.unit || 'unité',
        vatRate: product.vatRate || 20,
        category: product.category || '',
        stockTracking: product.stockTracking || false,
        stock: product.stock || 0
      });
    } else {
      setFormData({
        name: '',
        description: '',
        type: 'product',
        price: 0,
        unit: 'unité',
        vatRate: 20,
        category: '',
        stockTracking: false,
        stock: 0
      });
    }
  }, [product, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Product data:', formData);
    onClose();
  };

  const units = [
    'unité',
    'heure',
    'jour',
    'mois',
    'kg',
    'litre',
    'mètre',
    'lot'
  ];

  const categories = [
    'Services',
    'Informatique',
    'Formation',
    'Accessoires',
    'Logiciels',
    'Consultation',
    'Design',
    'Marketing'
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Modifier le produit/service' : 'Nouveau produit/service'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nom du produit ou service"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value: 'product' | 'service') => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">Produit</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Pricing and Units */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="price">Prix unitaire (€) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="unit">Unité</Label>
                <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map(unit => (
                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="vatRate">Taux de TVA (%)</Label>
                <Select value={formData.vatRate.toString()} onValueChange={(value) => setFormData({...formData, vatRate: parseFloat(value)})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0% (Exonéré)</SelectItem>
                    <SelectItem value="5.5">5.5% (Taux réduit)</SelectItem>
                    <SelectItem value="10">10% (Taux intermédiaire)</SelectItem>
                    <SelectItem value="20">20% (Taux normal)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Description détaillée du produit ou service"
              rows={3}
            />
          </div>

          {/* Stock Management */}
          <div className="space-y-4 p-4 border rounded-lg bg-neutral-50">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="stockTracking" className="text-sm font-medium">
                  Suivi des stocks
                </Label>
                <p className="text-xs text-neutral-500">
                  Activer pour les produits physiques uniquement
                </p>
              </div>
              <Switch
                id="stockTracking"
                checked={formData.stockTracking}
                onCheckedChange={(checked) => setFormData({...formData, stockTracking: checked})}
                disabled={formData.type === 'service'}
              />
            </div>

            {formData.stockTracking && (
              <div>
                <Label htmlFor="stock">Stock initial</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              <Save size={16} className="mr-2" />
              {product ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
