
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Currency {
  code: string;
  symbol: string;
  name: string;
  decimal_places: number;
}

interface ExchangeRate {
  from_currency_code: string;
  to_currency_code: string;
  rate: number;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  loading: boolean;
  exchangeRates: ExchangeRate[];
}

const defaultCurrency: Currency = {
  code: 'EUR',
  symbol: '€',
  name: 'Euro',
  decimal_places: 2
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>(defaultCurrency);
  const [loading, setLoading] = useState(true);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const { profile } = useAuth();

  useEffect(() => {
    const fetchOrganizationCurrency = async () => {
      if (!profile?.organization_id) {
        setLoading(false);
        return;
      }

      try {
        // Récupérer la devise principale
        const { data, error } = await supabase
          .from('currencies')
          .select('code, symbol, name, decimal_places')
          .eq('organization_id', profile.organization_id)
          .eq('is_primary', true)
          .single();

        if (error || !data) {
          console.log('Aucune devise principale trouvée, utilisation de EUR par défaut');
          setCurrency(defaultCurrency);
        } else {
          setCurrency({
            code: data.code,
            symbol: data.symbol,
            name: data.name,
            decimal_places: data.decimal_places
          });
        }

        // Récupérer les taux de change
        const { data: exchangeData } = await supabase
          .from('exchange_rates')
          .select(`
            rate,
            from_currency:currencies!exchange_rates_from_currency_id_fkey(code),
            to_currency:currencies!exchange_rates_to_currency_id_fkey(code)
          `)
          .eq('organization_id', profile.organization_id);

        if (exchangeData) {
          const rates = exchangeData.map(rate => ({
            from_currency_code: rate.from_currency.code,
            to_currency_code: rate.to_currency.code,
            rate: rate.rate
          }));
          setExchangeRates(rates);
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
    <CurrencyContext.Provider value={{ currency, setCurrency, loading, exchangeRates }}>
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
