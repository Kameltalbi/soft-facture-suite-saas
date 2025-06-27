
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  CheckCircle2, 
  Clock4, 
  AlertCircle, 
  Receipt, 
  BarChart2, 
  PercentCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface KpiData {
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  totalCredits: number;
  totalRevenue: number;
  totalVat: number;
}

interface DashboardKpisProps {
  data: KpiData;
  loading?: boolean;
}

export function DashboardKpis({ data, loading = false }: DashboardKpisProps) {
  const { currency } = useCurrency();
  
  const kpis = [
    {
      title: 'Total factures',
      value: data.totalInvoices,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      format: 'number'
    },
    {
      title: 'Factures payées',
      value: data.paidInvoices,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      format: 'currency'
    },
    {
      title: 'En attente',
      value: data.pendingInvoices,
      icon: Clock4,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      format: 'currency'
    },
    {
      title: 'En retard',
      value: data.overdueInvoices,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      format: 'currency'
    },
    {
      title: 'Total avoirs',
      value: data.totalCredits,
      icon: Receipt,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      format: 'currency'
    },
    {
      title: 'Chiffre d\'affaires TTC',
      value: data.totalRevenue,
      icon: BarChart2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      format: 'currency'
    },
    {
      title: 'Total TVA collectée',
      value: data.totalVat,
      icon: PercentCircle,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      format: 'currency'
    },
  ];

  const formatValue = (value: number, format: string) => {
    if (loading) return '...';
    
    if (format === 'currency') {
      return `${value.toLocaleString('fr-FR')} ${currency.symbol}`;
    }
    
    return value.toLocaleString('fr-FR');
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        
        return (
          <Card key={kpi.title} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {kpi.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-primary">
                {formatValue(kpi.value, kpi.format)}
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-500">+5.2%</span>
                <span className="text-xs text-gray-500 ml-2">vs mois dernier</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
