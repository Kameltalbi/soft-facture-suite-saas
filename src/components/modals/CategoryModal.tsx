
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id?: string;
  name: string;
  description: string;
  color: string;
  active: boolean;
  organization_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category;
  onSave: (category: Omit<Category, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) => void;
}

const predefinedColors = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6B7280', // Gray
  '#DC2626', // Red-600
  '#059669', // Green-600
  '#7C3AED', // Violet-600
  '#DB2777', // Pink-600
  '#0891B2', // Cyan-600
  '#65A30D'  // Lime-600
];

export function CategoryModal({ isOpen, onClose, category, onSave }: CategoryModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Omit<Category, 'id' | 'organization_id' | 'created_at' | 'updated_at'>>({
    name: '',
    description: '',
    color: '#3B82F6',
    active: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation en temps réel
  const isFormValid = formData.name.trim().length > 0;

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        color: category.color || '#3B82F6',
        active: category.active ?? true
      });
    } else {
      setFormData({
        name: '',
        description: '',
        color: '#3B82F6',
        active: true
      });
    }
  }, [category, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast({
        title: "Erreur de validation",
        description: "Le nom de la catégorie est requis.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      
      toast({
        title: category ? "Catégorie modifiée" : "Catégorie créée",
        description: `La catégorie "${formData.name}" a été ${category ? 'modifiée' : 'créée'} avec succès.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom de la catégorie */}
          <div>
            <Label htmlFor="name">Nom de la catégorie *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Ex: Sanitaires, Matériaux, Prestations..."
              required
              className={!isFormValid && formData.name.length > 0 ? 'border-red-500' : ''}
            />
            {!isFormValid && formData.name.length === 0 && (
              <p className="text-xs text-red-500 mt-1">Le nom est requis</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Description ou remarque sur cette catégorie..."
              rows={3}
            />
          </div>

          {/* Sélecteur de couleur */}
          <div>
            <Label htmlFor="color">Couleur de la catégorie</Label>
            <div className="space-y-3">
              {/* Couleur actuelle */}
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: formData.color }}
                />
                <Input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  placeholder="#3B82F6"
                  className="font-mono text-sm"
                />
              </div>
              
              {/* Palette de couleurs prédéfinies */}
              <div className="grid grid-cols-8 gap-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform ${
                      formData.color === color ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData({...formData, color})}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Statut actif */}
          <div className="flex items-center justify-between p-3 border rounded-lg bg-neutral-50">
            <div>
              <Label htmlFor="active" className="text-sm font-medium">
                Catégorie active
              </Label>
              <p className="text-xs text-neutral-500">
                Les catégories inactives n'apparaissent pas dans les listes
              </p>
            </div>
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({...formData, active: checked})}
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              <X size={16} className="mr-2" />
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="bg-[#6A9C89] hover:bg-[#5a8473]"
              disabled={!isFormValid || isSubmitting}
            >
              <Save size={16} className="mr-2" />
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
