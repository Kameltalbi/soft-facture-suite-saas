
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useExchangeRates } from '@/hooks/useExchangeRates';
import { convertToDefaultCurrency, convertMultipleToDefaultCurrency } from '@/utils/currencyConverter';

interface DashboardKpiData {
  totalRevenue: number;
  totalEncaisse: number;
  totalVat: number;
  totalInvoices: number;
  totalQuotes: number;
  activeClients: number;
  currency: { code: string; symbol: string; name: string; decimal_places: number };
}

interface DashboardChartData {
  caByCategory: Array<{
    category: string;
    amount: number;
  }>;
  caByProduct: Array<{
    name: string;
    revenue: number;
  }>;
  monthlyComparison: Array<{
    month: string;
    currentYear: number;
    previousYear: number;
  }>;
  invoicesPerMonth: Array<{
    month: string;
    count: number;
  }>;
  top20Clients: Array<{
    name: string;
    revenue: number;
  }>;
  clientDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  invoiceStatusDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export const useDashboardData = (selectedYear: number) => {
  const { profile } = useAuth();
  const { exchangeRates } = useExchangeRates();
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState<DashboardKpiData>({
    totalRevenue: 0,
    totalEncaisse: 0,
    totalVat: 0,
    totalInvoices: 0,
    totalQuotes: 0,
    activeClients: 0,
    currency: { code: 'EUR', symbol: '€', name: 'Euro', decimal_places: 2 }
  });
  const [chartData, setChartData] = useState<DashboardChartData>({
    caByCategory: [],
    caByProduct: [],
    monthlyComparison: [],
    invoicesPerMonth: [],
    top20Clients: [],
    clientDistribution: [],
    invoiceStatusDistribution: []
  });

  useEffect(() => {
    if (profile?.organization_id && exchangeRates.length >= 0) { // Allow empty array
      console.log('🔍 Dashboard - Fetching yearly data for organization:', profile.organization_id, 'Year:', selectedYear);
      fetchDashboardData();
    }
  }, [profile?.organization_id, selectedYear, exchangeRates]);

  const fetchOrganizationCurrency = async () => {
    if (!profile?.organization_id) return { id: '', code: 'EUR', symbol: '€', name: 'Euro', decimal_places: 2 };

    try {
      const { data, error } = await supabase
        .from('currencies')
        .select('id, code, symbol, name, decimal_places')
        .eq('organization_id', profile.organization_id)
        .eq('is_primary', true)
        .single();

      if (error || !data) {
        return { id: '', code: 'EUR', symbol: '€', name: 'Euro', decimal_places: 2 };
      }

      return {
        id: data.id,
        code: data.code,
        symbol: data.symbol,
        name: data.name,
        decimal_places: data.decimal_places
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de la devise:', error);
      return { id: '', code: 'EUR', symbol: '€', name: 'Euro', decimal_places: 2 };
    }
  };

  const fetchDashboardData = async () => {
    if (!profile?.organization_id) {
      console.log('❌ Dashboard - No organization_id found in profile');
      return;
    }

    console.log('📊 Dashboard - Starting yearly data fetch for org:', profile.organization_id, 'Year:', selectedYear);
    setLoading(true);
    
    try {
      const currency = await fetchOrganizationCurrency();
      console.log('💰 Dashboard - Currency:', currency);

      const kpis = await fetchKpiData();
      console.log('📈 Dashboard - KPIs for year:', selectedYear, kpis);
      
      setKpiData({
        ...kpis,
        currency
      });

      const charts = await fetchChartData();
      console.log('📊 Dashboard - Charts for year:', selectedYear, charts);
      setChartData(charts);
    } catch (error) {
      console.error('❌ Dashboard - Erreur lors de la récupération des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKpiData = async (): Promise<Omit<DashboardKpiData, 'currency'>> => {
    const orgId = profile?.organization_id;
    if (!orgId) {
      console.log('❌ KPI - No organization ID');
      return {
        totalRevenue: 0,
        totalEncaisse: 0,
        totalVat: 0,
        totalInvoices: 0,
        totalQuotes: 0,
        activeClients: 0
      };
    }

    // Récupérer la devise par défaut
    const currency = await fetchOrganizationCurrency();

    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);

    console.log('📅 KPI - Date range for FULL YEAR:', { 
      year: selectedYear,
      startDate: startDate.toISOString().split('T')[0], 
      endDate: endDate.toISOString().split('T')[0] 
    });

    // Factures de l'année complète
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select(`
        *, 
        clients(*),
        currencies(id, code, symbol, name, decimal_places)
      `)
      .eq('organization_id', orgId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);

    if (invoicesError) {
      console.error('❌ KPI - Error fetching invoices:', invoicesError);
    } else {
      console.log('📄 KPI - Invoices found for FULL YEAR:', invoices?.length || 0);
    }

    // Devis de l'année
    const { data: quotes, error: quotesError } = await supabase
      .from('quotes')
      .select('*')
      .eq('organization_id', orgId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);

    if (quotesError) {
      console.error('❌ KPI - Error fetching quotes:', quotesError);
    }

    // Calculs des KPI avec conversion de devises
    const totalInvoices = invoices?.length || 0;
    
    // Convertir tous les montants vers la devise par défaut
    const totalRevenue = invoices?.reduce((sum, inv) => {
      const convertedAmount = convertToDefaultCurrency(
        inv.total_amount || 0,
        inv.currency_id || currency.id,
        currency.id,
        exchangeRates
      );
      return sum + convertedAmount;
    }, 0) || 0;
    
    const totalEncaisse = invoices?.filter(inv => inv.status === 'paid').reduce((sum, inv) => {
      const convertedAmount = convertToDefaultCurrency(
        inv.total_amount || 0,
        inv.currency_id || currency.id,
        currency.id,
        exchangeRates
      );
      return sum + convertedAmount;
    }, 0) || 0;
    
    const totalVat = invoices?.reduce((sum, inv) => {
      const convertedAmount = convertToDefaultCurrency(
        inv.tax_amount || 0,
        inv.currency_id || currency.id,
        currency.id,
        exchangeRates
      );
      return sum + convertedAmount;
    }, 0) || 0;
    const totalQuotes = quotes?.length || 0;
    
    // Clients actifs (ayant généré du CA)
    const activeClientsSet = new Set();
    invoices?.forEach(invoice => {
      if (invoice.total_amount && invoice.total_amount > 0) {
        activeClientsSet.add(invoice.client_id);
      }
    });
    const activeClients = activeClientsSet.size;

    console.log('📊 KPI - Calculated values for FULL YEAR:', {
      year: selectedYear,
      totalInvoices,
      totalRevenue,
      totalEncaisse,
      totalVat,
      totalQuotes,
      activeClients
    });

    return {
      totalRevenue,
      totalEncaisse,
      totalVat,
      totalInvoices,
      totalQuotes,
      activeClients
    };
  };

  const fetchChartData = async (): Promise<DashboardChartData> => {
    const orgId = profile?.organization_id;
    if (!orgId) {
      console.log('❌ Charts - No organization ID');
      return {
        caByCategory: [],
        caByProduct: [],
        monthlyComparison: [],
        invoicesPerMonth: [],
        top20Clients: [],
        clientDistribution: [],
        invoiceStatusDistribution: []
      };
    }

    // Récupérer la devise par défaut
    const currency = await fetchOrganizationCurrency();

    console.log('📊 Charts - Fetching data for org:', orgId, 'Year:', selectedYear);

    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);

    // Récupérer toutes les factures avec les items et produits
    const { data: invoicesWithItems, error: invoicesError } = await supabase
      .from('invoices')
      .select(`
        *,
        clients(*),
        invoice_items(*, products(*)),
        currencies(id, code, symbol, name, decimal_places)
      `)
      .eq('organization_id', orgId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);

    if (invoicesError) {
      console.error('❌ Charts - Error fetching invoices:', invoicesError);
      return {
        caByCategory: [],
        caByProduct: [],
        monthlyComparison: [],
        invoicesPerMonth: [],
        top20Clients: [],
        clientDistribution: [],
        invoiceStatusDistribution: []
      };
    }

    // 1. CA par catégorie avec conversion
    const categoryMap = new Map<string, number>();
    invoicesWithItems?.forEach(invoice => {
      invoice.invoice_items?.forEach(item => {
        let category = 'Non catégorisé';
        
        // Si le produit est lié directement
        if (item.products?.category && item.products.category.trim() !== '') {
          category = item.products.category;
        } else {
          // Sinon, essayer de deviner la catégorie à partir de la description
          const description = item.description.toLowerCase();
          if (description.includes('vidéo') || description.includes('creation') || description.includes('capsule')) {
            category = 'Publicité Digitale';
          } else if (description.includes('page') || description.includes('magazine') || description.includes('publicitaire')) {
            category = 'Publicité Magazine';
          }
        }
        
        // Convertir le montant vers la devise par défaut
        const convertedAmount = convertToDefaultCurrency(
          item.total_price || 0,
          invoice.currency_id || currency.id,
          currency.id,
          exchangeRates
        );
        
        const current = categoryMap.get(category) || 0;
        categoryMap.set(category, current + convertedAmount);
      });
    });
    const caByCategory = Array.from(categoryMap.entries()).map(([category, amount]) => ({ category, amount }));

    // 2. CA par produit avec conversion
    const productMap = new Map<string, number>();
    invoicesWithItems?.forEach(invoice => {
      invoice.invoice_items?.forEach(item => {
        const productName = item.products?.name || item.description;
        
        // Convertir le montant vers la devise par défaut
        const convertedAmount = convertToDefaultCurrency(
          item.total_price || 0,
          invoice.currency_id || currency.id,
          currency.id,
          exchangeRates
        );
        
        const current = productMap.get(productName) || 0;
        productMap.set(productName, current + convertedAmount);
      });
    });
    const caByProduct = Array.from(productMap.entries())
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue);

    // 3. Comparaison mensuelle avec année précédente
    const monthlyComparison = [];
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

    for (let month = 0; month < 12; month++) {
      const currentYearStart = new Date(selectedYear, month, 1);
      const currentYearEnd = new Date(selectedYear, month + 1, 0);
      const prevYearStart = new Date(selectedYear - 1, month, 1);
      const prevYearEnd = new Date(selectedYear - 1, month + 1, 0);

      const { data: currentYearInvoices } = await supabase
        .from('invoices')
        .select('total_amount, currency_id, currencies(code)')
        .eq('organization_id', orgId)
        .gte('date', currentYearStart.toISOString().split('T')[0])
        .lte('date', currentYearEnd.toISOString().split('T')[0]);

      const { data: prevYearInvoices } = await supabase
        .from('invoices')
        .select('total_amount, currency_id, currencies(code)')
        .eq('organization_id', orgId)
        .gte('date', prevYearStart.toISOString().split('T')[0])
        .lte('date', prevYearEnd.toISOString().split('T')[0]);

      const currentYear = currentYearInvoices?.reduce((sum, inv) => {
        const convertedAmount = convertToDefaultCurrency(
          inv.total_amount || 0,
          inv.currency_id || currency.id,
          currency.id,
          exchangeRates
        );
        return sum + convertedAmount;
      }, 0) || 0;
      
      const previousYear = prevYearInvoices?.reduce((sum, inv) => {
        const convertedAmount = convertToDefaultCurrency(
          inv.total_amount || 0,
          inv.currency_id || currency.id,
          currency.id,
          exchangeRates
        );
        return sum + convertedAmount;
      }, 0) || 0;

      monthlyComparison.push({
        month: months[month],
        currentYear,
        previousYear
      });
    }

    // 4. Nombre de factures par mois
    const invoicesPerMonthMap = new Map<string, number>();
    invoicesWithItems?.forEach(invoice => {
      const month = new Date(invoice.date).getMonth();
      const monthName = months[month];
      const current = invoicesPerMonthMap.get(monthName) || 0;
      invoicesPerMonthMap.set(monthName, current + 1);
    });
    const invoicesPerMonth = months.map(month => ({
      month,
      count: invoicesPerMonthMap.get(month) || 0
    }));

    // 5. Top 20 clients par CA avec conversion
    const clientRevenueMap = new Map<string, number>();
    invoicesWithItems?.forEach(invoice => {
      const clientName = invoice.clients?.company || invoice.clients?.name || 'Client inconnu';
      
      // Convertir le montant vers la devise par défaut
      const convertedAmount = convertToDefaultCurrency(
        invoice.total_amount || 0,
        invoice.currency_id || currency.id,
        currency.id,
        exchangeRates
      );
      
      const current = clientRevenueMap.get(clientName) || 0;
      clientRevenueMap.set(clientName, current + convertedAmount);
    });
    const top20Clients = Array.from(clientRevenueMap.entries())
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 20);

    // 6. Répartition CA par client (Top 10 pour le camembert)
    const clientDistribution = top20Clients.slice(0, 10).map((client, index) => ({
      name: client.name,
      value: client.revenue,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    }));

    // 7. Répartition factures payées vs non payées
    const paidInvoices = invoicesWithItems?.filter(inv => inv.status === 'paid').length || 0;
    const unpaidInvoices = invoicesWithItems?.filter(inv => inv.status !== 'paid').length || 0;
    const invoiceStatusDistribution = [
      {
        name: 'Payées',
        value: paidInvoices,
        color: '#22c55e'
      },
      {
        name: 'Non payées',
        value: unpaidInvoices,
        color: '#ef4444'
      }
    ].filter(item => item.value > 0);

    console.log('📊 Charts - Final data for full year:', {
      caByCategory: caByCategory.length,
      caByProduct: caByProduct.length,
      monthlyComparison: monthlyComparison.length,
      invoicesPerMonth: invoicesPerMonth.length,
      top20Clients: top20Clients.length,
      clientDistribution: clientDistribution.length,
      invoiceStatusDistribution: invoiceStatusDistribution.length
    });

    return {
      caByCategory,
      caByProduct,
      monthlyComparison,
      invoicesPerMonth,
      top20Clients,
      clientDistribution,
      invoiceStatusDistribution
    };
  };

  return {
    kpiData,
    chartData,
    loading,
    refetch: fetchDashboardData
  };
};
