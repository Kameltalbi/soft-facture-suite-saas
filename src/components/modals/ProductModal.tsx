
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Save } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  product?: any;
}

export function ProductModal({ open, onClose, product }: ProductModalProps) {
  const { categories, loading: categoriesLoading } = useCategories();
  const { createProduct, updateProduct } = useProducts();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    unit: 'unité',
    category: '',
    stock_quantity: 0,
    sku: '',
    active: true,
    track_stock: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        // Convertir de centimes vers unité principale pour l'affichage
        price: (product.price || 0) / 100,
        unit: product.unit || 'unité',
        category: product.category || '',
        stock_quantity: product.stock_quantity || 0,
        sku: product.sku || '',
        active: product.active ?? true,
        track_stock: product.track_stock ?? true
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        unit: 'unité',
        category: '',
        stock_quantity: 0,
        sku: '',
        active: true,
        track_stock: true
      });
    }
    setError(null);
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation: vérifier que la catégorie est sélectionnée
    if (!formData.category) {
      setError('Veuillez sélectionner une catégorie');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convertir le prix vers centimes pour la sauvegarde
      const dataToSave = {
        ...formData,
        price: Math.round(formData.price * 100)
      };

      if (product) {
        // Mode édition
        const result = await updateProduct(product.id, dataToSave);
        if (result.error) {
          console.error('Error updating product:', result.error);
          setError(result.error);
        } else {
          console.log('Product updated successfully');
          onClose();
        }
      } else {
        // Mode création
        const result = await createProduct(dataToSave);
        if (result.error) {
          console.error('Error creating product:', result.error);
          setError(result.error);
        } else {
          console.log('Product created successfully');
          onClose();
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
      setError('Une erreur est survenue lors de la sauvegarde');
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Modifier le produit/service' : 'Nouveau produit/service'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

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
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  placeholder="Code produit (optionnel)"
                />
              </div>

              <div>
                <Label htmlFor="category">Catégorie *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({...formData, category: value})}
                  disabled={categoriesLoading}
                >
                  <SelectTrigger className={!formData.category ? "border-red-300" : ""}>
                    <SelectValue placeholder={categoriesLoading ? "Chargement..." : "Sélectionner une catégorie"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.name}>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          />
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Pricing and Units */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="price">Prix unitaire *</Label>
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
                <Label htmlFor="stock">Stock initial</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({...formData, stock_quantity: parseInt(e.target.value) || 0})}
                  disabled={!formData.track_stock}
                />
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

          {/* Suivi de stock */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-neutral-50">
            <div>
              <Label htmlFor="track_stock" className="text-sm font-medium">
                Suivi de stock
              </Label>
              <p className="text-xs text-neutral-500">
                Activer le suivi automatique des quantités en stock
              </p>
            </div>
            <Switch
              id="track_stock"
              checked={formData.track_stock}
              onCheckedChange={(checked) => setFormData({...formData, track_stock: checked})}
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-neutral-50">
            <div>
              <Label htmlFor="active" className="text-sm font-medium">
                Produit actif
              </Label>
              <p className="text-xs text-neutral-500">
                Les produits inactifs n'apparaissent pas dans les listes
              </p>
            </div>
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({...formData, active: checked})}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
              <Save size={16} className="mr-2" />
              {isSubmitting ? 'Enregistrement...' : (product ? 'Modifier' : 'Créer')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
