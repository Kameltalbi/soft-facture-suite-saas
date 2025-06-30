
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

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

interface CategoryDeleteDialogProps {
  category: Category;
  isSubmitting: boolean;
  onDelete: () => void;
}

export function CategoryDeleteDialog({ category, isSubmitting, onDelete }: CategoryDeleteDialogProps) {
  return (
    <AlertDialog>
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
            onClick={onDelete}
            className="bg-destructive hover:bg-destructive/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Suppression...' : 'Supprimer'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
