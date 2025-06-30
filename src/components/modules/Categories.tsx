
import { useState } from 'react';
import { CategoryModal } from '@/components/modals/CategoryModal';
import { useCategories } from '@/hooks/useCategories';
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
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { categories, loading, createCategory, updateCategory, deleteCategory } = useCategories();

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
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      console.log('Deleting category:', id);
      const result = await deleteCategory(id);
      if (result.error) {
        console.error('Error deleting category:', result.error);
      }
    }
  };

  const handleViewCategory = (category: Category) => {
    console.log('Viewing category:', category);
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
    </div>
  );
};

export default Categories;
