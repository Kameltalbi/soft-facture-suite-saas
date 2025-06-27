
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Fournisseur {
  id: string;
  name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  vat_number: string | null;
  business_sector: string | null;
  status: 'active' | 'inactive' | null;
  internal_notes: string | null;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export function useFournisseurs() {
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { organization } = useAuth();

  const fetchFournisseurs = async () => {
    if (!organization?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('organization_id', organization.id)
        .order('name');

      if (error) throw error;
      setFournisseurs(data || []);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des fournisseurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFournisseurs();
  }, [organization?.id]);

  const createFournisseur = async (fournisseurData: Omit<Fournisseur, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) => {
    if (!organization?.id) return { error: 'Organization not found' };

    try {
      const { data, error } = await supabase
        .from('suppliers')
        .insert({
          ...fournisseurData,
          organization_id: organization.id
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchFournisseurs();
      
      return { data, error: null };
    } catch (err) {
      console.error('Error creating supplier:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err.message : 'Erreur lors de la création du fournisseur' 
      };
    }
  };

  const updateFournisseur = async (fournisseurId: string, fournisseurData: Partial<Fournisseur>) => {
    if (!organization?.id) return { error: 'Organization not found' };

    try {
      const { data, error } = await supabase
        .from('suppliers')
        .update(fournisseurData)
        .eq('id', fournisseurId)
        .eq('organization_id', organization.id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchFournisseurs();
      
      return { data, error: null };
    } catch (err) {
      console.error('Error updating supplier:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err.message : 'Erreur lors de la mise à jour du fournisseur' 
      };
    }
  };

  const deleteFournisseur = async (fournisseurId: string) => {
    if (!organization?.id) return { error: 'Organization not found' };

    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', fournisseurId)
        .eq('organization_id', organization.id);

      if (error) throw error;
      
      await fetchFournisseurs();
      
      return { error: null };
    } catch (err) {
      console.error('Error deleting supplier:', err);
      return { 
        error: err instanceof Error ? err.message : 'Erreur lors de la suppression du fournisseur' 
      };
    }
  };

  return {
    fournisseurs,
    loading,
    error,
    fetchFournisseurs,
    createFournisseur,
    updateFournisseur,
    deleteFournisseur
  };
}
