
import { useState, useEffect } from 'react';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { DashboardKpis } from '@/components/dashboard/DashboardKpis';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { useDashboardFilters } from '@/hooks/useDashboardFilters';
import { CurrencyProvider } from '@/contexts/CurrencyContext';

// Enhanced mock data with all 12 KPIs
const generateMockData = (year: number, month: number) => {
  const kpiData = {
    totalInvoices: 156,
    paidInvoices: 125000,
    pendingInvoices: 45000,
    overdueInvoices: 12000,
    totalCredits: 5500,
    totalRevenue: 125000,
    totalVat: 25000,
    quotesThisMonth: 28,
    pendingOrders: 12,
    lowStockProducts: 8,
    topProduct: { name: 'Consultation Web', revenue: 45000 },
    topClient: { name: 'TechCorp SARL', revenue: 32000 }
  };

  const chartData = {
    monthlyComparison: [
      { month: 'Jan', currentYear: 15000, previousYear: 12000 },
      { month: 'Fév', currentYear: 18000, previousYear: 14000 },
      { month: 'Mar', currentYear: 22000, previousYear: 18000 },
      { month: 'Avr', currentYear: 19000, previousYear: 16000 },
      { month: 'Mai', currentYear: 25000, previousYear: 20000 },
      { month: 'Jun', currentYear: 28000, previousYear: 22000 },
      { month: 'Jul', currentYear: 24000, previousYear: 19000 },
      { month: 'Aoû', currentYear: 26000, previousYear: 21000 },
      { month: 'Sep', currentYear: 30000, previousYear: 24000 },
      { month: 'Oct', currentYear: 32000, previousYear: 26000 },
      { month: 'Nov', currentYear: 28000, previousYear: 23000 },
      { month: 'Déc', currentYear: 35000, previousYear: 28000 },
    ],
    topProducts: [
      { name: 'Consultation Web', revenue: 45000 },
      { name: 'Design Logo', revenue: 32000 },
      { name: 'Formation React', revenue: 28000 },
      { name: 'Audit SEO', revenue: 22000 },
      { name: 'Maintenance', revenue: 18000 },
    ],
    categorySales: [
      { category: 'Services', amount: 85000 },
      { category: 'Produits', amount: 45000 },
      { category: 'Formation', amount: 32000 },
      { category: 'Conseil', amount: 28000 },
    ],
    invoiceStatus: [
      { name: 'Payées', value: 125000, color: '#648B78' },
      { name: 'En attente', value: 45000, color: '#F59E0B' },
      { name: 'En retard', value: 12000, color: '#EF4444' },
    ],
    clientRevenue: [
      { name: 'TechCorp SARL', revenue: 32000 },
      { name: 'Digital Solutions', revenue: 28000 },
      { name: 'StartUp Innov', revenue: 22000 },
      { name: 'WebAgency Pro', revenue: 18000 },
      { name: 'E-commerce Plus', revenue: 15000 },
    ]
  };

  return { kpiData, chartData };
};

export function Dashboard() {
  const { filters, updateYear, updateMonth, availableYears, months } = useDashboardFilters();
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(() => 
    generateMockData(filters.selectedYear, filters.selectedMonth)
  );

  // Simulation du chargement des données
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const newData = generateMockData(filters.selectedYear, filters.selectedMonth);
      setDashboardData(newData);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.selectedYear, filters.selectedMonth]);

  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="p-6 space-y-8">
          {/* Header Section */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Dashboard</h1>
            <p className="text-lg text-gray-600">Vue d'ensemble de votre activité commerciale</p>
          </div>

          {/* Filters */}
          <DashboardFilters
            selectedYear={filters.selectedYear}
            selectedMonth={filters.selectedMonth}
            availableYears={availableYears}
            months={months}
            onYearChange={updateYear}
            onMonthChange={updateMonth}
          />

          {/* KPI Cards */}
          <DashboardKpis 
            data={dashboardData.kpiData} 
            loading={loading}
          />

          {/* Charts Section */}
          <DashboardCharts 
            data={dashboardData.chartData}
            selectedYear={filters.selectedYear}
            loading={loading}
          />
        </div>
      </div>
    </CurrencyProvider>
  );
}
