import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Currency {
  id: string;
  code: string;
  symbol: string;
  name: string;
  decimal_places: number;
  is_primary: boolean;
}

export function useCurrencies() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const { organization } = useAuth();

  const fetchCurrencies = async () => {
    if (!organization?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('currencies')
        .select('*')
        .eq('organization_id', organization.id)
        .order('is_primary', { ascending: false })
        .order('code');

      if (error) throw error;
      
      setCurrencies(data || []);
    } catch (error) {
      console.error('Error fetching currencies:', error);
      setCurrencies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, [organization?.id]);

  return {
    currencies,
    loading,
    refetch: fetchCurrencies,
  };
}