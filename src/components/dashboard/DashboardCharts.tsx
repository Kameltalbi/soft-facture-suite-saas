
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useCurrency } from '@/contexts/CurrencyContext';

interface DashboardChartsProps {
  data: {
    caByCategory: Array<{
      category: string;
      amount: number;
    }>;
    caByProduct: Array<{
      name: string;
      revenue: number;
    }>;
    monthlyComparison: Array<{
      month: string;
      currentYear: number;
      previousYear: number;
    }>;
    invoicesPerMonth: Array<{
      month: string;
      count: number;
    }>;
    top20Clients: Array<{
      name: string;
      revenue: number;
    }>;
    clientDistribution: Array<{
      name: string;
      value: number;
      color: string;
    }>;
  };
  selectedYear: number;
  loading: boolean;
}

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', 
  '#ff00ff', '#00ffff', '#ff0000', '#0000ff', '#ffff00',
  '#ff8042', '#8dd1e1', '#d084d0', '#87ceeb', '#dda0dd',
  '#98fb98', '#f0e68c', '#ffa07a', '#20b2aa', '#87cefa'
];

export function DashboardCharts({ data, selectedYear, loading }: DashboardChartsProps) {
  const { currency } = useCurrency();

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('fr-FR', { 
      minimumFractionDigits: currency.decimal_places, 
      maximumFractionDigits: currency.decimal_places 
    })} ${currency.symbol}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. CA par catégorie */}
        <Card>
          <CardHeader>
            <CardTitle>CA par catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.caByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="amount"
                    nameKey="category"
                    label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                    labelLine={false}
                  >
                    {data.caByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-1 max-h-32 overflow-y-auto">
              {data.caByCategory.map((category, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="truncate max-w-32">{category.category}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(category.amount)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 2. CA par mois */}
        <Card>
          <CardHeader>
            <CardTitle>CA par mois ({selectedYear})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={formatNumber} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="currentYear" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 3. CA par mois vs année précédente */}
        <Card>
          <CardHeader>
            <CardTitle>CA Mensuel vs {selectedYear - 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.monthlyComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={formatNumber} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Line 
                    type="monotone" 
                    dataKey="currentYear" 
                    stroke="#ffc658" 
                    strokeWidth={3}
                    name={selectedYear.toString()}
                    dot={{ fill: '#ffc658', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="previousYear" 
                    stroke="#ff7300" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name={(selectedYear - 1).toString()}
                    dot={{ fill: '#ff7300', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 4. Nombre de factures par mois */}
        <Card>
          <CardHeader>
            <CardTitle>Factures par mois</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.invoicesPerMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#00ff00" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 5. Top 20 clients par CA */}
        <Card>
          <CardHeader>
            <CardTitle>Top 20 Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 overflow-y-auto">
              <ResponsiveContainer width="100%" height={data.top20Clients.length * 25}>
                <BarChart data={data.top20Clients.slice(0, 20)} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tickFormatter={formatNumber} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="revenue" fill="#ff00ff" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 6. Répartition du CA par client (Camembert) */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition CA Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.clientDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.clientDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-1 max-h-32 overflow-y-auto">
              {data.clientDistribution.map((client, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="truncate max-w-24">{client.name}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(client.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
