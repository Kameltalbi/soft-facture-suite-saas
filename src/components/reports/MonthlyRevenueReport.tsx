
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useMonthlyRevenueReport } from '@/hooks/useReports';

interface MonthlyRevenueReportProps {
  period: {
    start?: Date;
    end?: Date;
  };
}

export function MonthlyRevenueReport({ period }: MonthlyRevenueReportProps) {
  const { currency } = useCurrency();
  const currentYear = period.start ? period.start.getFullYear() : new Date().getFullYear();
  const { data: monthlyData = [], isLoading } = useMonthlyRevenueReport(currentYear);

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('fr-FR', { 
      minimumFractionDigits: currency.decimal_places, 
      maximumFractionDigits: currency.decimal_places 
    })} ${currency.symbol}`;
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement des données...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#666" />
            <YAxis stroke="#666" tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
            <Tooltip 
              formatter={(value: number) => [formatCurrency(value), 'CA TTC']}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="totalTTC" fill="#6A9C89" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mois</TableHead>
              <TableHead className="text-right">CA HT</TableHead>
              <TableHead className="text-right">CA TTC</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {monthlyData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  Aucune donnée disponible pour cette année
                </TableCell>
              </TableRow>
            ) : (
              monthlyData.map((data) => (
                <TableRow key={data.month}>
                  <TableCell className="font-medium">{data.month}</TableCell>
                  <TableCell className="text-right">{formatCurrency(data.totalHT)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(data.totalTTC)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
