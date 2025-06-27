
import { useState, useEffect } from 'react';

export interface DashboardFilters {
  selectedYear: number;
  selectedMonth: number;
}

export const useDashboardFilters = () => {
  const currentDate = new Date();
  const [filters, setFilters] = useState<DashboardFilters>({
    selectedYear: currentDate.getFullYear(),
    selectedMonth: currentDate.getMonth() + 1, // +1 car getMonth() retourne 0-11
  });

  const updateYear = (year: number) => {
    setFilters(prev => ({ ...prev, selectedYear: year }));
  };

  const updateMonth = (month: number) => {
    setFilters(prev => ({ ...prev, selectedMonth: month }));
  };

  // Génère une liste d'années disponibles (5 années précédentes + année courante + 2 suivantes)
  const availableYears = Array.from({ length: 8 }, (_, i) => currentDate.getFullYear() - 5 + i);

  const months = [
    { value: 1, label: 'Janvier' },
    { value: 2, label: 'Février' },
    { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' },
    { value: 8, label: 'Août' },
    { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' },
    { value: 11, label: 'Novembre' },
    { value: 12, label: 'Décembre' },
  ];

  return {
    filters,
    updateYear,
    updateMonth,
    availableYears,
    months,
  };
};
