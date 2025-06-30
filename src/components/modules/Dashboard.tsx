
import { DashboardKpis } from '@/components/dashboard/DashboardKpis';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { useDashboardFilters } from '@/hooks/useDashboardFilters';
import { useDashboardData } from '@/hooks/useDashboardData';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';

export function Dashboard() {
  const { filters, updateYear, availableYears } = useDashboardFilters();
  const { kpiData, chartData, loading } = useDashboardData(filters.selectedYear);

  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="p-6 space-y-8">
          {/* Header Section with Year Selector */}
          <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Dashboard Annuel</h1>
              <p className="text-lg text-gray-600">Vue d'ensemble professionnelle de votre activité commerciale</p>
            </div>
            
            <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="p-2.5 rounded-xl bg-[#648B78]/10">
                <Calendar className="h-5 w-5 text-[#648B78]" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Année</label>
                <Select
                  value={filters.selectedYear.toString()}
                  onValueChange={(value) => updateYear(parseInt(value))}
                >
                  <SelectTrigger className="w-32 border-gray-200 focus:border-[#648B78] focus:ring-[#648B78]/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 6 Cartes Synthétiques */}
          <DashboardKpis 
            data={kpiData} 
            loading={loading}
          />

          {/* 6 Graphiques Analytiques */}
          <DashboardCharts 
            data={chartData}
            selectedYear={filters.selectedYear}
            loading={loading}
          />
        </div>
      </div>
    </CurrencyProvider>
  );
}
