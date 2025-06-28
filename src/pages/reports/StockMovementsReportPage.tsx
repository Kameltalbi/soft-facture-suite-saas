
import { useState } from 'react';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportFilters } from '@/components/reports/ReportFilters';
import { StockMovementsReport } from '@/components/reports/StockMovementsReport';
import { useReportExport } from '@/hooks/useReportExport';
import { useNavigate } from 'react-router-dom';

export default function StockMovementsReportPage() {
  const navigate = useNavigate();
  const { exportToCSV, exportToPDF } = useReportExport();
  
  const [periodType, setPeriodType] = useState<'monthly' | 'custom'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleExportCSV = () => {
    // Données mockées pour l'export
    const exportData = [
      { Produit: 'Ordinateur Portable Dell', Mois: 'Janvier', Entrées: '15', Sorties: '12', Net: '3' },
      { Produit: 'Souris Logitech MX', Mois: 'Janvier', Entrées: '50', Sorties: '45', Net: '5' },
      // ... autres données
    ];
    exportToCSV(exportData, 'rapport-mouvements-stock');
  };

  const handleExportPDF = () => {
    exportToPDF('Rapport Mouvements de Stock', []);
  };

  const period = periodType === 'monthly' 
    ? { start: new Date(selectedYear, selectedMonth - 1, 1), end: new Date(selectedYear, selectedMonth, 0) }
    : { start: startDate, end: endDate };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard/reports')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Rapport Mouvements de Stock</h1>
            <p className="text-muted-foreground">
              Suivi des mouvements de stock par produit et par mois
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <FileText className="h-4 w-4 mr-2" />
            Exporter CSV
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Exporter PDF
          </Button>
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
          <CardTitle>Mouvements de Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <StockMovementsReport period={period} />
        </CardContent>
      </Card>
    </div>
  );
}
