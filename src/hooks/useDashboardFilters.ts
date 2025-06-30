
import { useState, useEffect } from 'react';

export interface DashboardFilters {
  selectedYear: number;
}

export const useDashboardFilters = () => {
  const currentDate = new Date();
  
  const [filters, setFilters] = useState<DashboardFilters>({
    selectedYear: currentDate.getFullYear(), // 2025
  });

  const updateYear = (year: number) => {
    setFilters(prev => ({ ...prev, selectedYear: year }));
  };

  // Génère une liste d'années disponibles (5 années précédentes + année courante + 2 suivantes)
  const availableYears = Array.from({ length: 8 }, (_, i) => currentDate.getFullYear() - 5 + i);

  return {
    filters,
    updateYear,
    availableYears,
  };
};
