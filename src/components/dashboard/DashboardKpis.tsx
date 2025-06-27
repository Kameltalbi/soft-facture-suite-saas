
import { useCurrency } from '@/contexts/CurrencyContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  <svg width="60" height="20" className="inline-block">
    <polyline
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      points={data.map((value, index) => `${(index * 15)},${20 - (value / Math.max(...data)) * 15}`).join(' ')}
    />
  </svg>
);

const MiniBarChart = ({ value, max }: { value: number; max: number }) => (
  <div className="inline-block w-12 h-4 bg-gray-100 rounded overflow-hidden">
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
    <Card className="border-0 shadow-sm rounded-xl bg-white mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">Indicateurs clés de performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead className="font-semibold">Indicateur</TableHead>
                <TableHead className="font-semibold text-right">Valeur</TableHead>
                <TableHead className="font-semibold text-center">Évolution</TableHead>
                <TableHead className="font-semibold text-center">Graphique</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kpis.map((kpi, index) => {
                const Icon = kpi.icon;
                const TrendIcon = kpi.evolutionPositive ? TrendingUp : TrendingDown;
                
                return (
                  <TableRow key={kpi.title} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div className={`p-2 rounded-lg ${kpi.bgColor} inline-flex`}>
                        <Icon className={`h-4 w-4 ${kpi.color}`} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{kpi.title}</div>
                        {kpi.label && (
                          <div className="text-xs text-gray-500 mt-1">{kpi.label}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-semibold text-lg text-gray-900">
                        {formatValue(kpi.value, kpi.format)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <TrendIcon className={`h-3 w-3 ${kpi.evolutionPositive ? 'text-[#648B78]' : 'text-red-500'}`} />
                        <span className={`text-sm font-medium ${kpi.evolutionPositive ? 'text-[#648B78]' : 'text-red-500'}`}>
                          {kpi.evolution}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {kpi.sparkline && (
                        <SparklineChart 
                          data={kpi.sparkline} 
                          color={kpi.sparklineColor || '#648B78'} 
                        />
                      )}
                      {kpi.miniBar && (
                        <MiniBarChart value={kpi.value} max={50000} />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
