
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  loading: boolean;
}

const defaultCurrency: Currency = {
  code: 'EUR',
  symbol: '€',
  name: 'Euro'
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>(defaultCurrency);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    const fetchOrganizationCurrency = async () => {
      if (!profile?.organization_id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('currencies')
          .select('code, symbol, name')
          .eq('organization_id', profile.organization_id)
          .eq('is_primary', true)
          .single();

        if (error || !data) {
          // Si pas de devise principale trouvée, garder EUR par défaut
          console.log('Aucune devise principale trouvée, utilisation de EUR par défaut');
          setCurrency(defaultCurrency);
        } else {
          setCurrency({
            code: data.code,
            symbol: data.symbol,
            name: data.name
          });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la devise:', error);
        setCurrency(defaultCurrency);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizationCurrency();
  }, [profile?.organization_id]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, loading }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
