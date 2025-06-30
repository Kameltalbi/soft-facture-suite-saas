
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  unit: string | null;
  stock_quantity: number | null;
  category: string | null;
  sku: string | null;
  active: boolean | null;
  track_stock: boolean | null;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { organization } = useAuth();

  const fetchProducts = async () => {
    if (!organization?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('organization_id', organization.id)
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [organization?.id]);

  const createProduct = async (productData: Omit<Product, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) => {
    if (!organization?.id) return { error: 'Organization not found' };

    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          ...productData,
          organization_id: organization.id
        })
        .select()
        .single();

      if (error) throw error;
      
      // Refresh the products list
      await fetchProducts();
      
      return { data, error: null };
    } catch (err) {
      console.error('Error creating product:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err.message : 'Erreur lors de la création du produit' 
      };
    }
  };

  const updateProduct = async (productId: string, productData: Partial<Product>) => {
    if (!organization?.id) return { error: 'Organization not found' };

    try {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', productId)
        .eq('organization_id', organization.id)
        .select()
        .single();

      if (error) throw error;
      
      // Refresh the products list
      await fetchProducts();
      
      return { data, error: null };
    } catch (err) {
      console.error('Error updating product:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err.message : 'Erreur lors de la mise à jour du produit' 
      };
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct
  };
}
