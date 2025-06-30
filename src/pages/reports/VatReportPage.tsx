
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Receipt } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useReportExport } from '@/hooks/useReportExport';
import { useCurrency } from '@/contexts/CurrencyContext';

const VatReportPage = () => {
  const { exportToCSV, exportToPDF, formatCurrency } = useReportExport();
  const { currency } = useCurrency();
  
  // Date filters
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  
  // Generate available years (5 years back to current)
  const availableYears = Array.from({ length: 6 }, (_, i) => currentDate.getFullYear() - 5 + i);
  
  const months = [
    { value: 1, label: 'Janvier' },
    { value: 2, label: 'Février' },
    { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' },
    { value: 8, label: 'Août' },
    { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' },
    { value: 11, label: 'Novembre' },
    { value: 12, label: 'Décembre' },
  ];

  // Mock data - à remplacer par de vraies données
  const vatData = [
    {
      month: 'Janvier 2024',
      vatRate: '20%',
      baseAmount: 10000,
      vatAmount: 2000,
      invoiceCount: 25
    },
    {
      month: 'Janvier 2024',
      vatRate: '10%',
      baseAmount: 5000,
      vatAmount: 500,
      invoiceCount: 8
    },
    {
      month: 'Janvier 2024',
      vatRate: '5.5%',
      baseAmount: 2000,
      vatAmount: 110,
      invoiceCount: 3
    },
    {
      month: 'Février 2024',
      vatRate: '20%',
      baseAmount: 12000,
      vatAmount: 2400,
      invoiceCount: 30
    },
    {
      month: 'Février 2024',
      vatRate: '10%',
      baseAmount: 3000,
      vatAmount: 300,
      invoiceCount: 5
    }
  ];

  const filteredData = vatData.filter(item => {
    const [monthName, year] = item.month.split(' ');
    const monthIndex = months.findIndex(m => m.label === monthName) + 1;
    return parseInt(year) === selectedYear && monthIndex === selectedMonth;
  });

  const totalVatAmount = filteredData.reduce((sum, item) => sum + item.vatAmount, 0);
  const totalBaseAmount = filteredData.reduce((sum, item) => sum + item.baseAmount, 0);
  const totalInvoices = filteredData.reduce((sum, item) => sum + item.invoiceCount, 0);

  const handleExportCSV = () => {
    const exportData = filteredData.map(item => ({
      'Mois': item.month,
      'Taux TVA': item.vatRate,
      'Base HT': formatCurrency(item.baseAmount),
      'TVA': formatCurrency(item.vatAmount),
      'Nb Factures': item.invoiceCount
    }));
    
    exportToCSV(exportData, `tva-collectee-${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`);
  };

  const handleExportPDF = () => {
    const selectedMonthName = months.find(m => m.value === selectedMonth)?.label;
    exportToPDF(
      `TVA Collectée - ${selectedMonthName} ${selectedYear}`,
      filteredData.map(item => ({
        'Mois': item.month,
        'Taux TVA': item.vatRate,
        'Base HT': formatCurrency(item.baseAmount),
        'TVA': formatCurrency(item.vatAmount),
        'Nb Factures': item.invoiceCount.toString()
      }))
    );
  };

  const selectedMonthName = months.find(m => m.value === selectedMonth)?.label;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">TVA Collectée par Mois</h1>
          <p className="text-muted-foreground">
            Analyse détaillée de la TVA collectée avec répartition par taux
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Année :</label>
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger className="w-32">
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

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Mois :</label>
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(parseInt(value))}
              >
                <SelectTrigger className="w-40">
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
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">TVA Totale</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(totalVatAmount)}
                </p>
              </div>
              <Receipt className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Base HT</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalBaseAmount)}
                </p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Factures</p>
                <p className="text-2xl font-bold text-blue-600">{totalInvoices}</p>
              </div>
              <Badge variant="secondary" className="text-blue-600">
                {totalInvoices} docs
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taux Moyen</p>
                <p className="text-2xl font-bold text-orange-600">
                  {totalBaseAmount > 0 ? ((totalVatAmount / totalBaseAmount) * 100).toFixed(1) + '%' : '0%'}
                </p>
              </div>
              <Badge variant="outline" className="text-orange-600">
                Moyenne
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* VAT Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Détail TVA - {selectedMonthName} {selectedYear}</CardTitle>
          <CardDescription>
            Répartition de la TVA collectée par taux d'imposition
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Taux TVA</TableHead>
                  <TableHead className="text-right">Base HT</TableHead>
                  <TableHead className="text-right">Montant TVA</TableHead>
                  <TableHead className="text-right">TTC</TableHead>
                  <TableHead className="text-right">Nb Factures</TableHead>
                  <TableHead className="text-right">% du Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Badge variant="outline">{item.vatRate}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(item.baseAmount)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-primary">
                      {formatCurrency(item.vatAmount)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(item.baseAmount + item.vatAmount)}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.invoiceCount}
                    </TableCell>
                    <TableCell className="text-right">
                      {totalVatAmount > 0 ? ((item.vatAmount / totalVatAmount) * 100).toFixed(1) + '%' : '0%'}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50 font-medium">
                  <TableCell>TOTAL</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(totalBaseAmount)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-primary">
                    {formatCurrency(totalVatAmount)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(totalBaseAmount + totalVatAmount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {totalInvoices}
                  </TableCell>
                  <TableCell className="text-right">
                    100%
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Receipt className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Aucune donnée TVA pour cette période
              </h3>
              <p className="text-sm text-muted-foreground">
                Aucune facture avec TVA trouvée pour {selectedMonthName} {selectedYear}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tax Information */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Receipt className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Information Fiscale</h4>
              <p className="text-sm text-blue-700">
                Ce rapport présente la TVA collectée sur les factures. Assurez-vous de vérifier ces montants 
                avec votre comptable avant de déclarer la TVA. Les montants sont calculés sur la base des 
                factures émises, pas des encaissements.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VatReportPage;
