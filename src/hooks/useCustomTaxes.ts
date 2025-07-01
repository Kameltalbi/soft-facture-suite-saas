
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { CustomTax, CreateCustomTaxData } from '@/types/customTax';

export function useCustomTaxes() {
  const [customTaxes, setCustomTaxes] = useState<CustomTax[]>([]);
  const [loading, setLoading] = useState(true);
  const { organization } = useAuth();
  const { toast } = useToast();

  // Récupérer les taxes personnalisées
  const fetchCustomTaxes = async () => {
    if (!organization?.id) return;

    try {
      const { data, error } = await supabase
        .from('custom_taxes')
        .select('*')
        .eq('organization_id', organization.id)
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setCustomTaxes(data || []);
    } catch (error) {
      console.error('Error fetching custom taxes:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les taxes personnalisées.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Créer une nouvelle taxe personnalisée
  const createCustomTax = async (taxData: CreateCustomTaxData) => {
    if (!organization?.id) return;

    try {
      const { data, error } = await supabase
        .from('custom_taxes')
        .insert({
          ...taxData,
          organization_id: organization.id,
        })
        .select()
        .single();

      if (error) throw error;

      setCustomTaxes(prev => [data, ...prev]);
      
      toast({
        title: 'Succès',
        description: 'Taxe personnalisée créée avec succès.',
      });

      return data;
    } catch (error) {
      console.error('Error creating custom tax:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la création de la taxe.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Modifier une taxe personnalisée
  const updateCustomTax = async (id: string, updates: Partial<CreateCustomTaxData>) => {
    if (!organization?.id) return;

    try {
      const { data, error } = await supabase
        .from('custom_taxes')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('organization_id', organization.id)
        .select()
        .single();

      if (error) throw error;

      setCustomTaxes(prev => 
        prev.map(tax => tax.id === id ? data : tax)
      );
      
      toast({
        title: 'Succès',
        description: 'Taxe personnalisée modifiée avec succès.',
      });

      return data;
    } catch (error) {
      console.error('Error updating custom tax:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la modification de la taxe.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Supprimer une taxe personnalisée
  const deleteCustomTax = async (id: string) => {
    if (!organization?.id) return;

    try {
      const { error } = await supabase
        .from('custom_taxes')
        .update({ active: false })
        .eq('id', id)
        .eq('organization_id', organization.id);

      if (error) throw error;

      setCustomTaxes(prev => prev.filter(tax => tax.id !== id));
      
      toast({
        title: 'Succès',
        description: 'Taxe personnalisée supprimée avec succès.',
      });
    } catch (error) {
      console.error('Error deleting custom tax:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la suppression de la taxe.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCustomTaxes();
  }, [organization?.id]);

  return {
    customTaxes,
    loading,
    createCustomTax,
    updateCustomTax,
    deleteCustomTax,
    refetch: fetchCustomTaxes,
  };
}
