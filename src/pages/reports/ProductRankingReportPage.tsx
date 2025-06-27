import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ReportFilters } from '@/components/reports/ReportFilters';
import { ProductRankingReport } from '@/components/reports/ProductRankingReport';
import { useReportExport } from '@/hooks/useReportExport';

const ProductRankingReportPage = () => {
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
    const productsData = [
      { 'Rang': '#1', 'Produit': 'Développement Web', 'Quantité': '25', 'CA TTC': '25 000 €' },
      { 'Rang': '#2', 'Produit': 'Consultation Informatique', 'Quantité': '45', 'CA TTC': '18 000 €' },
      { 'Rang': '#3', 'Produit': 'Maintenance Système', 'Quantité': '35', 'CA TTC': '12 600 €' },
      { 'Rang': '#4', 'Produit': 'Formation', 'Quantité': '18', 'CA TTC': '8 500 €' },
      { 'Rang': '#5', 'Produit': 'Audit Sécurité', 'Quantité': '8', 'CA TTC': '6 400 €' }
    ];
    
    exportToPDF('Classement des Produits', productsData);
  };

  const handleCSVExport = () => {
    const productsData = [
      { rang: 1, produit: 'Développement Web', quantite: 25, ca_ttc: 25000 },
      { rang: 2, produit: 'Consultation Informatique', quantite: 45, ca_ttc: 18000 },
      { rang: 3, produit: 'Maintenance Système', quantite: 35, ca_ttc: 12600 },
      { rang: 4, produit: 'Formation', quantite: 18, ca_ttc: 8500 },
      { rang: 5, produit: 'Audit Sécurité', quantite: 8, ca_ttc: 6400 }
    ];
    
    exportToCSV(productsData, 'rapport-classement');
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
          <h1 className="text-3xl font-bold tracking-tight">Classement des Produits</h1>
          <p className="text-muted-foreground">
            Produits classés par chiffre d'affaires décroissant
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
              <CardTitle>Top des produits</CardTitle>
              <CardDescription>Classement de vos meilleurs produits et services</CardDescription>
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
          <ProductRankingReport period={getCurrentPeriod()} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductRankingReportPage;
