
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp, 
  CheckCircle, 
  Calculator, 
  FileText, 
  FileCheck, 
  Users
} from 'lucide-react';

interface DashboardKpiData {
  totalRevenue: number;
  totalEncaisse: number;
  totalVat: number;
  totalInvoices: number;
  totalQuotes: number;
  activeClients: number;
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
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Montant encaissé",
      value: formatCurrency(data.totalEncaisse),
      description: "Paiements reçus",
      icon: CheckCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "TVA collectée",
      value: formatCurrency(data.totalVat),
      description: "Montant total de TVA",
      icon: Calculator,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Nombre de factures",
      value: data.totalInvoices.toString(),
      description: "Total des factures émises",
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Nombre de devis",
      value: data.totalQuotes.toString(),
      description: "Total des devis émis",
      icon: FileCheck,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      title: "Clients actifs",
      value: data.activeClients.toString(),
      description: "Clients ayant généré du CA",
      icon: Users,
      color: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {kpi.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
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
