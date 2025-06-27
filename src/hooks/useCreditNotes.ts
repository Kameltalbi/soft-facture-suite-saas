
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface CreditNoteItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  total_price: number;
  product_id: string | null;
}

interface CreditNote {
  id: string;
  credit_note_number: string;
  client_id: string;
  original_invoice_id: string | null;
  date: string;
  reason: string | null;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  status: 'draft' | 'sent' | 'applied' | 'cancelled' | null;
  notes: string | null;
  organization_id: string;
  created_at: string;
  updated_at: string;
  clients?: {
    name: string;
    company: string | null;
  };
  credit_note_items?: CreditNoteItem[];
}

export function useCreditNotes() {
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { organization } = useAuth();

  const fetchCreditNotes = async () => {
    if (!organization?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('credit_notes')
        .select(`
          *,
          clients (
            name,
            company
          ),
          credit_note_items (*)
        `)
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCreditNotes(data || []);
    } catch (err) {
      console.error('Error fetching credit notes:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des avoirs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditNotes();
  }, [organization?.id]);

  const createCreditNote = async (noteData: Omit<CreditNote, 'id' | 'organization_id' | 'created_at' | 'updated_at' | 'clients' | 'credit_note_items'>, items: Omit<CreditNoteItem, 'id'>[]) => {
    if (!organization?.id) return { error: 'Organization not found' };

    try {
      const { data: note, error: noteError } = await supabase
        .from('credit_notes')
        .insert({
          ...noteData,
          organization_id: organization.id
        })
        .select()
        .single();

      if (noteError) throw noteError;

      if (items.length > 0) {
        const { error: itemsError } = await supabase
          .from('credit_note_items')
          .insert(
            items.map(item => ({
              ...item,
              credit_note_id: note.id,
              organization_id: organization.id
            }))
          );

        if (itemsError) throw itemsError;
      }
      
      await fetchCreditNotes();
      
      return { data: note, error: null };
    } catch (err) {
      console.error('Error creating credit note:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err.message : 'Erreur lors de la création de l\'avoir' 
      };
    }
  };

  return {
    creditNotes,
    loading,
    error,
    fetchCreditNotes,
    createCreditNote
  };
}
