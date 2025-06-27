
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { FournisseurDB, Fournisseur, dbToFournisseur, fournisseurToDb, CreateFournisseurData } from '@/types/fournisseur';

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
      
      // Convert database format to UI format
      const convertedFournisseurs = (data || []).map(dbToFournisseur);
      setFournisseurs(convertedFournisseurs);
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

  const createFournisseur = async (fournisseurData: CreateFournisseurData) => {
    if (!organization?.id) return { error: 'Organization not found' };

    try {
      // Convert UI format to database format
      const dbData = fournisseurToDb(fournisseurData);
      
      const { data, error } = await supabase
        .from('suppliers')
        .insert({
          ...dbData,
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

  const updateFournisseur = async (fournisseurId: string, fournisseurData: Partial<CreateFournisseurData>) => {
    if (!organization?.id) return { error: 'Organization not found' };

    try {
      // Convert UI format to database format
      const dbData = fournisseurToDb(fournisseurData as CreateFournisseurData);
      
      const { data, error } = await supabase
        .from('suppliers')
        .update(dbData)
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
