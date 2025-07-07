
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useClientRevenueReport } from '@/hooks/useReports';

interface ClientRevenueReportProps {
  period: {
    start?: Date;
    end?: Date;
  };
}

export function ClientRevenueReport({ period }: ClientRevenueReportProps) {
  const { currency } = useCurrency();
  const { data: clients = [], isLoading } = useClientRevenueReport(period);

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
              <TableHead>Client</TableHead>
              <TableHead className="text-right">Nb Factures</TableHead>
              <TableHead className="text-right">Montant Total</TableHead>
              <TableHead className="text-right">Payé</TableHead>
              <TableHead className="text-right">Dû</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Aucune donnée disponible pour cette période
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell className="text-right">{client.invoiceCount}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(client.totalAmount)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(client.paidAmount)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(client.dueAmount)}</TableCell>
                  <TableCell>
                    {client.dueAmount === 0 ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">À jour</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">En attente</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {clients.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Total facturé : {formatCurrency(clients.reduce((sum, client) => sum + client.totalAmount, 0))} •
          Total dû : {formatCurrency(clients.reduce((sum, client) => sum + client.dueAmount, 0))}
        </div>
      )}
    </div>
  );
}
