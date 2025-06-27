
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ReportFilters } from '@/components/reports/ReportFilters';
import { InvoiceReport } from '@/components/reports/InvoiceReport';
import { ProductRevenueReport } from '@/components/reports/ProductRevenueReport';
import { MonthlyRevenueReport } from '@/components/reports/MonthlyRevenueReport';
import { YearComparisonReport } from '@/components/reports/YearComparisonReport';
import { ProductRankingReport } from '@/components/reports/ProductRankingReport';
import { ClientRevenueReport } from '@/components/reports/ClientRevenueReport';

const Reports = () => {
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

  const reports = [
    {
      id: 'invoices',
      title: 'Factures du mois/période',
      description: 'Liste détaillée des factures avec statuts et montants',
      component: InvoiceReport
    },
    {
      id: 'product-revenue',
      title: 'Chiffre d\'affaires par produit',
      description: 'CA généré par chaque produit/service sur la période',
      component: ProductRevenueReport
    },
    {
      id: 'monthly-revenue',
      title: 'CA mensuel sur l\'année',
      description: 'Évolution du chiffre d\'affaires mois par mois',
      component: MonthlyRevenueReport
    },
    {
      id: 'year-comparison',
      title: 'CA vs année précédente',
      description: 'Comparaison avec l\'année N-1',
      component: YearComparisonReport
    },
    {
      id: 'product-ranking',
      title: 'Classement des produits',
      description: 'Produits classés par CA décroissant',
      component: ProductRankingReport
    },
    {
      id: 'client-revenue',
      title: 'CA par client',
      description: 'Chiffre d\'affaires généré par client',
      component: ClientRevenueReport
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rapports</h1>
          <p className="text-muted-foreground">
            Générez et téléchargez vos rapports d'activité
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reports.map((report) => {
          const ReportComponent = report.component;
          return (
            <Card key={report.id} className="h-fit">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      PDF
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ReportComponent period={getCurrentPeriod()} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Reports;
