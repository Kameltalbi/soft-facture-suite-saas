
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
    currentYear: '#6A9C89',
    previousYear: '#64B5F6',
    product: '#6A9C89',
    category: '#64B5F6',
    paid: '#81C784',
    pending: '#FFB74D',
    overdue: '#E57373'
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
      {/* 1. Courbe comparative CA / mois année N vs N-1 */}
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
              <XAxis 
                dataKey="month" 
                stroke="#666"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke="#666"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number, name: string) => [
                  new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  }).format(value),
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
                dot={{ fill: COLORS.currentYear, strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, stroke: COLORS.currentYear, strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="previousYear" 
                stroke={COLORS.previousYear}
                strokeWidth={3}
                name={(selectedYear - 1).toString()}
                dot={{ fill: COLORS.previousYear, strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, stroke: COLORS.previousYear, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 2. Barres horizontales – CA par produit (Top 5) */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 produits</CardTitle>
          <CardDescription>Par chiffre d'affaires (tri décroissant)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={data.topProducts.slice(0, 5).sort((a, b) => b.revenue - a.revenue)} 
              layout="horizontal"
              margin={{ left: 80, right: 30, top: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                type="number" 
                stroke="#666"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#666" 
                width={100}
                tick={{ fontSize: 11 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => [
                  new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  }).format(value), 'CA'
                ]}
              />
              <Bar 
                dataKey="revenue" 
                fill={COLORS.product}
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 3. Barres verticales – CA par catégorie */}
      <Card>
        <CardHeader>
          <CardTitle>Chiffre d'affaires par catégorie</CardTitle>
          <CardDescription>Total CA par catégorie (période sélectionnée)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={data.categorySales}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="category" 
                stroke="#666"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#666"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => [
                  new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  }).format(value), 'CA'
                ]}
              />
              <Bar 
                dataKey="amount" 
                fill={COLORS.category}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 4. Camembert – Statuts des factures */}
      <Card>
        <CardHeader>
          <CardTitle>Statut des factures</CardTitle>
          <CardDescription>Répartition par statut (% et valeur brute)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.invoiceStatus}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={100}
                dataKey="value"
                label={({ name, percent, value }) => 
                  `${name}: ${(percent * 100).toFixed(1)}%`
                }
                labelLine={false}
              >
                {data.invoiceStatus.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={
                      entry.name === 'Payées' ? COLORS.paid :
                      entry.name === 'En attente' ? COLORS.pending :
                      COLORS.overdue
                    } 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number, name: string) => [
                  new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  }).format(value), 
                  name
                ]}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry) => (
                  <span style={{ color: entry.color }}>
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
