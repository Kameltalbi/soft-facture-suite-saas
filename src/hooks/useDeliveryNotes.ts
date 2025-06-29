
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface DeliveryNote {
  id: string;
  delivery_number: string;
  date: string;
  client_id: string;
  expected_delivery_date?: string;
  delivery_address?: string;
  status: 'pending' | 'sent' | 'delivered' | 'signed';
  notes?: string;
  created_at: string;
  updated_at: string;
  organization_id: string;
  // Relations
  clients?: {
    id: string;
    name: string;
    company?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    country?: string;
  };
  delivery_note_items?: DeliveryNoteItem[];
}

interface DeliveryNoteItem {
  id: string;
  delivery_note_id: string;
  description: string;
  quantity: number;
  delivered_quantity: number;
  status: 'pending' | 'delivered' | 'partial';
  product_id?: string;
  organization_id: string;
  created_at: string;
}

export function useDeliveryNotes() {
  const { organization } = useAuth();
  const [deliveryNotes, setDeliveryNotes] = useState<DeliveryNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeliveryNotes = async () => {
    if (!organization?.id) return;
    
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('delivery_notes')
        .select(`
          *,
          clients:client_id (
            id,
            name,
            company,
            email,
            phone,
            address,
            city,
            postal_code,
            country
          ),
          delivery_note_items (
            id,
            description,
            quantity,
            delivered_quantity,
            status,
            product_id,
            organization_id,
            created_at
          )
        `)
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching delivery notes:', error);
        setError(error.message);
        return;
      }

      // Type assertion to ensure status is properly typed
      const typedData = (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'sent' | 'delivered' | 'signed'
      }));

      setDeliveryNotes(typedData);
    } catch (err) {
      console.error('Error in fetchDeliveryNotes:', err);
      setError('Une erreur est survenue lors du chargement des bons de livraison');
    } finally {
      setLoading(false);
    }
  };

  const createDeliveryNote = async (deliveryData: any) => {
    if (!organization?.id) return { error: 'Organization not found' };

    try {
      // Generate delivery number
      const deliveryNumber = `BL-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

      const deliveryNote = {
        delivery_number: deliveryNumber,
        date: deliveryData.date,
        client_id: deliveryData.client?.id,
        expected_delivery_date: deliveryData.expectedDeliveryDate || null,
        delivery_address: deliveryData.deliveryAddress || null,
        status: 'pending' as const,
        notes: deliveryData.notes || null,
        organization_id: organization.id
      };

      const { data: createdDelivery, error: deliveryError } = await supabase
        .from('delivery_notes')
        .insert([deliveryNote])
        .select()
        .single();

      if (deliveryError) {
        console.error('Error creating delivery note:', deliveryError);
        return { error: deliveryError.message };
      }

      // Create delivery note items
      if (deliveryData.items && deliveryData.items.length > 0) {
        const items = deliveryData.items
          .filter((item: any) => item.description && item.description.trim())
          .map((item: any) => ({
            delivery_note_id: createdDelivery.id,
            description: item.description,
            quantity: item.quantity || 1,
            delivered_quantity: item.deliveredQuantity || 0,
            status: item.status || 'pending',
            product_id: item.product_id || null,
            organization_id: organization.id
          }));

        if (items.length > 0) {
          const { error: itemsError } = await supabase
            .from('delivery_note_items')
            .insert(items);

          if (itemsError) {
            console.error('Error creating delivery note items:', itemsError);
            return { error: itemsError.message };
          }
        }
      }

      await fetchDeliveryNotes();
      return { success: true, data: createdDelivery };
    } catch (err) {
      console.error('Error in createDeliveryNote:', err);
      return { error: 'Une erreur est survenue lors de la création du bon de livraison' };
    }
  };

  const updateDeliveryNote = async (id: string, updates: Partial<DeliveryNote>) => {
    if (!organization?.id) return { error: 'Organization not found' };

    try {
      const { error } = await supabase
        .from('delivery_notes')
        .update(updates)
        .eq('id', id)
        .eq('organization_id', organization.id);

      if (error) {
        console.error('Error updating delivery note:', error);
        return { error: error.message };
      }

      await fetchDeliveryNotes();
      return { success: true };
    } catch (err) {
      console.error('Error in updateDeliveryNote:', err);
      return { error: 'Une erreur est survenue lors de la mise à jour du bon de livraison' };
    }
  };

  const deleteDeliveryNote = async (id: string) => {
    if (!organization?.id) return { error: 'Organization not found' };

    try {
      // First delete delivery note items
      const { error: itemsError } = await supabase
        .from('delivery_note_items')
        .delete()
        .eq('delivery_note_id', id)
        .eq('organization_id', organization.id);

      if (itemsError) {
        console.error('Error deleting delivery note items:', itemsError);
        return { error: itemsError.message };
      }

      // Then delete the delivery note
      const { error } = await supabase
        .from('delivery_notes')
        .delete()
        .eq('id', id)
        .eq('organization_id', organization.id);

      if (error) {
        console.error('Error deleting delivery note:', error);
        return { error: error.message };
      }

      await fetchDeliveryNotes();
      return { success: true };
    } catch (err) {
      console.error('Error in deleteDeliveryNote:', err);
      return { error: 'Une erreur est survenue lors de la suppression du bon de livraison' };
    }
  };

  useEffect(() => {
    fetchDeliveryNotes();
  }, [organization?.id]);

  return {
    deliveryNotes,
    loading,
    error,
    createDeliveryNote,
    updateDeliveryNote,
    deleteDeliveryNote,
    refetch: fetchDeliveryNotes
  };
}
