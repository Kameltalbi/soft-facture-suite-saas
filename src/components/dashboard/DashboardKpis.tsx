
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
          <Card key={i} className="card-modern">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-5 rounded-full" />
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
      color: "text-primary",
      bgColor: "bg-primary/10",
      trend: "+12%"
    },
    {
      title: "Factures Payées",
      value: formatCurrency(data.paidInvoices),
      description: "Montant encaissé",
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
      trend: "+8%"
    },
    {
      title: "En Attente",
      value: formatCurrency(data.pendingInvoices),
      description: "Factures en attente",
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
      trend: "-3%"
    },
    {
      title: "En Retard",
      value: formatCurrency(data.overdueInvoices),
      description: "Factures en retard",
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      trend: "+5%"
    },
    {
      title: "Avoirs",
      value: formatCurrency(data.totalCredits),
      description: "Montant des avoirs",
      icon: CreditCard,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      trend: "-2%"
    },
    {
      title: "Chiffre d'Affaires",
      value: formatCurrency(data.totalRevenue),
      description: "CA total du mois",
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
      trend: "+15%"
    },
    {
      title: "TVA Collectée",
      value: formatCurrency(data.totalVat),
      description: "Montant de TVA",
      icon: Calculator,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      trend: "+10%"
    },
    {
      title: "Devis",
      value: data.quotesThisMonth.toString(),
      description: "Devis ce mois",
      icon: FileCheck,
      color: "text-accent-600",
      bgColor: "bg-accent/20",
      trend: "+22%"
    },
    {
      title: "Commandes",
      value: data.pendingOrders.toString(),
      description: "Commandes en attente",
      icon: Package,
      color: "text-warning",
      bgColor: "bg-warning/10",
      trend: "+7%"
    },
    {
      title: "Stock Faible",
      value: data.lowStockProducts.toString(),
      description: "Produits < 10 unités",
      icon: AlertCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      trend: "-1%"
    },
    {
      title: "Top Produit",
      value: data.topProduct.name,
      description: formatCurrency(data.topProduct.revenue),
      icon: Trophy,
      color: "text-warning",
      bgColor: "bg-warning/10",
      trend: "+18%"
    },
    {
      title: "Catégories",
      value: data.categorySales.length.toString(),
      description: "Catégories actives",
      icon: PieChart,
      color: "text-accent-600",
      bgColor: "bg-accent/20",
      trend: "+4%"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <Card key={index} className="card-stats group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-strong">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-text-secondary group-hover:text-text-primary transition-colors">
                {kpi.title}
              </CardTitle>
              <div className={`p-2 rounded-xl ${kpi.bgColor} transition-all duration-300 group-hover:scale-110`}>
                <Icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-text-primary group-hover:text-primary transition-colors">
                  {kpi.value}
                </div>
                <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                  kpi.trend.startsWith('+') 
                    ? 'text-success bg-success/10' 
                    : 'text-destructive bg-destructive/10'
                }`}>
                  {kpi.trend}
                </div>
              </div>
              <p className="text-xs text-text-secondary group-hover:text-text-primary transition-colors">
                {kpi.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
