
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useCurrency } from '@/contexts/CurrencyContext';

interface ClientRevenueReportProps {
  period: {
    start?: Date;
    end?: Date;
  };
}

export function ClientRevenueReport({ period }: ClientRevenueReportProps) {
  const { currency } = useCurrency();
  
  // Données mockées - à remplacer par les vraies données
  const clients = [
    {
      name: 'Entreprise ABC',
      invoiceCount: 8,
      totalAmount: 28500,
      paidAmount: 25000,
      dueAmount: 3500
    },
    {
      name: 'Société XYZ',
      invoiceCount: 12,
      totalAmount: 22800,
      paidAmount: 22800,
      dueAmount: 0
    },
    {
      name: 'Client DEF',
      invoiceCount: 6,
      totalAmount: 15600,
      paidAmount: 12000,
      dueAmount: 3600
    },
    {
      name: 'Entreprise GHI',
      invoiceCount: 4,
      totalAmount: 9200,
      paidAmount: 9200,
      dueAmount: 0
    }
  ].sort((a, b) => b.totalAmount - a.totalAmount);

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('fr-FR')} ${currency.symbol}`;
  };

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
            {clients.map((client, index) => (
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
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="text-sm text-muted-foreground">
        Total facturé : {formatCurrency(clients.reduce((sum, client) => sum + client.totalAmount, 0))} •
        Total dû : {formatCurrency(clients.reduce((sum, client) => sum + client.dueAmount, 0))}
      </div>
    </div>
  );
}
