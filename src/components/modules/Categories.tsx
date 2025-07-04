
import { useState } from 'react';
import { CategoryModal } from '@/components/modals/CategoryModal';
import { ImportCategoriesModal } from '@/components/modals/ImportCategoriesModal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useCategories } from '@/hooks/useCategories';
import { useToast } from '@/hooks/use-toast';
import { CategoriesHeader } from './Categories/CategoriesHeader';
import { CategoryStats } from './Categories/CategoryStats';
import { CategoriesTable } from './Categories/CategoriesTable';

interface Category {
  id: string;
  name: string;
  description: string | null;
  color: string;
  active: boolean;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const { categories, loading, createCategory, updateCategory, deleteCategory, fetchCategories } = useCategories();
  const { toast } = useToast();

  console.log('Categories loaded:', categories);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleEditCategory = (category: Category) => {
    console.log('Editing category:', category);
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleSaveCategory = async (data: Omit<Category, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) => {
    console.log('Saving category data:', data);
    let result;
    
    if (editingCategory) {
      result = await updateCategory(editingCategory.id, data);
    } else {
      result = await createCategory(data);
    }
    
    if (result.error) {
      console.error('Error saving category:', result.error);
    } else {
      console.log('Category saved successfully');
      setShowModal(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const category = categories.find(c => c.id === id);
    if (category) {
      setCategoryToDelete(category);
    }
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    
    const result = await deleteCategory(categoryToDelete.id);
    if (result.error) {
      console.error('Error deleting category:', result.error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de la catégorie",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Succès",
        description: `La catégorie "${categoryToDelete.name}" a été supprimée avec succès`
      });
    }
    setCategoryToDelete(null);
  };

  const handleViewCategory = (category: Category) => {
    console.log('Viewing category:', category);
  };

  const handleImportCategories = () => {
    setShowImportModal(true);
  };

  const handleExportCategories = () => {
    if (categories.length === 0) {
      toast({
        title: "Aucune catégorie à exporter",
        description: "Vous n'avez aucune catégorie dans votre liste",
        variant: "destructive"
      });
      return;
    }

    // Créer le CSV
    const headers = ['name', 'description', 'color', 'active'];
    const csvContent = [
      headers.join(','),
      ...categories.map(category => [
        `"${category.name || ''}"`,
        `"${category.description || ''}"`,
        `"${category.color || '#3B82F6'}"`,
        `"${category.active ? 'true' : 'false'}"`
      ].join(','))
    ].join('\n');

    // Télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `categories_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export réussi",
      description: `${categories.length} catégorie(s) exportée(s) avec succès`
    });
  };

  const handleImportComplete = () => {
    fetchCategories();
  };

  const stats = {
    totalCategories: categories.length,
    activeCategories: categories.filter(c => c.active).length,
    colors: new Set(categories.map(c => c.color)).size,
    recentCategories: categories.filter(c => {
      const createdDate = new Date(c.created_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - createdDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }).length
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement des catégories...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-[#F7F9FA] min-h-screen">
      <CategoriesHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddCategory={handleAddCategory}
        onImportCategories={handleImportCategories}
        onExportCategories={handleExportCategories}
      />

      <CategoryStats
        totalCategories={stats.totalCategories}
        activeCategories={stats.activeCategories}
        colors={stats.colors}
        recentCategories={stats.recentCategories}
      />

      <CategoriesTable
        categories={filteredCategories}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
        onViewCategory={handleViewCategory}
      />

      <CategoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveCategory}
        category={editingCategory}
        onDelete={editingCategory ? () => handleDeleteCategory(editingCategory.id) : undefined}
      />

      <ImportCategoriesModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportComplete={handleImportComplete}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la catégorie <strong>"{categoryToDelete?.name}"</strong> ? 
              Cette action est irréversible et pourrait affecter les produits associés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteCategory}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Categories;
