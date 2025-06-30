
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { CategoryForm } from './CategoryModal/CategoryForm';

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
  const [formData, setFormData] = useState<Category>({
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
        active: category.active !== undefined ? category.active : true,
        id: category.id,
        organization_id: category.organization_id,
        created_at: category.created_at,
        updated_at: category.updated_at
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
      await onSave({
        name: formData.name,
        description: formData.description,
        color: formData.color,
        active: formData.active
      });
      
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </DialogTitle>
        </DialogHeader>

        <CategoryForm
          formData={formData}
          onFormDataChange={setFormData}
          onSubmit={handleSubmit}
          onClose={onClose}
          onDelete={handleDelete}
          isSubmitting={isSubmitting}
          isFormValid={isFormValid}
          category={category}
        />
      </DialogContent>
    </Dialog>
  );
}
