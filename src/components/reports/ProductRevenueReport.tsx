
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCurrency } from '@/contexts/CurrencyContext';

interface ProductRevenueReportProps {
  period: {
    start?: Date;
    end?: Date;
  };
}

export function ProductRevenueReport({ period }: ProductRevenueReportProps) {
  const { currency } = useCurrency();
  
  // Données mockées - à remplacer par les vraies données
  const products = [
    {
      name: 'Consultation Informatique',
      quantity: 45,
      totalHT: 4500.00,
      totalTTC: 5400.00
    },
    {
      name: 'Développement Web',
      quantity: 12,
      totalHT: 12000.00,
      totalTTC: 14400.00
    },
    {
      name: 'Formation',
      quantity: 8,
      totalHT: 2400.00,
      totalTTC: 2880.00
    }
  ].sort((a, b) => b.totalTTC - a.totalTTC);

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} ${currency.symbol}`;
  };

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
            {products.map((product, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-right">{product.quantity}</TableCell>
                <TableCell className="text-right">{formatCurrency(product.totalHT)}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(product.totalTTC)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="text-sm text-muted-foreground">
        Total TTC : {formatCurrency(products.reduce((sum, prod) => sum + prod.totalTTC, 0))}
      </div>
    </div>
  );
}
