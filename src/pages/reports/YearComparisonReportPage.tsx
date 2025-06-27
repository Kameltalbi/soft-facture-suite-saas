
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { ReportFilters } from '@/components/reports/ReportFilters';
import { YearComparisonReport } from '@/components/reports/YearComparisonReport';
import { useReportExport } from '@/hooks/useReportExport';

const YearComparisonReportPage = () => {
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
    const comparisonData = [
      { 'Mois': 'Jan', '2024': '10 200,00 €', '2023': '8 500,00 €', 'Croissance': '+20,0%' },
      { 'Mois': 'Fév', '2024': '8 640,00 €', '2023': '9 200,00 €', 'Croissance': '-6,1%' },
      { 'Mois': 'Mar', '2024': '11 760,00 €', '2023': '9 800,00 €', 'Croissance': '+20,0%' },
      { 'Mois': 'Avr', '2024': '15 000,00 €', '2023': '12 000,00 €', 'Croissance': '+25,0%' },
      { 'Mois': 'Mai', '2024': '13 440,00 €', '2023': '11 500,00 €', 'Croissance': '+16,9%' },
      { 'Mois': 'Juin', '2024': '16 560,00 €', '2023': '14 200,00 €', 'Croissance': '+16,6%' }
    ];
    
    exportToPDF('Comparaison Annuelle', comparisonData);
  };

  const handleCSVExport = () => {
    const comparisonData = [
      { mois: 'Jan', annee_actuelle: 10200, annee_precedente: 8500, croissance: 20.0 },
      { mois: 'Fév', annee_actuelle: 8640, annee_precedente: 9200, croissance: -6.1 },
      { mois: 'Mar', annee_actuelle: 11760, annee_precedente: 9800, croissance: 20.0 },
      { mois: 'Avr', annee_actuelle: 15000, annee_precedente: 12000, croissance: 25.0 },
      { mois: 'Mai', annee_actuelle: 13440, annee_precedente: 11500, croissance: 16.9 },
      { mois: 'Juin', annee_actuelle: 16560, annee_precedente: 14200, croissance: 16.6 }
    ];
    
    exportToCSV(comparisonData, 'rapport-comparaison');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Comparaison Annuelle</h1>
          <p className="text-muted-foreground">
            CA vs année précédente - évolution et tendances
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
              <CardTitle>Comparaison {selectedYear} vs {selectedYear - 1}</CardTitle>
              <CardDescription>Analyse comparative de votre performance annuelle</CardDescription>
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
          <YearComparisonReport period={getCurrentPeriod()} />
        </CardContent>
      </Card>
    </div>
  );
};

export default YearComparisonReportPage;
