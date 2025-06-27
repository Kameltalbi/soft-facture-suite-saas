
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { useCurrency } from '@/contexts/CurrencyContext';

interface ProductRankingReportProps {
  period: {
    start?: Date;
    end?: Date;
  };
}

export function ProductRankingReport({ period }: ProductRankingReportProps) {
  const { currency } = useCurrency();
  
  // Données mockées - à remplacer par les vraies données
  const products = [
    { name: 'Développement Web', quantity: 25, totalTTC: 25000 },
    { name: 'Consultation Informatique', quantity: 45, totalTTC: 18000 },
    { name: 'Maintenance Système', quantity: 35, totalTTC: 12600 },
    { name: 'Formation', quantity: 18, totalTTC: 8500 },
    { name: 'Audit Sécurité', quantity: 8, totalTTC: 6400 }
  ].sort((a, b) => b.totalTTC - a.totalTTC);

  const maxRevenue = Math.max(...products.map(p => p.totalTTC));

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('fr-FR')} ${currency.symbol}`;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rang</TableHead>
              <TableHead>Produit</TableHead>
              <TableHead className="text-right">Quantité</TableHead>
              <TableHead className="text-right">CA TTC</TableHead>
              <TableHead className="w-[120px]">Performance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={index}>
                <TableCell className="font-bold text-lg">#{index + 1}</TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-right">{product.quantity}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(product.totalTTC)}</TableCell>
                <TableCell>
                  <Progress 
                    value={(product.totalTTC / maxRevenue) * 100} 
                    className="h-2"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="text-sm text-muted-foreground">
        Total CA : {formatCurrency(products.reduce((sum, prod) => sum + prod.totalTTC, 0))}
      </div>
    </div>
  );
}
