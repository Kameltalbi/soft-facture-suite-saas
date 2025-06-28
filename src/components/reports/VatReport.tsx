
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrency } from '@/contexts/CurrencyContext';

interface VatReportProps {
  period: {
    start?: Date;
    end?: Date;
  };
}

export function VatReport({ period }: VatReportProps) {
  const { currency } = useCurrency();
  
  // Données mockées - à remplacer par les vraies données
  const monthlyVatData = [
    { month: 'Jan', vat20: 1200, vat10: 300, vat5_5: 150, total: 1650, cumul: 1650 },
    { month: 'Fév', vat20: 1100, vat10: 280, vat5_5: 120, total: 1500, cumul: 3150 },
    { month: 'Mar', vat20: 1350, vat10: 320, vat5_5: 180, total: 1850, cumul: 5000 },
    { month: 'Avr', vat20: 1450, vat10: 340, vat5_5: 200, total: 1990, cumul: 6990 },
    { month: 'Mai', vat20: 1250, vat10: 290, vat5_5: 160, total: 1700, cumul: 8690 },
    { month: 'Juin', vat20: 1600, vat10: 380, vat5_5: 220, total: 2200, cumul: 10890 },
    { month: 'Juil', vat20: 1350, vat10: 310, vat5_5: 170, total: 1830, cumul: 12720 },
    { month: 'Aoû', vat20: 1000, vat10: 250, vat5_5: 130, total: 1380, cumul: 14100 },
    { month: 'Sep', vat20: 1550, vat10: 360, vat5_5: 190, total: 2100, cumul: 16200 },
    { month: 'Oct', vat20: 1700, vat10: 400, vat5_5: 240, total: 2340, cumul: 18540 },
    { month: 'Nov', vat20: 1650, vat10: 380, vat5_5: 210, total: 2240, cumul: 20780 },
    { month: 'Déc', vat20: 1800, vat10: 420, vat5_5: 260, total: 2480, cumul: 23260 }
  ];

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('fr-FR')} ${currency.symbol}`;
  };

  const totalVatCollected = monthlyVatData.reduce((sum, data) => sum + data.total, 0);

  return (
    <div className="space-y-6">
      {/* Résumé TVA */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">TVA 20%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(monthlyVatData.reduce((sum, data) => sum + data.vat20, 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">TVA 10%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(monthlyVatData.reduce((sum, data) => sum + data.vat10, 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">TVA 5,5%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(monthlyVatData.reduce((sum, data) => sum + data.vat5_5, 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total TVA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalVatCollected)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique TVA mensuelle */}
      <Card>
        <CardHeader>
          <CardTitle>TVA collectée par mois</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyVatData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'TVA']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="vat20" stackId="a" fill="#3B82F6" name="TVA 20%" />
                <Bar dataKey="vat10" stackId="a" fill="#10B981" name="TVA 10%" />
                <Bar dataKey="vat5_5" stackId="a" fill="#F59E0B" name="TVA 5,5%" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Graphique cumul TVA */}
      <Card>
        <CardHeader>
          <CardTitle>Cumul TVA collectée</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyVatData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Cumul TVA']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line type="monotone" dataKey="cumul" stroke="#8B5CF6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tableau détaillé */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mois</TableHead>
              <TableHead className="text-right">TVA 20%</TableHead>
              <TableHead className="text-right">TVA 10%</TableHead>
              <TableHead className="text-right">TVA 5,5%</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Cumul</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {monthlyVatData.map((data) => (
              <TableRow key={data.month}>
                <TableCell className="font-medium">{data.month}</TableCell>
                <TableCell className="text-right">{formatCurrency(data.vat20)}</TableCell>
                <TableCell className="text-right">{formatCurrency(data.vat10)}</TableCell>
                <TableCell className="text-right">{formatCurrency(data.vat5_5)}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(data.total)}</TableCell>
                <TableCell className="text-right font-bold text-green-600">{formatCurrency(data.cumul)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
