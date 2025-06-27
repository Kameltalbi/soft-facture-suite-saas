
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { ReportFilters } from '@/components/reports/ReportFilters';
import { ClientRevenueReport } from '@/components/reports/ClientRevenueReport';

const ClientRevenueReportPage = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [periodType, setPeriodType] = useState<'monthly' | 'custom'>('monthly');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const getCurrentPeriod = () => {
    if (periodType === 'monthly') {
      return {
        start: new Date(selectedYear, selectedMonth - 1, 1),
        end: new Date(selectedYear, selectedMonth, 0)
      };
    }
    return {
      start: startDate,
      end: endDate
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CA par Client</h1>
          <p className="text-muted-foreground">
            Chiffre d'affaires généré par chaque client
          </p>
        </div>
      </div>

      <ReportFilters
        periodType={periodType}
        setPeriodType={setPeriodType}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Revenus par client</CardTitle>
              <CardDescription>Performance de vos relations clients</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <FileText className="h-4 w-4" />
                PDF
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ClientRevenueReport period={getCurrentPeriod()} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientRevenueReportPage;
