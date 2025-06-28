
import { useState } from 'react';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { DashboardKpis } from '@/components/dashboard/DashboardKpis';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { useDashboardFilters } from '@/hooks/useDashboardFilters';
import { useDashboardData } from '@/hooks/useDashboardData';
import { CurrencyProvider } from '@/contexts/CurrencyContext';

export function Dashboard() {
  const { filters, updateYear, updateMonth, availableYears, months } = useDashboardFilters();
  const { kpiData, chartData, loading } = useDashboardData(filters.selectedYear, filters.selectedMonth);

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
            data={kpiData} 
            loading={loading}
          />

          {/* Charts Section */}
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
