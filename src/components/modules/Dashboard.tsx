
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
      <div className="min-h-screen bg-background">
        <div className="p-8 space-y-8">
          {/* Header Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-text-primary tracking-tight">
                  Dashboard
                </h1>
                <p className="text-lg text-text-secondary">
                  Vue d'ensemble de votre activité commerciale
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-full">
                  <div className="h-2 w-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">En ligne</span>
                </div>
              </div>
            </div>
            
            {/* Gradient divider */}
            <div className="h-1 w-full gradient-primary rounded-full"></div>
          </div>

          {/* Filters */}
          <div className="card-modern">
            <DashboardFilters
              selectedYear={filters.selectedYear}
              selectedMonth={filters.selectedMonth}
              availableYears={availableYears}
              months={months}
              onYearChange={updateYear}
              onMonthChange={updateMonth}
            />
          </div>

          {/* KPI Cards */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-1 bg-primary rounded-full"></div>
              <h2 className="text-2xl font-bold text-text-primary">Indicateurs clés</h2>
            </div>
            <DashboardKpis 
              data={kpiData} 
              loading={loading}
            />
          </div>

          {/* Charts Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-1 bg-secondary rounded-full"></div>
              <h2 className="text-2xl font-bold text-text-primary">Analyses & Graphiques</h2>
            </div>
            <DashboardCharts 
              data={chartData}
              selectedYear={filters.selectedYear}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </CurrencyProvider>
  );
}
