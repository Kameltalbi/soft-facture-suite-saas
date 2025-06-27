
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface PurchaseOrderItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  total_price: number;
  received_quantity: number | null;
  product_id: string | null;
}

interface PurchaseOrder {
  id: string;
  purchase_order_number: string;
  supplier_id: string;
  date: string;
  expected_delivery_date: string | null;
  status: string | null;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  discount: number | null;
  delivery_address: string | null;
  notes: string | null;
  organization_id: string;
  created_at: string;
  updated_at: string;
  suppliers?: {
    name: string;
    contact_name: string | null;
  };
  purchase_order_items?: PurchaseOrderItem[];
}

export function usePurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { organization } = useAuth();

  const fetchPurchaseOrders = async () => {
    if (!organization?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('purchase_orders')
        .select(`
          *,
          suppliers (
            name,
            contact_name
          ),
          purchase_order_items (*)
        `)
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPurchaseOrders(data || []);
    } catch (err) {
      console.error('Error fetching purchase orders:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des bons de commande');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, [organization?.id]);

  const createPurchaseOrder = async (orderData: Omit<PurchaseOrder, 'id' | 'organization_id' | 'created_at' | 'updated_at' | 'suppliers' | 'purchase_order_items'>, items: Omit<PurchaseOrderItem, 'id'>[]) => {
    if (!organization?.id) return { error: 'Organization not found' };

    try {
      const { data: order, error: orderError } = await supabase
        .from('purchase_orders')
        .insert({
          ...orderData,
          organization_id: organization.id
        })
        .select()
        .single();

      if (orderError) throw orderError;

      if (items.length > 0) {
        const { error: itemsError } = await supabase
          .from('purchase_order_items')
          .insert(
            items.map(item => ({
              ...item,
              purchase_order_id: order.id,
              organization_id: organization.id
            }))
          );

        if (itemsError) throw itemsError;
      }
      
      await fetchPurchaseOrders();
      
      return { data: order, error: null };
    } catch (err) {
      console.error('Error creating purchase order:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err.message : 'Erreur lors de la création du bon de commande' 
      };
    }
  };

  return {
    purchaseOrders,
    loading,
    error,
    fetchPurchaseOrders,
    createPurchaseOrder
  };
}
