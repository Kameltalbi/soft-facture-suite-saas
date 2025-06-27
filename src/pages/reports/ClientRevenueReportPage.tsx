
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ReportFilters } from '@/components/reports/ReportFilters';
import { ClientRevenueReport } from '@/components/reports/ClientRevenueReport';
import { useReportExport } from '@/hooks/useReportExport';

const ClientRevenueReportPage = () => {
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
    const clientsData = [
      { 'Client': 'Entreprise ABC', 'Nb Factures': '8', 'Montant Total': '28 500 €', 'Payé': '25 000 €', 'Dû': '3 500 €', 'Statut': 'En attente' },
      { 'Client': 'Société XYZ', 'Nb Factures': '12', 'Montant Total': '22 800 €', 'Payé': '22 800 €', 'Dû': '0 €', 'Statut': 'À jour' },
      { 'Client': 'Client DEF', 'Nb Factures': '6', 'Montant Total': '15 600 €', 'Payé': '12 000 €', 'Dû': '3 600 €', 'Statut': 'En attente' },
      { 'Client': 'Entreprise GHI', 'Nb Factures': '4', 'Montant Total': '9 200 €', 'Payé': '9 200 €', 'Dû': '0 €', 'Statut': 'À jour' }
    ];
    
    exportToPDF('CA par Client', clientsData);
  };

  const handleCSVExport = () => {
    const clientsData = [
      { client: 'Entreprise ABC', nb_factures: 8, montant_total: 28500, paye: 25000, du: 3500, statut: 'En attente' },
      { client: 'Société XYZ', nb_factures: 12, montant_total: 22800, paye: 22800, du: 0, statut: 'À jour' },
      { client: 'Client DEF', nb_factures: 6, montant_total: 15600, paye: 12000, du: 3600, statut: 'En attente' },
      { client: 'Entreprise GHI', nb_factures: 4, montant_total: 9200, paye: 9200, du: 0, statut: 'À jour' }
    ];
    
    exportToCSV(clientsData, 'rapport-clients');
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
          <ClientRevenueReport period={getCurrentPeriod()} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientRevenueReportPage;
