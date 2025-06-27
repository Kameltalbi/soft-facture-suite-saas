
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';

interface DashboardFiltersProps {
  selectedYear: number;
  selectedMonth: number;
  availableYears: number[];
  months: { value: number; label: string }[];
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
}

export function DashboardFilters({
  selectedYear,
  selectedMonth,
  availableYears,
  months,
  onYearChange,
  onMonthChange,
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

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#648B78]/10">
              <Clock className="h-5 w-5 text-[#648B78]" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Mois</label>
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => onMonthChange(parseInt(value))}
              >
                <SelectTrigger className="w-40 border-gray-200 focus:border-[#648B78] focus:ring-[#648B78]/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
