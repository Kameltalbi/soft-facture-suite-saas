
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useCurrency } from '@/contexts/CurrencyContext';

interface ChartData {
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
}

interface DashboardChartsProps {
  data: ChartData;
  selectedYear: number;
  loading?: boolean;
}

export function DashboardCharts({ data, selectedYear, loading = false }: DashboardChartsProps) {
  const { currency } = useCurrency();
  
  const COLORS = {
    currentYear: '#648B78',
    previousYear: '#94A3B8',
    product: '#648B78',
    category: ['#648B78', '#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#F97316'],
    client: '#3B82F6'
  };

  const formatCurrency = (value: number) => {
    return `${value.toLocaleString('fr-FR')} ${currency.symbol}`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse border-0 shadow-sm rounded-xl">
            <CardHeader className="pb-4">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gray-200 rounded-lg"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Chiffre d'affaires mensuel */}
      <Card className="border-0 shadow-sm rounded-xl bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">Chiffre d'affaires mensuel</CardTitle>
          <CardDescription className="text-gray-600">
            Comparaison {selectedYear} vs {selectedYear - 1}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data.monthlyComparison} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis 
                dataKey="month" 
                stroke="#64748B"
                tick={{ fontSize: 12, fill: '#64748B' }}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <YAxis 
                stroke="#64748B"
                tick={{ fontSize: 12, fill: '#64748B' }}
                axisLine={{ stroke: '#E2E8F0' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === 'currentYear' ? selectedYear.toString() : (selectedYear - 1).toString()
                ]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="currentYear" 
                stroke={COLORS.currentYear}
                strokeWidth={3}
                name={selectedYear.toString()}
                dot={{ fill: COLORS.currentYear, strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: COLORS.currentYear, strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="previousYear" 
                stroke={COLORS.previousYear}
                strokeWidth={3}
                name={(selectedYear - 1).toString()}
                dot={{ fill: COLORS.previousYear, strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: COLORS.previousYear, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* CA par produit/service */}
      <Card className="border-0 shadow-sm rounded-xl bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">CA par produit/service</CardTitle>
          <CardDescription className="text-gray-600">Chiffre d'affaires par produit et service</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart 
              data={data.topProducts}
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis 
                dataKey="name" 
                stroke="#64748B"
                tick={{ fontSize: 11, fill: '#64748B' }}
                angle={-45}
                textAnchor="end"
                height={80}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <YAxis 
                stroke="#64748B"
                tick={{ fontSize: 12, fill: '#64748B' }}
                axisLine={{ stroke: '#E2E8F0' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => [formatCurrency(value), 'CA']}
              />
              <Bar 
                dataKey="revenue" 
                fill={COLORS.product}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* CA par catégorie - Camembert */}
      <Card className="border-0 shadow-sm rounded-xl bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">CA par catégorie</CardTitle>
          <CardDescription className="text-gray-600">Répartition du chiffre d'affaires par catégorie</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={data.categorySales}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="amount"
                label={({ category, percent }) => 
                  `${category}: ${(percent * 100).toFixed(1)}%`
                }
                labelLine={false}
              >
                {data.categorySales.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS.category[index % COLORS.category.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => [formatCurrency(value), 'CA']}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => (
                  <span style={{ fontWeight: 500 }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Statut des factures */}
      <Card className="border-0 shadow-sm rounded-xl bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">Statut des factures</CardTitle>
          <CardDescription className="text-gray-600">Répartition par statut (% et valeur brute)</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={data.invoiceStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                dataKey="value"
                label={({ name, percent }) => 
                  `${name}: ${(percent * 100).toFixed(1)}%`
                }
                labelLine={false}
              >
                {data.invoiceStatus.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => [formatCurrency(value), 'Montant']}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry) => (
                  <span style={{ color: entry.color, fontWeight: 500 }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
