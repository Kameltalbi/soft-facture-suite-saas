
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
  totalExportRevenue: number;
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
  growthData: Array<{
    month: string;
    growthPercentage: number;
    currentYear: number;
    previousYear: number;
  }>;
  top20Clients: Array<{
    name: string;
    revenue: number;
  }>;
  salesChannelDistribution: Array<{
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
    totalExportRevenue: 0,
    activeClients: 0,
    currency: { code: 'EUR', symbol: '€', name: 'Euro', decimal_places: 2 }
  });
  const [chartData, setChartData] = useState<DashboardChartData>({
    caByCategory: [],
    caByProduct: [],
    monthlyComparison: [],
    growthData: [],
    top20Clients: [],
    salesChannelDistribution: [],
    invoiceStatusDistribution: []
  });

  useEffect(() => {
    if (profile?.organization_id && exchangeRates.length >= 0) {
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
        totalExportRevenue: 0,
        activeClients: 0
      };
    }

    // Récupérer la devise par défaut
    const currency = await fetchOrganizationCurrency();

    // Utiliser directement les chaînes de dates pour éviter les problèmes de timezone
    const startDate = `${selectedYear}-01-01`;
    const endDate = `${selectedYear}-12-31`;

    console.log('📅 KPI - Date range for FULL YEAR:', { 
      year: selectedYear,
      startDate, 
      endDate 
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
      .gte('date', startDate)
      .lte('date', endDate);

    if (invoicesError) {
      console.error('❌ KPI - Error fetching invoices:', invoicesError);
    } else {
      console.log('📄 KPI - Invoices found for FULL YEAR:', invoices?.length || 0);
    }

    // CA Export (factures avec sales_channel = 'export')
    const totalExportRevenue = invoices?.filter(inv => inv.sales_channel === 'export').reduce((sum, inv) => {
      const convertedAmount = convertToDefaultCurrency(
        inv.subtotal || 0,
        inv.currency_id || currency.id,
        currency.id,
        exchangeRates
      );
      return sum + convertedAmount;
    }, 0) || 0;

    // Calculs des KPI avec conversion de devises
    const totalInvoices = invoices?.length || 0;
    
    // Convertir tous les montants vers la devise par défaut
    const totalRevenue = invoices?.reduce((sum, inv) => {
      const convertedAmount = convertToDefaultCurrency(
        inv.subtotal || 0,
        inv.currency_id || currency.id,
        currency.id,
        exchangeRates
      );
      return sum + convertedAmount;
    }, 0) || 0;
    
    const totalEncaisse = invoices?.filter(inv => inv.status === 'paid').reduce((sum, inv) => {
      const convertedAmount = convertToDefaultCurrency(
        inv.subtotal || 0,
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
    
    // Clients actifs (ayant généré du CA)
    const activeClientsSet = new Set();
    invoices?.forEach(invoice => {
      if (invoice.subtotal && invoice.subtotal > 0) {
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
      totalExportRevenue,
      activeClients
    });

    return {
      totalRevenue,
      totalEncaisse,
      totalVat,
      totalInvoices,
      totalExportRevenue,
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
        growthData: [],
        top20Clients: [],
        salesChannelDistribution: [],
        invoiceStatusDistribution: []
      };
    }

    // Récupérer la devise par défaut
    const currency = await fetchOrganizationCurrency();

    console.log('📊 Charts - Fetching data for org:', orgId, 'Year:', selectedYear);

    // Utiliser directement les chaînes de dates pour éviter les problèmes de timezone
    const startDate = `${selectedYear}-01-01`;
    const endDate = `${selectedYear}-12-31`;

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
      .gte('date', startDate)
      .lte('date', endDate);

    if (invoicesError) {
      console.error('❌ Charts - Error fetching invoices:', invoicesError);
      return {
        caByCategory: [],
        caByProduct: [],
        monthlyComparison: [],
        growthData: [],
        top20Clients: [],
        salesChannelDistribution: [],
        invoiceStatusDistribution: []
      };
    }

    // 1. CA par catégorie avec conversion
    const categoryMap = new Map<string, number>();
    
    // Récupérer tous les produits avec leurs catégories pour le mapping
    const { data: organizationProducts } = await supabase
      .from('products')
      .select('name, category')
      .eq('organization_id', orgId);
    
    // Créer un mapping nom produit -> catégorie pour la correspondance
    const productCategoryMap = new Map();
    if (organizationProducts) {
      organizationProducts.forEach(product => {
        if (product.category && product.category.trim() !== '') {
          productCategoryMap.set(product.name.toLowerCase(), product.category);
        }
      });
    }
    
    console.log('🗺️ Mapping produit->catégorie:', Object.fromEntries(productCategoryMap));
    console.log('📄 Factures avec items:', invoicesWithItems?.length);
    
    invoicesWithItems?.forEach(invoice => {
      invoice.invoice_items?.forEach(item => {
        let category = 'Non catégorisé';
        
        console.log('🔍 Item analysé:', {
          description: item.description,
          product_id: item.product_id,
          product: item.products,
          product_category: item.products?.category
        });
        
        // Méthode 1 : Si le produit est lié directement et a une catégorie
        if (item.products?.category && item.products.category.trim() !== '') {
          category = item.products.category;
          console.log('✅ Catégorie trouvée via produit lié:', category);
        } 
        // Méthode 2 : Correspondance par nom de produit (quand product_id est null)
        else if (item.description) {
          const itemName = item.description.toLowerCase();
          const matchedCategory = productCategoryMap.get(itemName);
          if (matchedCategory) {
            category = matchedCategory;
            console.log('✅ Catégorie trouvée via nom:', category, 'pour', item.description);
          } else {
            console.log('❌ Aucune catégorie trouvée pour:', item.description);
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

    // 3. Comparaison mensuelle avec année précédente (UNE SEULE REQUÊTE OPTIMISÉE)
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    
    // Utiliser directement les chaînes de dates pour éviter les problèmes de timezone
    const currentYearStart = `${selectedYear}-01-01`;
    const currentYearEnd = `${selectedYear}-12-31`;
    const prevYearStart = `${selectedYear - 1}-01-01`;
    const prevYearEnd = `${selectedYear - 1}-12-31`;

    // Une seule requête pour les deux années
    const { data: allYearInvoices } = await supabase
      .from('invoices')
      .select('subtotal, currency_id, date, currencies(code)')
      .eq('organization_id', orgId)
      .gte('date', prevYearStart)
      .lte('date', currentYearEnd);

    // Organiser les données par mois et année
    const monthlyComparison = months.map((month, monthIndex) => {
      const currentYearAmount = allYearInvoices
        ?.filter(inv => {
          const invDate = new Date(inv.date);
          return invDate.getFullYear() === selectedYear && invDate.getMonth() === monthIndex;
        })
        .reduce((sum, inv) => {
          const convertedAmount = convertToDefaultCurrency(
            inv.subtotal || 0,
            inv.currency_id || currency.id,
            currency.id,
            exchangeRates
          );
          return sum + convertedAmount;
        }, 0) || 0;

      const previousYearAmount = allYearInvoices
        ?.filter(inv => {
          const invDate = new Date(inv.date);
          return invDate.getFullYear() === selectedYear - 1 && invDate.getMonth() === monthIndex;
        })
        .reduce((sum, inv) => {
          const convertedAmount = convertToDefaultCurrency(
            inv.subtotal || 0,
            inv.currency_id || currency.id,
            currency.id,
            exchangeRates
          );
          return sum + convertedAmount;
        }, 0) || 0;

      return {
        month,
        currentYear: currentYearAmount,
        previousYear: previousYearAmount
      };
    });

    // 4. Données pour la courbe de croissance
    const growthData = monthlyComparison.map(data => {
      let growthPercentage = 0;
      
      if (data.previousYear > 0) {
        // Formule taux de croissance : (CA2025 - CA2024) / CA2024 × 100
        growthPercentage = ((data.currentYear - data.previousYear) / data.previousYear) * 100;
      } else if (data.currentYear > 0) {
        // Si pas de CA l'année précédente mais CA cette année = 100% de croissance
        growthPercentage = 100;
      }
      // Si les deux sont 0, la croissance reste à 0%

      return {
        month: data.month,
        growthPercentage,
        currentYear: data.currentYear,
        previousYear: data.previousYear
      };
    });

    // 5. Top 20 clients par CA avec conversion
    const clientRevenueMap = new Map<string, number>();
    invoicesWithItems?.forEach(invoice => {
      const clientName = invoice.clients?.company || invoice.clients?.name || 'Client inconnu';
      
      // Convertir le montant vers la devise par défaut
      const convertedAmount = convertToDefaultCurrency(
        invoice.subtotal || 0,
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

    // 6. Répartition CA local vs export
    const localRevenue = invoicesWithItems?.filter(inv => inv.sales_channel !== 'export').reduce((sum, inv) => {
      const convertedAmount = convertToDefaultCurrency(
        inv.subtotal || 0,
        inv.currency_id || currency.id,
        currency.id,
        exchangeRates
      );
      return sum + convertedAmount;
    }, 0) || 0;
    
    const exportRevenue = invoicesWithItems?.filter(inv => inv.sales_channel === 'export').reduce((sum, inv) => {
      const convertedAmount = convertToDefaultCurrency(
        inv.subtotal || 0,
        inv.currency_id || currency.id,
        currency.id,
        exchangeRates
      );
      return sum + convertedAmount;
    }, 0) || 0;

    const salesChannelDistribution = [
      {
        name: 'Local',
        value: localRevenue,
        color: '#22c55e'
      },
      {
        name: 'Export',
        value: exportRevenue,
        color: '#3b82f6'
      }
    ].filter(item => item.value > 0);

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
      growthData: growthData.length,
      top20Clients: top20Clients.length,
      salesChannelDistribution: salesChannelDistribution.length,
      invoiceStatusDistribution: invoiceStatusDistribution.length
    });

    return {
      caByCategory,
      caByProduct,
      monthlyComparison,
      growthData,
      top20Clients,
      salesChannelDistribution,
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
