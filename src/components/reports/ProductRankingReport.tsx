
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useProductRankingReport } from '@/hooks/useReports';

interface ProductRankingReportProps {
  period: {
    start?: Date;
    end?: Date;
  };
}

export function ProductRankingReport({ period }: ProductRankingReportProps) {
  const { currency } = useCurrency();
  const { data: products = [], isLoading } = useProductRankingReport(period);

  const maxRevenue = products.length > 0 ? Math.max(...products.map(p => p.totalTTC)) : 0;

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString(undefined, { 
      minimumFractionDigits: currency.decimal_places, 
      maximumFractionDigits: currency.decimal_places 
    })} ${currency.symbol}`;
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement des données...</div>;
  }

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
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Aucune donnée disponible pour cette période
                </TableCell>
              </TableRow>
            ) : (
              products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell className="font-bold text-lg">#{index + 1}</TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-right">{product.quantity}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(product.totalTTC)}</TableCell>
                  <TableCell>
                    <Progress 
                      value={maxRevenue > 0 ? (product.totalTTC / maxRevenue) * 100 : 0} 
                      className="h-2"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {products.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Total CA : {formatCurrency(products.reduce((sum, prod) => sum + prod.totalTTC, 0))}
        </div>
      )}
    </div>
  );
}
