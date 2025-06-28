
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Package, TrendingUp, Calendar, Trophy, Users, Receipt, Archive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
  const navigate = useNavigate();

  const reports = [
    {
      id: 'invoices',
      title: 'Factures du mois',
      description: 'Liste détaillée des factures avec statuts et montants pour la période sélectionnée',
      icon: FileText,
      color: 'bg-blue-500',
      route: '/dashboard/reports/invoices'
    },
    {
      id: 'product-revenue',
      title: 'CA par produit/service',
      description: 'Chiffre d\'affaires généré par chaque produit et service sur la période',
      icon: Package,
      color: 'bg-green-500',
      route: '/dashboard/reports/product-revenue'
    },
    {
      id: 'monthly-revenue',
      title: 'CA mensuel annuel',
      description: 'Évolution du chiffre d\'affaires mois par mois avec graphique de tendance',
      icon: TrendingUp,
      color: 'bg-purple-500',
      route: '/dashboard/reports/monthly-revenue'
    },
    {
      id: 'year-comparison',
      title: 'Comparaison annuelle',
      description: 'CA vs année précédente avec analyse des écarts et tendances',
      icon: Calendar,
      color: 'bg-orange-500',
      route: '/dashboard/reports/year-comparison'
    },
    {
      id: 'product-ranking',
      title: 'Classement des produits',
      description: 'Top des produits classés par chiffre d\'affaires décroissant avec performance',
      icon: Trophy,
      color: 'bg-yellow-500',
      route: '/dashboard/reports/product-ranking'
    },
    {
      id: 'client-revenue',
      title: 'CA par client',
      description: 'Revenus générés par chaque client avec analyse du portefeuille',
      icon: Users,
      color: 'bg-red-500',
      route: '/dashboard/reports/client-revenue'
    },
    {
      id: 'vat-report',
      title: 'TVA collectée',
      description: 'Rapport TVA collectée par mois avec cumul annuel et détail des taux',
      icon: Receipt,
      color: 'bg-indigo-500',
      route: '/dashboard/reports/vat-report'
    },
    {
      id: 'stock-movements',
      title: 'Mouvements de stock',
      description: 'Suivi des mouvements de stock par produit et par mois avec analyse des tendances',
      icon: Archive,
      color: 'bg-teal-500',
      route: '/dashboard/reports/stock-movements'
    }
  ];

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rapports</h1>
          <p className="text-muted-foreground">
            Sélectionnez un rapport pour analyser vos données commerciales
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Card 
              key={report.id} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => handleCardClick(report.route)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${report.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {report.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground text-center">
          💡 Cliquez sur une carte pour accéder au rapport détaillé avec filtres et options d'export
        </p>
      </div>
    </div>
  );
};

export default Reports;
