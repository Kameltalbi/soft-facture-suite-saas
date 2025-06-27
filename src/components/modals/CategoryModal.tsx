
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Save, X, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id?: string;
  nom: string;
  description: string;
  type: 'produit' | 'service';
  visible_public: boolean;
  tenant_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category;
  onSave: (category: Category) => void;
  onDelete?: (categoryId: string) => void;
}

export function CategoryModal({ isOpen, onClose, category, onSave, onDelete }: CategoryModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Category>({
    nom: '',
    description: '',
    type: 'produit',
    visible_public: false
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation en temps réel
  const isFormValid = formData.nom.trim().length > 0;

  useEffect(() => {
    if (category) {
      setFormData({
        nom: category.nom || '',
        description: category.description || '',
        type: category.type || 'produit',
        visible_public: category.visible_public || false,
        id: category.id,
        tenant_id: category.tenant_id,
        created_at: category.created_at,
        updated_at: category.updated_at
      });
    } else {
      setFormData({
        nom: '',
        description: '',
        type: 'produit',
        visible_public: false
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
      // Simulation d'un appel API - à remplacer par l'intégration Supabase
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onSave({
        ...formData,
        updated_at: new Date().toISOString()
      });
      
      toast({
        title: category ? "Catégorie modifiée" : "Catégorie créée",
        description: `La catégorie "${formData.nom}" a été ${category ? 'modifiée' : 'créée'} avec succès.`,
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
      // Simulation d'un appel API - à remplacer par l'intégration Supabase
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onDelete(category.id);
      
      toast({
        title: "Catégorie supprimée",
        description: `La catégorie "${category.nom}" a été supprimée avec succès.`,
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
              <Label htmlFor="nom">Nom de la catégorie *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => setFormData({...formData, nom: e.target.value})}
                placeholder="Ex: Sanitaires, Matériaux, Prestations..."
                required
                className={!isFormValid && formData.nom.length > 0 ? 'border-red-500' : ''}
              />
              {!isFormValid && formData.nom.length === 0 && (
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

            {/* Type de catégorie */}
            <div>
              <Label htmlFor="type">Type de catégorie</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: 'produit' | 'service') => setFormData({...formData, type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="produit">Produit</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Visibilité publique */}
            <div className="flex items-center justify-between p-3 border rounded-lg bg-neutral-50">
              <div>
                <Label htmlFor="visible_public" className="text-sm font-medium">
                  Visibilité publique
                </Label>
                <p className="text-xs text-neutral-500">
                  Afficher dans les listes publiques (si activé plus tard)
                </p>
              </div>
              <Switch
                id="visible_public"
                checked={formData.visible_public}
                onCheckedChange={(checked) => setFormData({...formData, visible_public: checked})}
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
                          Êtes-vous sûr de vouloir supprimer la catégorie "{category.nom}" ? 
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
