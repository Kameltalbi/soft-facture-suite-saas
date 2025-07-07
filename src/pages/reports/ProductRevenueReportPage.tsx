
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ReportFilters } from '@/components/reports/ReportFilters';
import { ProductRevenueReport } from '@/components/reports/ProductRevenueReport';
import { useReportExport } from '@/hooks/useReportExport';
import { useProductRevenueReport } from '@/hooks/useReports';

const ProductRevenueReportPage = () => {
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

  const { data: products = [] } = useProductRevenueReport(getCurrentPeriod());

  const handlePDFExport = () => {
    const productsData = products.map(product => ({
      'Produit/Service': product.name,
      'Quantité': product.quantity.toString(),
      'Total HT': `${product.totalHT.toFixed(2)} €`,
      'Total TTC': `${product.totalTTC.toFixed(2)} €`
    }));
    
    exportToPDF('CA par Produit/Service', productsData);
  };

  const handleCSVExport = () => {
    const productsData = products.map(product => ({
      produit: product.name,
      quantite: product.quantity,
      total_ht: product.totalHT,
      total_ttc: product.totalTTC
    }));
    
    exportToCSV(productsData, 'rapport-produits');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/app')}
          style={{ borderColor: '#D96C4F', color: '#D96C4F' }}
          className="hover:bg-[#D96C4F] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CA par Produit/Service</h1>
          <p className="text-muted-foreground">
            Chiffre d'affaires généré par chaque produit/service
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
              <CardTitle>Revenus par produit</CardTitle>
              <CardDescription>Performance commerciale de vos produits et services</CardDescription>
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
          <ProductRevenueReport period={getCurrentPeriod()} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductRevenueReportPage;
