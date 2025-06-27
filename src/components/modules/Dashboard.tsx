
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, FileText, Users, Package } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const salesData = [
  { month: 'Jan', amount: 4000 },
  { month: 'Fév', amount: 3000 },
  { month: 'Mar', amount: 5000 },
  { month: 'Avr', amount: 4500 },
  { month: 'Mai', amount: 6000 },
  { month: 'Jun', amount: 5500 },
];

const statusData = [
  { name: 'Payées', value: 65, color: '#8DA57A' },
  { name: 'En attente', value: 25, color: '#D96C4F' },
  { name: 'En retard', value: 10, color: '#E57373' },
];

const topProducts = [
  { name: 'Consultation Web', sales: 45, revenue: 13500 },
  { name: 'Design Logo', sales: 32, revenue: 9600 },
  { name: 'Formation React', sales: 28, revenue: 8400 },
  { name: 'Audit SEO', sales: 15, revenue: 4500 },
];

export function Dashboard() {
  const stats = [
    {
      title: 'Chiffre d\'affaires mensuel',
      value: '28 450 €',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-success'
    },
    {
      title: 'Factures émises',
      value: '156',
      change: '+8.2%',
      trend: 'up',
      icon: FileText,
      color: 'text-primary'
    },
    {
      title: 'Clients actifs',
      value: '89',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'text-secondary'
    },
    {
      title: 'Produits vendus',
      value: '234',
      change: '-2.1%',
      trend: 'down',
      icon: Package,
      color: 'text-neutral-600'
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-neutral-50 min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-neutral-600">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-neutral-900">{stat.value}</div>
                <div className="flex items-center mt-2">
                  <TrendIcon 
                    className={`h-4 w-4 mr-1 ${
                      stat.trend === 'up' ? 'text-success' : 'text-destructive'
                    }`} 
                  />
                  <span className={`text-sm ${
                    stat.trend === 'up' ? 'text-success' : 'text-destructive'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-neutral-500 ml-2">vs mois dernier</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Évolution du chiffre d'affaires</CardTitle>
            <CardDescription>Revenus des 6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="month" stroke="#6C6C6C" />
                <YAxis stroke="#6C6C6C" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#6A9C89" 
                  strokeWidth={3}
                  dot={{ fill: '#6A9C89', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Invoice Status */}
        <Card>
          <CardHeader>
            <CardTitle>Statut des factures</CardTitle>
            <CardDescription>Répartition par statut de paiement</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {statusData.map((entry) => (
                <div key={entry.name} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-neutral-600">
                    {entry.name} ({entry.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Produits les plus vendus</CardTitle>
            <CardDescription>Performances ce mois-ci</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{product.name}</p>
                      <p className="text-sm text-neutral-500">{product.sales} ventes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-neutral-900">{product.revenue.toLocaleString()} €</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
