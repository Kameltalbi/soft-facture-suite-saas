
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrency } from '@/contexts/CurrencyContext';

interface InvoiceReportProps {
  period: {
    start?: Date;
    end?: Date;
  };
}

export function InvoiceReport({ period }: InvoiceReportProps) {
  const { currency } = useCurrency();
  
  // Données mockées - à remplacer par les vraies données
  const invoices = [
    {
      number: 'FAC-2024-001',
      date: '15/01/2024',
      client: 'Entreprise ABC',
      totalAmount: 1250.00,
      paidAmount: 1250.00,
      remainingAmount: 0,
      status: 'paid'
    },
    {
      number: 'FAC-2024-002',
      date: '18/01/2024',
      client: 'Société XYZ',
      totalAmount: 890.50,
      paidAmount: 400.00,
      remainingAmount: 490.50,
      status: 'partial'
    },
    {
      number: 'FAC-2024-003',
      date: '22/01/2024',
      client: 'Client DEF',
      totalAmount: 2150.00,
      paidAmount: 0,
      remainingAmount: 2150.00,
      status: 'unpaid'
    }
  ];

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('fr-FR', { 
      minimumFractionDigits: currency.decimal_places, 
      maximumFractionDigits: currency.decimal_places 
    })} ${currency.symbol}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Payée</Badge>;
      case 'partial':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Partielle</Badge>;
      case 'unpaid':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Non payée</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Facture</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Montant TTC</TableHead>
              <TableHead>Payé</TableHead>
              <TableHead>Restant</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.number}>
                <TableCell className="font-medium">{invoice.number}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.client}</TableCell>
                <TableCell>{formatCurrency(invoice.totalAmount)}</TableCell>
                <TableCell>{formatCurrency(invoice.paidAmount)}</TableCell>
                <TableCell>{formatCurrency(invoice.remainingAmount)}</TableCell>
                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="text-sm text-muted-foreground">
        Total des factures : {invoices.length} • 
        Total TTC : {formatCurrency(invoices.reduce((sum, inv) => sum + inv.totalAmount, 0))}
      </div>
    </div>
  );
}
