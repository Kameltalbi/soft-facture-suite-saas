
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCurrency } from '@/contexts/CurrencyContext';

interface MonthlyRevenueReportProps {
  period: {
    start?: Date;
    end?: Date;
  };
}

export function MonthlyRevenueReport({ period }: MonthlyRevenueReportProps) {
  const { currency } = useCurrency();
  
  // Données mockées - à remplacer par les vraies données
  const monthlyData = [
    { month: 'Jan', totalHT: 8500, totalTTC: 10200 },
    { month: 'Fév', totalHT: 7200, totalTTC: 8640 },
    { month: 'Mar', totalHT: 9800, totalTTC: 11760 },
    { month: 'Avr', totalHT: 12500, totalTTC: 15000 },
    { month: 'Mai', totalHT: 11200, totalTTC: 13440 },
    { month: 'Juin', totalHT: 13800, totalTTC: 16560 },
    { month: 'Juil', totalHT: 10900, totalTTC: 13080 },
    { month: 'Aoû', totalHT: 8200, totalTTC: 9840 },
    { month: 'Sep', totalHT: 14500, totalTTC: 17400 },
    { month: 'Oct', totalHT: 16200, totalTTC: 19440 },
    { month: 'Nov', totalHT: 15600, totalTTC: 18720 },
    { month: 'Déc', totalHT: 18900, totalTTC: 22680 }
  ];

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('fr-FR', { 
      minimumFractionDigits: currency.decimal_places, 
      maximumFractionDigits: currency.decimal_places 
    })} ${currency.symbol}`;
  };

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
            {monthlyData.map((data) => (
              <TableRow key={data.month}>
                <TableCell className="font-medium">{data.month}</TableCell>
                <TableCell className="text-right">{formatCurrency(data.totalHT)}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(data.totalTTC)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
