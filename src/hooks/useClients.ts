
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

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
  status: string | null;
  created_at: string;
  updated_at: string;
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { organization } = useAuth();

  const fetchClients = async () => {
    if (!organization?.id) {
      console.log('Pas d\'organisation trouvée');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Récupération des clients pour l\'organisation:', organization.id);
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('organization_id', organization.id)
        .order('name');

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }
      
      console.log('Clients récupérés:', data);
      setClients(data || []);
      setError(null);
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
    if (!organization?.id) {
      console.error('Pas d\'organisation trouvée');
      return { error: 'Organization not found' };
    }

    try {
      console.log('Création du client avec les données:', clientData);
      console.log('Organization ID:', organization.id);
      
      const { data, error } = await supabase
        .from('clients')
        .insert({
          ...clientData,
          organization_id: organization.id
        })
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création:', error);
        throw error;
      }
      
      console.log('Client créé:', data);
      
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

  return {
    clients,
    loading,
    error,
    fetchClients,
    createClient
  };
}
