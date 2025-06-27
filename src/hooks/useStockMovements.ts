
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface StockMovement {
  id: string;
  product_id: string;
  movement_type: 'in' | 'out' | 'adjustment' | 'inventory';
  quantity: number;
  unit_cost: number | null;
  reference_type: 'invoice' | 'delivery_note' | 'purchase_order' | 'adjustment' | 'inventory' | null;
  reference_id: string | null;
  reason: string | null;
  notes: string | null;
  created_at: string;
  created_by: string | null;
  organization_id: string;
  products?: {
    name: string;
    sku: string | null;
  };
}

export function useStockMovements() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { organization } = useAuth();

  const fetchMovements = async () => {
    if (!organization?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stock_movements')
        .select(`
          *,
          products (
            name,
            sku
          )
        `)
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMovements(data || []);
    } catch (err) {
      console.error('Error fetching stock movements:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des mouvements de stock');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, [organization?.id]);

  const createMovement = async (movementData: Omit<StockMovement, 'id' | 'organization_id' | 'created_at' | 'created_by' | 'products'>) => {
    if (!organization?.id) return { error: 'Organization not found' };

    try {
      const { data, error } = await supabase
        .from('stock_movements')
        .insert({
          ...movementData,
          organization_id: organization.id
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchMovements();
      
      return { data, error: null };
    } catch (err) {
      console.error('Error creating stock movement:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err.message : 'Erreur lors de la création du mouvement de stock' 
      };
    }
  };

  return {
    movements,
    loading,
    error,
    fetchMovements,
    createMovement
  };
}
