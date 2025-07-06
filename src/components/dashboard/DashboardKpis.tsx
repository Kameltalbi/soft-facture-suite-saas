
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp, 
  CheckCircle, 
  Calculator, 
  FileText, 
  ArrowUpRight, 
  Users
} from 'lucide-react';

interface DashboardKpiData {
  totalRevenue: number;
  totalEncaisse: number;
  totalVat: number;
  totalInvoices: number;
  totalExportRevenue: number;
  activeClients: number;
  currency: { code: string; symbol: string; name: string; decimal_places: number };
}

interface DashboardKpisProps {
  data: DashboardKpiData;
  loading: boolean;
}

export function DashboardKpis({ data, loading }: DashboardKpisProps) {
  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: data.currency.decimal_places, maximumFractionDigits: data.currency.decimal_places })} ${data.currency.symbol}`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
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
      title: "Chiffre d'affaires total",
      value: formatCurrency(data.totalRevenue),
      description: "CA cumulé de l'année (HT)",
      icon: TrendingUp,
      iconColor: "text-emerald-600",
      iconBgColor: "bg-emerald-50",
      titleColor: "text-emerald-700",
      cardBgColor: "bg-emerald-25"
    },
    {
      title: "Montant encaissé",
      value: formatCurrency(data.totalEncaisse),
      description: "Paiements reçus",
      icon: CheckCircle,
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-50",
      titleColor: "text-blue-700",
      cardBgColor: "bg-blue-25"
    },
    {
      title: "TVA collectée",
      value: formatCurrency(data.totalVat),
      description: "Montant total de TVA",
      icon: Calculator,
      iconColor: "text-purple-600",
      iconBgColor: "bg-purple-50",
      titleColor: "text-purple-700",
      cardBgColor: "bg-purple-25"
    },
    {
      title: "Nombre de factures",
      value: data.totalInvoices.toString(),
      description: "Total des factures émises",
      icon: FileText,
      iconColor: "text-orange-600",
      iconBgColor: "bg-orange-50",
      titleColor: "text-orange-700",
      cardBgColor: "bg-orange-25"
    },
    {
      title: "CA Export",
      value: formatCurrency(data.totalExportRevenue),
      description: "Chiffre d'affaires à l'export",
      icon: ArrowUpRight,
      iconColor: "text-indigo-600",
      iconBgColor: "bg-indigo-50",
      titleColor: "text-indigo-700",
      cardBgColor: "bg-indigo-25"
    },
    {
      title: "Clients actifs",
      value: data.activeClients.toString(),
      description: "Clients ayant généré du CA",
      icon: Users,
      iconColor: "text-rose-600",
      iconBgColor: "bg-rose-50",
      titleColor: "text-rose-700",
      cardBgColor: "bg-rose-25"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <Card key={index} className={`hover:shadow-lg transition-shadow ${kpi.cardBgColor} border-0`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${kpi.titleColor}`}>
                {kpi.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${kpi.iconBgColor}`}>
                <Icon className={`h-4 w-4 ${kpi.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-700 mb-1">
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
