import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function useProductRevenueReport(period: { start?: Date; end?: Date }) {
  const { organization } = useAuth();

  return useQuery({
    queryKey: ['productRevenueReport', organization?.id, period.start, period.end],
    queryFn: async () => {
      if (!organization?.id) return [];

      console.log('Fetching product revenue report for organization:', organization.id);
      console.log('Period:', period);

      // D'abord, récupérer tous les éléments de facture avec leurs factures
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
            use_vat
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

      // Grouper par produit/service
      const productMap = new Map();
      
      data.forEach(item => {
        const productName = item.description;
        const vatMultiplier = item.invoices.use_vat ? (1 + item.tax_rate / 100) : 1;
        const totalTTC = item.total_price * vatMultiplier;
        
        if (productMap.has(productName)) {
          const existing = productMap.get(productName);
          existing.quantity += Number(item.quantity);
          existing.totalHT += Number(item.total_price);
          existing.totalTTC += totalTTC;
        } else {
          productMap.set(productName, {
            name: productName,
            quantity: Number(item.quantity),
            totalHT: Number(item.total_price),
            totalTTC: totalTTC
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
            use_vat
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

      const productMap = new Map();
      
      data?.forEach(item => {
        const productName = item.description;
        if (productMap.has(productName)) {
          const existing = productMap.get(productName);
          existing.quantity += item.quantity;
          existing.totalTTC += item.total_price * (1 + (item.invoices.use_vat ? item.tax_rate / 100 : 0));
        } else {
          productMap.set(productName, {
            name: productName,
            quantity: item.quantity,
            totalTTC: item.total_price * (1 + (item.invoices.use_vat ? item.tax_rate / 100 : 0))
          });
        }
      });

      return Array.from(productMap.values()).sort((a, b) => b.totalTTC - a.totalTTC);
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

      const { data, error } = await supabase
        .from('invoices')
        .select('date, subtotal, total_amount, use_vat')
        .eq('organization_id', organization.id)
        .in('status', ['sent', 'paid', 'partially_paid'])
        .gte('date', `${year}-01-01`)
        .lte('date', `${year}-12-31`);

      if (error) throw error;

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
        monthlyData[monthIndex].totalHT += invoice.subtotal;
        monthlyData[monthIndex].totalTTC += invoice.total_amount;
      });

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

      let query = supabase
        .from('invoices')
        .select(`
          total_amount,
          amount_paid,
          status,
          date,
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

      const clientMap = new Map();
      
      data?.forEach(invoice => {
        // Utiliser le nom de l'entreprise s'il existe, sinon le nom du contact
        const clientName = invoice.clients.company || invoice.clients.name;
        const paidAmount = invoice.amount_paid || 0;
        const dueAmount = invoice.total_amount - paidAmount;

        if (clientMap.has(clientName)) {
          const existing = clientMap.get(clientName);
          existing.invoiceCount += 1;
          existing.totalAmount += invoice.total_amount;
          existing.paidAmount += paidAmount;
          existing.dueAmount += dueAmount;
        } else {
          clientMap.set(clientName, {
            name: clientName,
            invoiceCount: 1,
            totalAmount: invoice.total_amount,
            paidAmount: paidAmount,
            dueAmount: dueAmount
          });
        }
      });

      return Array.from(clientMap.values()).sort((a, b) => b.totalAmount - a.totalAmount);
    },
    enabled: !!organization?.id
  });
}