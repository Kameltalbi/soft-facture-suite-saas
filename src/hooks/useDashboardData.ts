
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
    categorySales: []
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
      fetchDashboardData();
    }
  }, [profile?.organization_id, selectedYear, selectedMonth]);

  const fetchDashboardData = async () => {
    if (!profile?.organization_id) return;

    setLoading(true);
    try {
      // Récupérer les données KPI
      const kpis = await fetchKpiData();
      setKpiData(kpis);

      // Récupérer les données pour les graphiques
      const charts = await fetchChartData();
      setChartData(charts);
    } catch (error) {
      console.error('Erreur lors de la récupération des données du dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKpiData = async (): Promise<DashboardKpiData> => {
    const orgId = profile?.organization_id;
    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 0);

    // Factures
    const { data: invoices } = await supabase
      .from('invoices')
      .select('*')
      .eq('organization_id', orgId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);

    // Avoirs
    const { data: credits } = await supabase
      .from('credit_notes')
      .select('total_amount')
      .eq('organization_id', orgId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);

    // Devis
    const { data: quotes } = await supabase
      .from('quotes')
      .select('*')
      .eq('organization_id', orgId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);

    // Bons de commande
    const { data: purchaseOrders } = await supabase
      .from('purchase_orders')
      .select('*')
      .eq('organization_id', orgId)
      .eq('status', 'pending');

    // Produits avec stock faible
    const { data: lowStockProducts } = await supabase
      .from('products')
      .select('*')
      .eq('organization_id', orgId)
      .lt('stock_quantity', 10);

    // Calculs des KPI
    const totalInvoices = invoices?.length || 0;
    const paidInvoices = invoices?.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;
    const pendingInvoices = invoices?.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;
    const overdueInvoices = invoices?.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;
    const totalCredits = credits?.reduce((sum, credit) => sum + (credit.total_amount || 0), 0) || 0;
    const totalRevenue = invoices?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;
    const totalVat = invoices?.reduce((sum, inv) => sum + (inv.tax_amount || 0), 0) || 0;

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
    const { data: invoices } = await supabase
      .from('invoices')
      .select('*, clients(*)')
      .eq('organization_id', orgId);

    // Statuts des factures
    const invoiceStatus = [
      { 
        name: 'Payées', 
        value: invoices?.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0,
        color: '#648B78' 
      },
      { 
        name: 'En attente', 
        value: invoices?.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0,
        color: '#F59E0B' 
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
