
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

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

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { organization } = useAuth();

  const fetchCategories = async () => {
    if (!organization?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('organization_id', organization.id)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des catégories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [organization?.id]);

  const createCategory = async (categoryData: Omit<Category, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) => {
    if (!organization?.id) return { error: 'Organization not found' };

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          ...categoryData,
          organization_id: organization.id
        })
        .select()
        .single();

      if (error) throw error;
      
      // Refresh the categories list
      await fetchCategories();
      
      return { data, error: null };
    } catch (err) {
      console.error('Error creating category:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err.message : 'Erreur lors de la création de la catégorie' 
      };
    }
  };

  const updateCategory = async (id: string, categoryData: Omit<Category, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) => {
    if (!organization?.id) return { error: 'Organization not found' };

    try {
      const { data, error } = await supabase
        .from('categories')
        .update({
          ...categoryData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('organization_id', organization.id)
        .select()
        .single();

      if (error) throw error;
      
      // Refresh the categories list
      await fetchCategories();
      
      return { data, error: null };
    } catch (err) {
      console.error('Error updating category:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err.message : 'Erreur lors de la modification de la catégorie' 
      };
    }
  };

  const deleteCategory = async (id: string) => {
    if (!organization?.id) return { error: 'Organization not found' };

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('organization_id', organization.id);

      if (error) throw error;
      
      // Refresh the categories list
      await fetchCategories();
      
      return { error: null };
    } catch (err) {
      console.error('Error deleting category:', err);
      return { 
        error: err instanceof Error ? err.message : 'Erreur lors de la suppression de la catégorie' 
      };
    }
  };

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  };
}
