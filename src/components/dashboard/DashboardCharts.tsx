
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useCurrency } from '@/contexts/CurrencyContext';

interface DashboardChartsProps {
  data: {
    monthlyComparison: Array<{
      month: string;
      currentYear: number;
      previousYear: number;
    }>;
    topProducts: Array<{
      name: string;
      revenue: number;
    }>;
    categorySales: Array<{
      category: string;
      amount: number;
    }>;
    invoiceStatus: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    clientRevenue: Array<{
      name: string;
      revenue: number;
    }>;
  };
  selectedYear: number;
  loading: boolean;
}

export function DashboardCharts({ data, selectedYear, loading }: DashboardChartsProps) {
  const { currency } = useCurrency();

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('fr-FR')} ${currency.symbol}`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Comparaison mensuelle */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Évolution du Chiffre d'Affaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === 'currentYear' ? selectedYear.toString() : (selectedYear - 1).toString()
                  ]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="currentYear" fill="#6A9C89" name={selectedYear.toString()} radius={[4, 4, 0, 0]} />
                <Bar dataKey="previousYear" fill="#A8D5BA" name={(selectedYear - 1).toString()} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Statut des factures */}
      <Card>
        <CardHeader>
          <CardTitle>Statut des Factures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.invoiceStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.invoiceStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {data.invoiceStatus.map((status, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="text-sm text-gray-600">{status.name}</span>
                </div>
                <span className="text-sm font-medium">{formatCurrency(status.value)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top 5 clients */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.clientRevenue.map((client, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#6A9C89] rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium">{client.name}</span>
                </div>
                <span className="text-sm font-medium text-green-600">
                  {formatCurrency(client.revenue)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
