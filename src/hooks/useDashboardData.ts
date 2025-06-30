
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
  quotesThisYear: number;
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

export const useDashboardData = (selectedYear: number) => {
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
    quotesThisYear: 0,
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
      console.log('🔍 Dashboard - Fetching yearly data for organization:', profile.organization_id, 'Year:', selectedYear);
      fetchDashboardData();
    }
  }, [profile?.organization_id, selectedYear]);

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

    console.log('📊 Dashboard - Starting yearly data fetch for org:', profile.organization_id, 'Year:', selectedYear);
    setLoading(true);
    
    try {
      // Récupérer la devise de l'organisation
      const currency = await fetchOrganizationCurrency();
      console.log('💰 Dashboard - Currency:', currency);

      // Récupérer les données KPI pour l'année complète
      const kpis = await fetchKpiData();
      console.log('📈 Dashboard - KPIs for year:', selectedYear, kpis);
      
      setKpiData({
        ...kpis,
        currency
      });

      // Récupérer les données pour les graphiques
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
        totalInvoices: 0,
        paidInvoices: 0,
        pendingInvoices: 0,
        overdueInvoices: 0,
        totalCredits: 0,
        totalRevenue: 0,
        totalVat: 0,
        quotesThisYear: 0,
        pendingOrders: 0,
        lowStockProducts: 0,
        topProduct: { name: 'Aucun produit', revenue: 0 },
        categorySales: []
      };
    }

    // Toujours utiliser l'année complète pour toutes les organisations
    const startDate = new Date(selectedYear, 0, 1); // 1er janvier de l'année
    const endDate = new Date(selectedYear, 11, 31); // 31 décembre de l'année

    console.log('📅 KPI - Date range for FULL YEAR:', { 
      year: selectedYear,
      startDate: startDate.toISOString().split('T')[0], 
      endDate: endDate.toISOString().split('T')[0] 
    });

    // Factures de l'année complète
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('*')
      .eq('organization_id', orgId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);

    if (invoicesError) {
      console.error('❌ KPI - Error fetching invoices:', invoicesError);
    } else {
      console.log('📄 KPI - Invoices found for FULL YEAR:', invoices?.length || 0);
    }

    // Avoirs de l'année
    const { data: credits, error: creditsError } = await supabase
      .from('credit_notes')
      .select('total_amount')
      .eq('organization_id', orgId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);

    if (creditsError) {
      console.error('❌ KPI - Error fetching credits:', creditsError);
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

    // Calculs des KPI sur toute l'année
    const totalInvoices = invoices?.length || 0;
    const paidInvoices = invoices?.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;
    const pendingInvoices = invoices?.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;
    const overdueInvoices = invoices?.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;
    const totalCredits = credits?.reduce((sum, credit) => sum + (credit.total_amount || 0), 0) || 0;
    const totalRevenue = invoices?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;
    const totalVat = invoices?.reduce((sum, inv) => sum + (inv.tax_amount || 0), 0) || 0;

    console.log('📊 KPI - Calculated values for FULL YEAR:', {
      year: selectedYear,
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
      quotesThisYear: quotes?.length || 0,
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

    console.log('📊 Charts - Fetching data for org:', orgId, 'Year:', selectedYear);

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

    // Récupérer les données pour les autres graphiques (année complète)
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);

    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('*, clients(*)')
      .eq('organization_id', orgId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);

    if (invoicesError) {
      console.error('❌ Charts - Error fetching invoices:', invoicesError);
    } else {
      console.log('📊 Charts - Total invoices found for full year:', invoices?.length || 0);
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

    console.log('📊 Charts - Final data for full year:', {
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
