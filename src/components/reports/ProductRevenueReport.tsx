
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useProductRevenueReport } from '@/hooks/useReports';

interface ProductRevenueReportProps {
  period: {
    start?: Date;
    end?: Date;
  };
}

export function ProductRevenueReport({ period }: ProductRevenueReportProps) {
  const { currency } = useCurrency();
  const { data: products = [], isLoading } = useProductRevenueReport(period);

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('fr-FR', { 
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
              <TableHead>Produit/Service</TableHead>
              <TableHead className="text-right">Quantité</TableHead>
              <TableHead className="text-right">Total HT</TableHead>
              <TableHead className="text-right">Total TTC</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  Aucune donnée disponible pour cette période
                </TableCell>
              </TableRow>
            ) : (
              products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-right">{product.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(product.totalHT)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(product.totalTTC)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {products.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Total TTC : {formatCurrency(products.reduce((sum, prod) => sum + prod.totalTTC, 0))}
        </div>
      )}
    </div>
  );
}
