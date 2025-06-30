
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
          <Card key={i} className="card-modern">
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
      <Card className="lg:col-span-2 card-modern hover:shadow-strong transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-text-primary">Évolution du Chiffre d'Affaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" className="text-sm" />
                <YAxis stroke="#6B7280" tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} className="text-sm" />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === 'currentYear' ? selectedYear.toString() : (selectedYear - 1).toString()
                  ]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    color: '#1F2937'
                  }}
                />
                <Bar dataKey="currentYear" fill="#6C4CF1" name={selectedYear.toString()} radius={[6, 6, 0, 0]} />
                <Bar dataKey="previousYear" fill="#C7D2FE" name={(selectedYear - 1).toString()} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Statut des factures */}
      <Card className="card-modern hover:shadow-strong transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-text-primary">Statut des Factures</CardTitle>
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
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    color: '#1F2937'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
            {data.invoiceStatus.map((status, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm" 
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="text-sm font-medium text-text-primary">{status.name}</span>
                </div>
                <span className="text-sm font-bold text-text-primary">{formatCurrency(status.value)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top 5 clients */}
      <Card className="card-modern hover:shadow-strong transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-text-primary">Top 5 Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.clientRevenue.map((client, index) => (
              <div key={index} className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-accent/50 transition-all duration-200 hover:scale-105">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold shadow-primary">
                    {index + 1}
                  </div>
                  <span className="text-sm font-semibold text-text-primary">{client.name}</span>
                </div>
                <span className="text-sm font-bold text-primary">
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
