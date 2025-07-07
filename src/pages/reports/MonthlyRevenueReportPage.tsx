
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ReportFilters } from '@/components/reports/ReportFilters';
import { MonthlyRevenueReport } from '@/components/reports/MonthlyRevenueReport';
import { useReportExport } from '@/hooks/useReportExport';

const MonthlyRevenueReportPage = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [periodType, setPeriodType] = useState<'monthly' | 'custom'>('monthly');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  
  const { exportToCSV, exportToPDF } = useReportExport();

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

  const handlePDFExport = () => {
    const monthlyData = [
      { 'Mois': 'Jan', 'CA HT': '8 500,00 €', 'CA TTC': '10 200,00 €' },
      { 'Mois': 'Fév', 'CA HT': '7 200,00 €', 'CA TTC': '8 640,00 €' },
      { 'Mois': 'Mar', 'CA HT': '9 800,00 €', 'CA TTC': '11 760,00 €' },
      { 'Mois': 'Avr', 'CA HT': '12 500,00 €', 'CA TTC': '15 000,00 €' },
      { 'Mois': 'Mai', 'CA HT': '11 200,00 €', 'CA TTC': '13 440,00 €' },
      { 'Mois': 'Juin', 'CA HT': '13 800,00 €', 'CA TTC': '16 560,00 €' }
    ];
    
    exportToPDF('CA Mensuel Annuel', monthlyData);
  };

  const handleCSVExport = () => {
    const monthlyData = [
      { mois: 'Jan', ca_ht: 8500, ca_ttc: 10200 },
      { mois: 'Fév', ca_ht: 7200, ca_ttc: 8640 },
      { mois: 'Mar', ca_ht: 9800, ca_ttc: 11760 },
      { mois: 'Avr', ca_ht: 12500, ca_ttc: 15000 },
      { mois: 'Mai', ca_ht: 11200, ca_ttc: 13440 },
      { mois: 'Juin', ca_ht: 13800, ca_ttc: 16560 }
    ];
    
    exportToCSV(monthlyData, 'rapport-mensuel');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/reports')}
          style={{ borderColor: '#D96C4F', color: '#D96C4F' }}
          className="hover:bg-[#D96C4F] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CA Mensuel Annuel</h1>
          <p className="text-muted-foreground">
            Évolution du chiffre d'affaires mois par mois
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
              <CardTitle>Revenus mensuels</CardTitle>
              <CardDescription>Analyse de l'évolution de votre chiffre d'affaires</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={handlePDFExport}>
                <FileText className="h-4 w-4" />
                PDF
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleCSVExport}>
                <Download className="h-4 w-4" />
                CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <MonthlyRevenueReport period={getCurrentPeriod()} />
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyRevenueReportPage;
