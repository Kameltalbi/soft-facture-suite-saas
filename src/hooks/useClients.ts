
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Client {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  vat_number: string | null;
  payment_terms: number | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { organization } = useAuth();
  const { toast } = useToast();

  const fetchClients = async () => {
    if (!organization?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('organization_id', organization.id)
        .order('name');

      if (error) throw error;
      setClients(data || []);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [organization?.id]);

  const createClient = async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    if (!organization?.id) return { error: 'Organization not found' };

    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          ...clientData,
          organization_id: organization.id
        })
        .select()
        .single();

      if (error) throw error;
      
      // Refresh the clients list
      await fetchClients();
      
      return { data, error: null };
    } catch (err) {
      console.error('Error creating client:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err.message : 'Erreur lors de la création du client' 
      };
    }
  };

  const updateClient = async (id: string, clientData: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>) => {
    if (!organization?.id) return { error: 'Organization not found' };

    try {
      const { data, error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', id)
        .eq('organization_id', organization.id)
        .select()
        .single();

      if (error) throw error;
      
      // Refresh the clients list
      await fetchClients();
      
      toast({
        title: 'Succès',
        description: 'Client modifié avec succès.',
      });

      return { data, error: null };
    } catch (err) {
      console.error('Error updating client:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la modification du client';
      
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });

      return { data: null, error: errorMessage };
    }
  };

  const deleteClient = async (id: string) => {
    if (!organization?.id) return { error: 'Organization not found' };

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)
        .eq('organization_id', organization.id);

      if (error) throw error;
      
      // Refresh the clients list
      await fetchClients();
      
      toast({
        title: 'Succès',
        description: 'Client supprimé avec succès.',
      });

      return { error: null };
    } catch (err) {
      console.error('Error deleting client:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression du client';
      
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });

      return { error: errorMessage };
    }
  };

  return {
    clients,
    loading,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient
  };
}
