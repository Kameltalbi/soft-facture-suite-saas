
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
  TrendingDown,
  FileCheck,
  Package,
  TriangleAlert,
  Star,
  Users
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
  quotesThisMonth: number;
  pendingOrders: number;
  lowStockProducts: number;
  topProduct: { name: string; revenue: number };
  topClient: { name: string; revenue: number };
}

interface DashboardKpisProps {
  data: KpiData;
  loading?: boolean;
}

const SparklineChart = ({ data, color = '#648B78' }: { data: number[]; color?: string }) => (
  <svg width="60" height="20" className="ml-auto">
    <polyline
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      points={data.map((value, index) => `${(index * 15)},${20 - (value / Math.max(...data)) * 15}`).join(' ')}
    />
  </svg>
);

const MiniBarChart = ({ value, max }: { value: number; max: number }) => (
  <div className="ml-auto w-12 h-4 bg-gray-100 rounded overflow-hidden">
    <div 
      className="h-full bg-[#648B78] transition-all duration-300"
      style={{ width: `${(value / max) * 100}%` }}
    />
  </div>
);

export function DashboardKpis({ data, loading = false }: DashboardKpisProps) {
  const { currency } = useCurrency();
  
  const sparklineData = [12, 19, 15, 25, 22, 30, 28];
  const clientSparklineData = [8, 12, 18, 15, 22, 25, 20];
  
  const kpis = [
    {
      title: 'Total factures',
      value: data.totalInvoices,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      format: 'number',
      evolution: '+8.2%',
      evolutionPositive: true
    },
    {
      title: 'Factures payées',
      value: data.paidInvoices,
      icon: CheckCircle2,
      color: 'text-[#648B78]',
      bgColor: 'bg-green-50',
      format: 'currency',
      evolution: '+12.5%',
      evolutionPositive: true,
      sparkline: sparklineData
    },
    {
      title: 'En attente de paiement',
      value: data.pendingInvoices,
      icon: Clock4,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      format: 'currency',
      evolution: '-3.2%',
      evolutionPositive: false
    },
    {
      title: 'Factures en retard',
      value: data.overdueInvoices,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      cardBg: 'bg-red-50/30',
      format: 'currency',
      evolution: '-15.8%',
      evolutionPositive: true
    },
    {
      title: 'Total avoirs',
      value: data.totalCredits,
      icon: Receipt,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      format: 'currency',
      evolution: '+2.1%',
      evolutionPositive: true
    },
    {
      title: 'Chiffre d\'affaires TTC',
      value: data.totalRevenue,
      icon: BarChart2,
      color: 'text-[#648B78]',
      bgColor: 'bg-green-50',
      format: 'currency',
      evolution: '+18.7%',
      evolutionPositive: true,
      sparkline: sparklineData
    },
    {
      title: 'Total TVA collectée',
      value: data.totalVat,
      icon: PercentCircle,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      format: 'currency',
      evolution: '+16.3%',
      evolutionPositive: true
    },
    {
      title: 'Devis envoyés ce mois',
      value: data.quotesThisMonth,
      icon: FileCheck,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      format: 'number',
      evolution: '+22.4%',
      evolutionPositive: true
    },
    {
      title: 'Bons de commande en cours',
      value: data.pendingOrders,
      icon: Package,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      format: 'number',
      evolution: '+5.7%',
      evolutionPositive: true
    },
    {
      title: 'Produits en stock faible',
      value: data.lowStockProducts,
      icon: TriangleAlert,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      format: 'number',
      evolution: '-12.3%',
      evolutionPositive: true
    },
    {
      title: 'Top produit du mois',
      value: data.topProduct.revenue,
      label: data.topProduct.name,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      format: 'currency',
      evolution: '+31.2%',
      evolutionPositive: true,
      miniBar: true
    },
    {
      title: 'Top client du mois',
      value: data.topClient.revenue,
      label: data.topClient.name,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      format: 'currency',
      evolution: '+24.8%',
      evolutionPositive: true,
      sparkline: clientSparklineData,
      sparklineColor: '#3B82F6'
    }
  ];

  const formatValue = (value: number, format: string) => {
    if (loading) return '...';
    
    if (format === 'currency') {
      return `${value.toLocaleString('fr-FR')} ${currency.symbol}`;
    }
    
    return value.toLocaleString('fr-FR');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        const TrendIcon = kpi.evolutionPositive ? TrendingUp : TrendingDown;
        
        return (
          <Card 
            key={kpi.title} 
            className={`hover:shadow-lg transition-all duration-300 border-0 shadow-sm ${kpi.cardBg || 'bg-white'} rounded-xl`}
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-gray-600 leading-tight">
                  {kpi.title}
                </CardTitle>
                {kpi.label && (
                  <p className="text-xs text-gray-500 truncate">{kpi.label}</p>
                )}
              </div>
              <div className={`p-2.5 rounded-xl ${kpi.bgColor} shrink-0`}>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatValue(kpi.value, kpi.format)}
                  </div>
                  {kpi.sparkline && (
                    <SparklineChart 
                      data={kpi.sparkline} 
                      color={kpi.sparklineColor || '#648B78'} 
                    />
                  )}
                  {kpi.miniBar && (
                    <MiniBarChart value={kpi.value} max={50000} />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <TrendIcon className={`h-3 w-3 ${kpi.evolutionPositive ? 'text-[#648B78]' : 'text-red-500'}`} />
                    <span className={`text-xs font-medium ${kpi.evolutionPositive ? 'text-[#648B78]' : 'text-red-500'}`}>
                      {kpi.evolution}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">vs mois dernier</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
