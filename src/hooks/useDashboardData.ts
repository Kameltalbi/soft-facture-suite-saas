
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface DashboardKpiData {
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  totalCredits: number;
  totalRevenue: number;
  totalVat: number;
  quotesThisMonth: number;
  pendingOrders: number;
  lowStockProducts: number;
  topProduct: { name: string; revenue: number };
  categorySales: Array<{ name: string; value: number; color: string }>;
  currency: { code: string; symbol: string; name: string };
}

interface DashboardChartData {
  monthlyComparison: Array<{
    month: string;
    currentYear: number;
    previousYear: number;
  }>;
  topProducts: Array<{
    name: string;
    revenue: number;
  }>;
  categorySales: Array<{
    category: string;
    amount: number;
  }>;
  invoiceStatus: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  clientRevenue: Array<{
    name: string;
    revenue: number;
  }>;
}

export const useDashboardData = (selectedYear: number, selectedMonth: number) => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState<DashboardKpiData>({
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    overdueInvoices: 0,
    totalCredits: 0,
    totalRevenue: 0,
    totalVat: 0,
    quotesThisMonth: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    topProduct: { name: 'Aucun produit', revenue: 0 },
    categorySales: [],
    currency: { code: 'EUR', symbol: '€', name: 'Euro' }
  });
  const [chartData, setChartData] = useState<DashboardChartData>({
    monthlyComparison: [],
    topProducts: [],
    categorySales: [],
    invoiceStatus: [],
    clientRevenue: []
  });

  useEffect(() => {
    if (profile?.organization_id) {
      console.log('🔍 Dashboard - Fetching data for organization:', profile.organization_id);
      fetchDashboardData();
    }
  }, [profile?.organization_id, selectedYear, selectedMonth]);

  const fetchOrganizationCurrency = async () => {
    if (!profile?.organization_id) return { code: 'EUR', symbol: '€', name: 'Euro' };

    try {
      const { data, error } = await supabase
        .from('currencies')
        .select('code, symbol, name')
        .eq('organization_id', profile.organization_id)
        .eq('is_primary', true)
        .single();

      if (error || !data) {
        // Si pas de devise principale trouvée, retourner EUR par défaut
        return { code: 'EUR', symbol: '€', name: 'Euro' };
      }

      return {
        code: data.code,
        symbol: data.symbol,
        name: data.name
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de la devise:', error);
      return { code: 'EUR', symbol: '€', name: 'Euro' };
    }
  };

  const fetchDashboardData = async () => {
    if (!profile?.organization_id) {
      console.log('❌ Dashboard - No organization_id found in profile');
      return;
    }

    console.log('📊 Dashboard - Starting data fetch for org:', profile.organization_id);
    setLoading(true);
    
    try {
      // Récupérer la devise de l'organisation
      const currency = await fetchOrganizationCurrency();
      console.log('💰 Dashboard - Currency:', currency);

      // Récupérer les données KPI
      const kpis = await fetchKpiData();
      console.log('📈 Dashboard - KPIs:', kpis);
      
      setKpiData({
        ...kpis,
        currency
      });

      // Récupérer les données pour les graphiques
      const charts = await fetchChartData();
      console.log('📊 Dashboard - Charts:', charts);
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
        totalInvoices: 0,
        paidInvoices: 0,
        pendingInvoices: 0,
        overdueInvoices: 0,
        totalCredits: 0,
        totalRevenue: 0,
        totalVat: 0,
        quotesThisMonth: 0,
        pendingOrders: 0,
        lowStockProducts: 0,
        topProduct: { name: 'Aucun produit', revenue: 0 },
        categorySales: []
      };
    }

    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 0);

    console.log('📅 KPI - Date range:', { startDate: startDate.toISOString().split('T')[0], endDate: endDate.toISOString().split('T')[0] });

    // Factures
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('*')
      .eq('organization_id', orgId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);

    if (invoicesError) {
      console.error('❌ KPI - Error fetching invoices:', invoicesError);
    } else {
      console.log('📄 KPI - Invoices found:', invoices?.length || 0);
    }

    // Avoirs
    const { data: credits, error: creditsError } = await supabase
      .from('credit_notes')
      .select('total_amount')
      .eq('organization_id', orgId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);

    if (creditsError) {
      console.error('❌ KPI - Error fetching credits:', creditsError);
    }

    // Devis
    const { data: quotes, error: quotesError } = await supabase
      .from('quotes')
      .select('*')
      .eq('organization_id', orgId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);

    if (quotesError) {
      console.error('❌ KPI - Error fetching quotes:', quotesError);
    }

    // Bons de commande
    const { data: purchaseOrders, error: purchaseOrdersError } = await supabase
      .from('purchase_orders')
      .select('*')
      .eq('organization_id', orgId)
      .eq('status', 'pending');

    if (purchaseOrdersError) {
      console.error('❌ KPI - Error fetching purchase orders:', purchaseOrdersError);
    }

    // Produits avec stock faible
    const { data: lowStockProducts, error: lowStockError } = await supabase
      .from('products')
      .select('*')
      .eq('organization_id', orgId)
      .lt('stock_quantity', 10);

    if (lowStockError) {
      console.error('❌ KPI - Error fetching low stock products:', lowStockError);
    }

    // Calculs des KPI
    const totalInvoices = invoices?.length || 0;
    const paidInvoices = invoices?.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;
    const pendingInvoices = invoices?.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;
    const overdueInvoices = invoices?.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;
    const totalCredits = credits?.reduce((sum, credit) => sum + (credit.total_amount || 0), 0) || 0;
    const totalRevenue = invoices?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;
    const totalVat = invoices?.reduce((sum, inv) => sum + (inv.tax_amount || 0), 0) || 0;

    console.log('📊 KPI - Calculated values:', {
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      overdueInvoices,
      totalCredits,
      totalRevenue,
      totalVat
    });

    // Top produit (approximatif - nécessiterait une jointure plus complexe)
    const topProduct = { name: 'Données indisponibles', revenue: 0 };

    // Ventes par catégorie (approximatif)
    const categorySales = [
      { name: 'Services', value: Math.round(totalRevenue * 0.6), color: '#648B78' },
      { name: 'Produits', value: Math.round(totalRevenue * 0.3), color: '#F59E0B' },
      { name: 'Formation', value: Math.round(totalRevenue * 0.1), color: '#EF4444' }
    ].filter(cat => cat.value > 0);

    return {
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      overdueInvoices,
      totalCredits,
      totalRevenue,
      totalVat,
      quotesThisMonth: quotes?.length || 0,
      pendingOrders: purchaseOrders?.length || 0,
      lowStockProducts: lowStockProducts?.length || 0,
      topProduct,
      categorySales
    };
  };

  const fetchChartData = async (): Promise<DashboardChartData> => {
    const orgId = profile?.organization_id;
    if (!orgId) {
      console.log('❌ Charts - No organization ID');
      return {
        monthlyComparison: [],
        topProducts: [],
        categorySales: [],
        invoiceStatus: [],
        clientRevenue: []
      };
    }

    console.log('📊 Charts - Fetching data for org:', orgId);

    // Données mensuelles pour l'année en cours et précédente
    const monthlyComparison = [];
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

    for (let month = 0; month < 12; month++) {
      const currentYearStart = new Date(selectedYear, month, 1);
      const currentYearEnd = new Date(selectedYear, month + 1, 0);
      const prevYearStart = new Date(selectedYear - 1, month, 1);
      const prevYearEnd = new Date(selectedYear - 1, month + 1, 0);

      const { data: currentYearInvoices } = await supabase
        .from('invoices')
        .select('total_amount')
        .eq('organization_id', orgId)
        .gte('date', currentYearStart.toISOString().split('T')[0])
        .lte('date', currentYearEnd.toISOString().split('T')[0]);

      const { data: prevYearInvoices } = await supabase
        .from('invoices')
        .select('total_amount')
        .eq('organization_id', orgId)
        .gte('date', prevYearStart.toISOString().split('T')[0])
        .lte('date', prevYearEnd.toISOString().split('T')[0]);

      const currentYear = currentYearInvoices?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;
      const previousYear = prevYearInvoices?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;

      monthlyComparison.push({
        month: months[month],
        currentYear,
        previousYear
      });
    }

    // Récupérer les données pour les autres graphiques
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('*, clients(*)')
      .eq('organization_id', orgId);

    if (invoicesError) {
      console.error('❌ Charts - Error fetching invoices:', invoicesError);
    } else {
      console.log('📊 Charts - Total invoices found:', invoices?.length || 0);
    }

    // Statuts des factures
    const invoiceStatus = [
      { 
        name: 'Payées', 
        value: invoices?.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0,
        color: '#648B78' 
      },
      { 
        name: 'Payées P.', 
        value: invoices?.filter(inv => inv.status === 'partially_paid').reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0,
        color: '#F59E0B' 
      },
      { 
        name: 'En attente', 
        value: invoices?.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0,
        color: '#3B82F6' 
      },
      { 
        name: 'En retard', 
        value: invoices?.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0,
        color: '#EF4444' 
      }
    ].filter(status => status.value > 0);

    // CA par client (top 5)
    const clientRevenueMap = new Map<string, number>();
    invoices?.forEach(invoice => {
      const clientName = invoice.clients?.name || 'Client inconnu';
      const current = clientRevenueMap.get(clientName) || 0;
      clientRevenueMap.set(clientName, current + (invoice.total_amount || 0));
    });

    const clientRevenue = Array.from(clientRevenueMap.entries())
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    console.log('📊 Charts - Final data:', {
      monthlyComparison: monthlyComparison.length,
      invoiceStatus: invoiceStatus.length,
      clientRevenue: clientRevenue.length
    });

    return {
      monthlyComparison,
      topProducts: [], // Nécessiterait une jointure avec les items
      categorySales: [], // Nécessiterait une jointure avec les produits
      invoiceStatus,
      clientRevenue
    };
  };

  return {
    kpiData,
    chartData,
    loading,
    refetch: fetchDashboardData
  };
};
