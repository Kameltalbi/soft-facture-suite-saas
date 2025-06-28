
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  CreditCard, 
  TrendingUp,
  Calculator,
  FileCheck,
  Package,
  AlertCircle,
  Trophy,
  PieChart
} from 'lucide-react';

interface DashboardKpiData {
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  totalCredits: number;
  totalRevenue: number;
  totalVat: number;
  quotesThisMonth: number;
  pendingOrders: number;
  lowStockProducts: number;
  topProduct: { name: string; revenue: number };
  categorySales: Array<{ name: string; value: number; color: string }>;
  currency: { code: string; symbol: string; name: string };
}

interface DashboardKpisProps {
  data: DashboardKpiData;
  loading: boolean;
}

export function DashboardKpis({ data, loading }: DashboardKpisProps) {
  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} ${data.currency.symbol}`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const kpis = [
    {
      title: "Total Factures",
      value: data.totalInvoices.toString(),
      description: "Factures créées ce mois",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Factures Payées",
      value: formatCurrency(data.paidInvoices),
      description: "Montant encaissé",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "En Attente",
      value: formatCurrency(data.pendingInvoices),
      description: "Factures en attente",
      icon: Clock,
      color: "text-orange-600"
    },
    {
      title: "En Retard",
      value: formatCurrency(data.overdueInvoices),
      description: "Factures en retard",
      icon: AlertTriangle,
      color: "text-red-600"
    },
    {
      title: "Avoirs",
      value: formatCurrency(data.totalCredits),
      description: "Montant des avoirs",
      icon: CreditCard,
      color: "text-purple-600"
    },
    {
      title: "Chiffre d'Affaires",
      value: formatCurrency(data.totalRevenue),
      description: "CA total du mois",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "TVA Collectée",
      value: formatCurrency(data.totalVat),
      description: "Montant de TVA",
      icon: Calculator,
      color: "text-blue-600"
    },
    {
      title: "Devis",
      value: data.quotesThisMonth.toString(),
      description: "Devis ce mois",
      icon: FileCheck,
      color: "text-indigo-600"
    },
    {
      title: "Commandes",
      value: data.pendingOrders.toString(),
      description: "Commandes en attente",
      icon: Package,
      color: "text-amber-600"
    },
    {
      title: "Stock Faible",
      value: data.lowStockProducts.toString(),
      description: "Produits < 10 unités",
      icon: AlertCircle,
      color: "text-red-600"
    },
    {
      title: "Top Produit",
      value: data.topProduct.name,
      description: formatCurrency(data.topProduct.revenue),
      icon: Trophy,
      color: "text-yellow-600"
    },
    {
      title: "Catégories",
      value: data.categorySales.length.toString(),
      description: "Catégories actives",
      icon: PieChart,
      color: "text-pink-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {kpi.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {kpi.value}
              </div>
              <p className="text-xs text-gray-500">
                {kpi.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
