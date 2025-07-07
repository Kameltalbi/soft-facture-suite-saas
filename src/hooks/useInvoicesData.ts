import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function useInvoicesData() {
  const { organization } = useAuth();

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['invoices', organization?.id],
    queryFn: async () => {
      if (!organization?.id) return [];
      
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          clients (
            name,
            company,
            address,
            email,
            vat_number
          ),
          invoice_items (
            *,
            discount,
            discount_type
          ),
          currencies (
            code,
            symbol,
            decimal_places
          )
        `)
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching invoices:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!organization?.id
  });

  const { data: globalSettings } = useQuery({
    queryKey: ['globalSettings', organization?.id],
    queryFn: async () => {
      if (!organization?.id) return null;
      
      const { data, error } = await supabase
        .from('global_settings')
        .select('*')
        .eq('organization_id', organization.id)
        .maybeSingle();

      if (error) {
        console.error('Erreur lors de la récupération des paramètres globaux:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!organization?.id
  });

  return {
    invoices,
    globalSettings,
    isLoading
  };
}