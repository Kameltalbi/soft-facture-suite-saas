
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';

interface StockMovementsReportProps {
  period: {
    start?: Date;
    end?: Date;
  };
}

export function StockMovementsReport({ period }: StockMovementsReportProps) {
  
  // Données mockées - à remplacer par les vraies données
  const stockMovements = [
    {
      productName: 'Ordinateur Portable Dell',
      sku: 'DELL-XPS-001',
      movements: [
        { month: 'Jan', entries: 15, exits: 12, adjustments: 0, net: 3 },
        { month: 'Fév', entries: 10, exits: 8, adjustments: -1, net: 1 },
        { month: 'Mar', entries: 20, exits: 18, adjustments: 0, net: 2 },
        { month: 'Avr', entries: 12, exits: 15, adjustments: 0, net: -3 },
        { month: 'Mai', entries: 8, exits: 10, adjustments: 1, net: -1 },
        { month: 'Juin', entries: 25, exits: 22, adjustments: 0, net: 3 }
      ]
    },
    {
      productName: 'Souris Logitech MX',
      sku: 'LOG-MX-001',
      movements: [
        { month: 'Jan', entries: 50, exits: 45, adjustments: 0, net: 5 },
        { month: 'Fév', entries: 40, exits: 38, adjustments: -2, net: 0 },
        { month: 'Mar', entries: 60, exits: 55, adjustments: 0, net: 5 },
        { month: 'Avr', entries: 35, exits: 40, adjustments: 0, net: -5 },
        { month: 'Mai', entries: 30, exits: 32, adjustments: 1, net: -1 },
        { month: 'Juin', entries: 45, exits: 42, adjustments: 0, net: 3 }
      ]
    },
    {
      productName: 'Clavier Mécanique',
      sku: 'KEY-MEC-001',
      movements: [
        { month: 'Jan', entries: 20, exits: 18, adjustments: 0, net: 2 },
        { month: 'Fév', entries: 15, exits: 12, adjustments: 0, net: 3 },
        { month: 'Mar', entries: 25, exits: 28, adjustments: -1, net: -4 },
        { month: 'Avr', entries: 18, exits: 15, adjustments: 0, net: 3 },
        { month: 'Mai', entries: 12, exits: 14, adjustments: 0, net: -2 },
        { month: 'Juin', entries: 22, exits: 20, adjustments: 0, net: 2 }
      ]
    }
  ];

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'entry':
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'exit':
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      case 'adjustment':
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getNetVariant = (net: number) => {
    if (net > 0) return 'default';
    if (net < 0) return 'destructive';
    return 'secondary';
  };

  // Agrégation des données pour le graphique global
  const globalMovements = stockMovements.reduce((acc, product) => {
    product.movements.forEach((movement) => {
      const existing = acc.find(item => item.month === movement.month);
      if (existing) {
        existing.totalEntries += movement.entries;
        existing.totalExits += movement.exits;
        existing.totalAdjustments += movement.adjustments;
        existing.totalNet += movement.net;
      } else {
        acc.push({
          month: movement.month,
          totalEntries: movement.entries,
          totalExits: movement.exits,
          totalAdjustments: movement.adjustments,
          totalNet: movement.net
        });
      }
    });
    return acc;
  }, [] as any[]);

  return (
    <div className="space-y-6">
      {/* Résumé global */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ArrowUp className="h-4 w-4 text-green-500" />
              Entrées totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {globalMovements.reduce((sum, data) => sum + data.totalEntries, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ArrowDown className="h-4 w-4 text-red-500" />
              Sorties totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {globalMovements.reduce((sum, data) => sum + data.totalExits, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-blue-500" />
              Ajustements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {globalMovements.reduce((sum, data) => sum + data.totalAdjustments, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Mouvement net</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {globalMovements.reduce((sum, data) => sum + data.totalNet, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique global des mouvements */}
      <Card>
        <CardHeader>
          <CardTitle>Mouvements de stock globaux par mois</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={globalMovements}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="totalEntries" fill="#10B981" name="Entrées" />
                <Bar dataKey="totalExits" fill="#EF4444" name="Sorties" />
                <Bar dataKey="totalAdjustments" fill="#3B82F6" name="Ajustements" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Détail par produit */}
      {stockMovements.map((product, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div>
                <div className="font-medium">{product.productName}</div>
                <div className="text-sm text-muted-foreground">SKU: {product.sku}</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mois</TableHead>
                    <TableHead className="text-right">Entrées</TableHead>
                    <TableHead className="text-right">Sorties</TableHead>
                    <TableHead className="text-right">Ajustements</TableHead>
                    <TableHead className="text-right">Net</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.movements.map((movement, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{movement.month}</TableCell>
                      <TableCell className="text-right text-green-600">
                        +{movement.entries}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        -{movement.exits}
                      </TableCell>
                      <TableCell className="text-right text-blue-600">
                        {movement.adjustments >= 0 ? '+' : ''}{movement.adjustments}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={getNetVariant(movement.net)}>
                          {movement.net >= 0 ? '+' : ''}{movement.net}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
