import { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ExchangeRate {
  id: string;
  organization_id: string;
  from_currency_id: string;
  to_currency_id: string;
  rate: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  from_currency?: {
    code: string;
    symbol: string;
    name: string;
  };
  to_currency?: {
    code: string;
    symbol: string;
    name: string;
  };
}

export const useExchangeRates = () => {
  const { organization } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: exchangeRates = [], isLoading } = useQuery({
    queryKey: ['exchangeRates', organization?.id],
    queryFn: async () => {
      if (!organization?.id) return [];
      
      const { data, error } = await supabase
        .from('exchange_rates')
        .select(`
          *,
          from_currency:currencies!exchange_rates_from_currency_id_fkey(code, symbol, name),
          to_currency:currencies!exchange_rates_to_currency_id_fkey(code, symbol, name)
        `)
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching exchange rates:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!organization?.id
  });

  const createExchangeRate = useMutation({
    mutationFn: async (data: {
      from_currency_id: string;
      to_currency_id: string;
      rate: number;
    }) => {
      if (!organization?.id) throw new Error('No organization found');

      const { data: result, error } = await supabase
        .from('exchange_rates')
        .insert({
          organization_id: organization.id,
          from_currency_id: data.from_currency_id,
          to_currency_id: data.to_currency_id,
          rate: data.rate
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exchangeRates'] });
      toast({
        title: "Succès",
        description: "Taux de change créé avec succès",
      });
    },
    onError: (error) => {
      console.error('Error creating exchange rate:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création du taux de change",
        variant: "destructive",
      });
    }
  });

  const updateExchangeRate = useMutation({
    mutationFn: async (data: {
      id: string;
      rate: number;
    }) => {
      const { data: result, error } = await supabase
        .from('exchange_rates')
        .update({ rate: data.rate })
        .eq('id', data.id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exchangeRates'] });
      toast({
        title: "Succès",
        description: "Taux de change mis à jour avec succès",
      });
    },
    onError: (error) => {
      console.error('Error updating exchange rate:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du taux de change",
        variant: "destructive",
      });
    }
  });

  const deleteExchangeRate = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('exchange_rates')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exchangeRates'] });
      toast({
        title: "Succès",
        description: "Taux de change supprimé avec succès",
      });
    },
    onError: (error) => {
      console.error('Error deleting exchange rate:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du taux de change",
        variant: "destructive",
      });
    }
  });

  // Fonction pour convertir un montant d'une devise vers la devise par défaut
  const convertToDefaultCurrency = (
    amount: number,
    fromCurrencyId: string,
    defaultCurrencyId: string
  ): number => {
    if (fromCurrencyId === defaultCurrencyId) {
      return amount;
    }

    const rate = exchangeRates.find(
      er => er.from_currency_id === fromCurrencyId && er.to_currency_id === defaultCurrencyId
    );

    if (rate) {
      return amount * rate.rate;
    }

    // Si pas de taux trouvé, retourner le montant original
    console.warn(`No exchange rate found from ${fromCurrencyId} to ${defaultCurrencyId}`);
    return amount;
  };

  return {
    exchangeRates,
    isLoading,
    createExchangeRate,
    updateExchangeRate,
    deleteExchangeRate,
    convertToDefaultCurrency
  };
};