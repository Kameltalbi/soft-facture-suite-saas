
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Save, X, Trash2 } from 'lucide-react';
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
  onDelete?: (categoryId: string) => void;
}

export function CategoryModal({ isOpen, onClose, category, onSave, onDelete }: CategoryModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Omit<Category, 'id' | 'organization_id' | 'created_at' | 'updated_at'>>({
    name: '',
    description: '',
    color: '#3B82F6',
    active: true
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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
      onSave(formData);
      
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

  const handleDelete = async () => {
    if (!category?.id || !onDelete) return;
    
    setIsSubmitting(true);
    
    try {
      onDelete(category.id);
      
      toast({
        title: "Catégorie supprimée",
        description: `La catégorie "${category.name}" a été supprimée avec succès.`,
      });
      
      setShowDeleteDialog(false);
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
                placeholder="Ex: Services, Informatique, Formation..."
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
                placeholder="Description de la catégorie..."
                rows={3}
              />
            </div>

            {/* Couleur */}
            <div>
              <Label htmlFor="color">Couleur</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="w-12 h-10 rounded border cursor-pointer"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  placeholder="#3B82F6"
                  className="font-mono"
                />
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
            <div className="flex justify-between pt-4">
              <div>
                {category?.id && onDelete && (
                  <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="text-destructive hover:text-destructive border-destructive hover:bg-destructive/10"
                        disabled={isSubmitting}
                      >
                        <Trash2 size={16} className="mr-2" />
                        Supprimer
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer la catégorie "{category.name}" ? 
                          Cette action est irréversible et pourrait affecter les produits/services associés.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDelete}
                          className="bg-destructive hover:bg-destructive/90"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Suppression...' : 'Supprimer'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>

              <div className="flex space-x-2">
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
                  className="bg-primary hover:bg-primary/90"
                  disabled={!isFormValid || isSubmitting}
                >
                  <Save size={16} className="mr-2" />
                  {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
