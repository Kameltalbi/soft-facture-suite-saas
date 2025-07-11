import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/contexts/CurrencyContext';
import { convertToDefaultCurrency } from '@/utils/currencyConverter';

export function useProductRevenueReport(period: { start?: Date; end?: Date }) {
  const { organization } = useAuth();
  const { currency, exchangeRates } = useCurrency();

  return useQuery({
    queryKey: ['productRevenueReport', organization?.id, period.start, period.end],
    queryFn: async () => {
      if (!organization?.id) return [];

      console.log('Fetching product revenue report for organization:', organization.id);
      console.log('Period:', period);

      // Récupérer la devise par défaut
      const { data: defaultCurrency } = await supabase
        .from('currencies')
        .select('*')
        .eq('organization_id', organization.id)
        .eq('is_primary', true)
        .single();

      // D'abord, récupérer tous les éléments de facture avec leurs factures et devises
      let query = supabase
        .from('invoice_items')
        .select(`
          description,
          quantity,
          total_price,
          tax_rate,
          invoices!inner (
            date,
            status,
            organization_id,
            use_vat,
            currency_id
          )
        `)
        .eq('invoices.organization_id', organization.id);

      // Filtrer par période si spécifiée
      if (period.start) {
        query = query.gte('invoices.date', period.start.toISOString().split('T')[0]);
      }
      if (period.end) {
        query = query.lte('invoices.date', period.end.toISOString().split('T')[0]);
      }

      const { data, error } = await query;
      
      console.log('Query result:', { data, error });
      
      if (error) {
        console.error('Error fetching invoice items:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.log('No invoice items found');
        return [];
      }

      // Récupérer les taux de change
      const { data: rates } = await supabase
        .from('exchange_rates')
        .select('*')
        .eq('organization_id', organization.id);

      // Grouper par produit/service avec conversion de devise
      const productMap = new Map();
      
      data.forEach(item => {
        const productName = item.description;
        const vatMultiplier = item.invoices.use_vat ? (1 + item.tax_rate / 100) : 1;
        
        // Convertir les montants vers la devise par défaut
        const convertedTotalHT = convertToDefaultCurrency(
          Number(item.total_price),
          item.invoices.currency_id || defaultCurrency?.id,
          defaultCurrency?.id,
          rates || []
        );
        const convertedTotalTTC = convertedTotalHT * vatMultiplier;
        
        if (productMap.has(productName)) {
          const existing = productMap.get(productName);
          existing.quantity += Number(item.quantity);
          existing.totalHT += convertedTotalHT;
          existing.totalTTC += convertedTotalTTC;
        } else {
          productMap.set(productName, {
            name: productName,
            quantity: Number(item.quantity),
            totalHT: convertedTotalHT,
            totalTTC: convertedTotalTTC
          });
        }
      });

      const result = Array.from(productMap.values()).sort((a, b) => b.totalTTC - a.totalTTC);
      console.log('Final result:', result);
      
      return result;
    },
    enabled: !!organization?.id
  });
}

export function useProductRankingReport(period: { start?: Date; end?: Date }) {
  const { organization } = useAuth();

  return useQuery({
    queryKey: ['productRankingReport', organization?.id, period.start, period.end],
    queryFn: async () => {
      if (!organization?.id) return [];

      // Récupérer la devise par défaut
      const { data: defaultCurrency } = await supabase
        .from('currencies')
        .select('*')
        .eq('organization_id', organization.id)
        .eq('is_primary', true)
        .single();

      let query = supabase
        .from('invoice_items')
        .select(`
          description,
          quantity,
          total_price,
          tax_rate,
          invoices!inner (
            date,
            status,
            organization_id,
            use_vat,
            currency_id
          )
        `)
        .eq('invoices.organization_id', organization.id)
        .in('invoices.status', ['sent', 'paid', 'partially_paid']);

      if (period.start) {
        query = query.gte('invoices.date', period.start.toISOString().split('T')[0]);
      }
      if (period.end) {
        query = query.lte('invoices.date', period.end.toISOString().split('T')[0]);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Récupérer les taux de change
      const { data: rates } = await supabase
        .from('exchange_rates')
        .select('*')
        .eq('organization_id', organization.id);

      const productMap = new Map();
      
      data?.forEach(item => {
        const productName = item.description;
        const vatMultiplier = item.invoices.use_vat ? (1 + item.tax_rate / 100) : 1;
        
        // Convertir le montant vers la devise par défaut
        const convertedAmount = convertToDefaultCurrency(
          Number(item.total_price),
          item.invoices.currency_id || defaultCurrency?.id,
          defaultCurrency?.id,
          rates || []
        );
        const convertedTotalHT = convertedAmount;
        const convertedTotalTTC = convertedAmount * vatMultiplier;
        
        if (productMap.has(productName)) {
          const existing = productMap.get(productName);
          existing.quantity += item.quantity;
          existing.totalHT += convertedTotalHT;
          existing.totalTTC += convertedTotalTTC;
        } else {
          productMap.set(productName, {
            name: productName,
            quantity: item.quantity,
            totalHT: convertedTotalHT,
            totalTTC: convertedTotalTTC
          });
        }
      });

      return Array.from(productMap.values()).sort((a, b) => b.totalHT - a.totalHT);
    },
    enabled: !!organization?.id
  });
}

export function useMonthlyRevenueReport(year: number) {
  const { organization } = useAuth();

  return useQuery({
    queryKey: ['monthlyRevenueReport', organization?.id, year],
    queryFn: async () => {
      if (!organization?.id) return [];

      console.log('Fetching monthly revenue for year:', year, 'organization:', organization.id);

      // Récupérer la devise par défaut
      const { data: defaultCurrency } = await supabase
        .from('currencies')
        .select('*')
        .eq('organization_id', organization.id)
        .eq('is_primary', true)
        .single();

      const { data, error } = await supabase
        .from('invoices')
        .select('date, subtotal, total_amount, use_vat, currency_id')
        .eq('organization_id', organization.id)
        .gte('date', `${year}-01-01`)
        .lte('date', `${year}-12-31`);

      console.log('Monthly revenue query result:', { data, error });

      if (error) {
        console.error('Error fetching monthly revenue:', error);
        throw error;
      }

      // Récupérer les taux de change
      const { data: rates } = await supabase
        .from('exchange_rates')
        .select('*')
        .eq('organization_id', organization.id);

      // Créer un tableau pour les 12 mois
      const months = [
        'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
        'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
      ];

      const monthlyData = months.map((month, index) => ({
        month,
        totalHT: 0,
        totalTTC: 0
      }));

      data?.forEach(invoice => {
        const invoiceDate = new Date(invoice.date);
        const monthIndex = invoiceDate.getMonth();
        
        // Convertir les montants vers la devise par défaut
        const convertedSubtotal = convertToDefaultCurrency(
          Number(invoice.subtotal) || 0,
          invoice.currency_id || defaultCurrency?.id,
          defaultCurrency?.id,
          rates || []
        );
        const convertedTotal = convertToDefaultCurrency(
          Number(invoice.total_amount) || 0,
          invoice.currency_id || defaultCurrency?.id,
          defaultCurrency?.id,
          rates || []
        );
        
        monthlyData[monthIndex].totalHT += convertedSubtotal;
        monthlyData[monthIndex].totalTTC += convertedTotal;
      });

      console.log('Final monthly data:', monthlyData);
      return monthlyData;
    },
    enabled: !!organization?.id
  });
}

export function useClientRevenueReport(period: { start?: Date; end?: Date }) {
  const { organization } = useAuth();

  return useQuery({
    queryKey: ['clientRevenueReport', organization?.id, period.start, period.end],
    queryFn: async () => {
      if (!organization?.id) return [];

      // Récupérer la devise par défaut
      const { data: defaultCurrency } = await supabase
        .from('currencies')
        .select('*')
        .eq('organization_id', organization.id)
        .eq('is_primary', true)
        .single();

      let query = supabase
        .from('invoices')
        .select(`
          total_amount,
          amount_paid,
          status,
          date,
          currency_id,
          clients!inner (
            name,
            company
          )
        `)
        .eq('organization_id', organization.id);

      if (period.start) {
        query = query.gte('date', period.start.toISOString().split('T')[0]);
      }
      if (period.end) {
        query = query.lte('date', period.end.toISOString().split('T')[0]);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Récupérer les taux de change
      const { data: rates } = await supabase
        .from('exchange_rates')
        .select('*')
        .eq('organization_id', organization.id);

      const clientMap = new Map();
      
      data?.forEach(invoice => {
        // Utiliser le nom de l'entreprise s'il existe, sinon le nom du contact
        const clientName = invoice.clients.company || invoice.clients.name;
        
        // Convertir les montants vers la devise par défaut
        const convertedTotalAmount = convertToDefaultCurrency(
          Number(invoice.total_amount) || 0,
          invoice.currency_id || defaultCurrency?.id,
          defaultCurrency?.id,
          rates || []
        );
        const convertedPaidAmount = convertToDefaultCurrency(
          Number(invoice.amount_paid) || 0,
          invoice.currency_id || defaultCurrency?.id,
          defaultCurrency?.id,
          rates || []
        );
        const convertedDueAmount = convertedTotalAmount - convertedPaidAmount;

        if (clientMap.has(clientName)) {
          const existing = clientMap.get(clientName);
          existing.invoiceCount += 1;
          existing.totalAmount += convertedTotalAmount;
          existing.paidAmount += convertedPaidAmount;
          existing.dueAmount += convertedDueAmount;
        } else {
          clientMap.set(clientName, {
            name: clientName,
            invoiceCount: 1,
            totalAmount: convertedTotalAmount,
            paidAmount: convertedPaidAmount,
            dueAmount: convertedDueAmount
          });
        }
      });

      return Array.from(clientMap.values()).sort((a, b) => b.totalAmount - a.totalAmount);
    },
    enabled: !!organization?.id
  });
}