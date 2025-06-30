
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface DashboardFiltersProps {
  selectedYear: number;
  availableYears: number[];
  onYearChange: (year: number) => void;
}

export function DashboardFilters({
  selectedYear,
  availableYears,
  onYearChange,
}: DashboardFiltersProps) {
  return (
    <Card className="border-0 shadow-sm bg-white rounded-xl">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#648B78]/10">
              <Calendar className="h-5 w-5 text-[#648B78]" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Année</label>
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => onYearChange(parseInt(value))}
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
          
          <div className="text-sm text-gray-500 bg-blue-50 px-3 py-2 rounded-lg">
            📊 Affichage des données pour l'année complète
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
