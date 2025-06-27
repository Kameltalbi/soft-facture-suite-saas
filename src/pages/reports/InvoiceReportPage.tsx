
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { ReportFilters } from '@/components/reports/ReportFilters';
import { InvoiceReport } from '@/components/reports/InvoiceReport';
import { useReportExport } from '@/hooks/useReportExport';

const InvoiceReportPage = () => {
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
    // Données mockées pour l'exemple
    const invoicesData = [
      {
        'N° Facture': 'FAC-2024-001',
        'Date': '15/01/2024',
        'Client': 'Entreprise ABC',
        'Montant TTC': '1 250,00 €',
        'Payé': '1 250,00 €',
        'Restant': '0,00 €',
        'Statut': 'Payée'
      },
      {
        'N° Facture': 'FAC-2024-002',
        'Date': '18/01/2024',
        'Client': 'Société XYZ',
        'Montant TTC': '890,50 €',
        'Payé': '400,00 €',
        'Restant': '490,50 €',
        'Statut': 'Partielle'
      },
      {
        'N° Facture': 'FAC-2024-003',
        'Date': '22/01/2024',
        'Client': 'Client DEF',
        'Montant TTC': '2 150,00 €',
        'Payé': '0,00 €',
        'Restant': '2 150,00 €',
        'Statut': 'Non payée'
      }
    ];
    
    exportToPDF('Rapport des Factures', invoicesData);
  };

  const handleCSVExport = () => {
    const invoicesData = [
      {
        numero: 'FAC-2024-001',
        date: '15/01/2024',
        client: 'Entreprise ABC',
        montant_ttc: 1250.00,
        paye: 1250.00,
        restant: 0,
        statut: 'Payée'
      },
      {
        numero: 'FAC-2024-002',
        date: '18/01/2024',
        client: 'Société XYZ',
        montant_ttc: 890.50,
        paye: 400.00,
        restant: 490.50,
        statut: 'Partielle'
      },
      {
        numero: 'FAC-2024-003',
        date: '22/01/2024',
        client: 'Client DEF',
        montant_ttc: 2150.00,
        paye: 0,
        restant: 2150.00,
        statut: 'Non payée'
      }
    ];
    
    exportToCSV(invoicesData, 'rapport-factures');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rapport des Factures</h1>
          <p className="text-muted-foreground">
            Liste détaillée des factures avec statuts et montants
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
              <CardTitle>Factures de la période</CardTitle>
              <CardDescription>Détail complet des factures émises</CardDescription>
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
          <InvoiceReport period={getCurrentPeriod()} />
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceReportPage;
