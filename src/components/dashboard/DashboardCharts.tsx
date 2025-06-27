
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
}

interface DashboardChartsProps {
  data: ChartData;
  selectedYear: number;
  loading?: boolean;
}

export function DashboardCharts({ data, selectedYear, loading = false }: DashboardChartsProps) {
  const COLORS = {
    primary: '#6A9C89',
    secondary: '#E57373',
    success: '#81C784',
    warning: '#FFB74D',
    info: '#64B5F6'
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Courbe comparative CA */}
      <Card>
        <CardHeader>
          <CardTitle>Chiffre d'affaires mensuel</CardTitle>
          <CardDescription>
            Comparaison {selectedYear} vs {selectedYear - 1}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.monthlyComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [
                  new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  }).format(value)
                ]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="currentYear" 
                stroke={COLORS.primary}
                strokeWidth={3}
                name={selectedYear.toString()}
                dot={{ fill: COLORS.primary, strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="previousYear" 
                stroke={COLORS.secondary}
                strokeWidth={3}
                name={(selectedYear - 1).toString()}
                dot={{ fill: COLORS.secondary, strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top produits */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 produits</CardTitle>
          <CardDescription>Par chiffre d'affaires</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.topProducts} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#666" />
              <YAxis dataKey="name" type="category" stroke="#666" width={100} />
              <Tooltip 
                formatter={(value: number) => [
                  new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  }).format(value), 'CA'
                ]}
              />
              <Bar dataKey="revenue" fill={COLORS.primary} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* CA par catégorie */}
      <Card>
        <CardHeader>
          <CardTitle>Chiffre d'affaires par catégorie</CardTitle>
          <CardDescription>Répartition mensuelle</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.categorySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="category" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                formatter={(value: number) => [
                  new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  }).format(value), 'CA'
                ]}
              />
              <Bar dataKey="amount" fill={COLORS.info} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Statut des factures */}
      <Card>
        <CardHeader>
          <CardTitle>Statut des factures</CardTitle>
          <CardDescription>Répartition par statut</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.invoiceStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                dataKey="value"
              >
                {data.invoiceStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `${value.toLocaleString('fr-FR')} €`, name
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
