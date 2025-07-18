import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SimplePDFGenerator } from '@/components/pdf/SimplePDFGenerator';
import { InvoiceActionsMenu } from './InvoiceActionsMenu';
import { statusLabels, InvoiceStatus, months } from '@/types/invoice';

interface InvoicesTableProps {
  invoices: any[];
  customTaxes: any[];
  organization: any;
  globalSettings: any;
  currency: any;
  selectedYear: number;
  selectedMonth: number;
  onEditInvoice: (invoice: any) => void;
  onDuplicateInvoice: (invoice: any) => void;
  onDeleteInvoice: (invoice: any) => void;
  onValidateInvoice: (invoice: any) => void;
  onSignInvoice: (invoice: any) => void;
  onPaymentRecorded: (paymentData: any) => void;
  onEmailSent: (emailData: any) => void;
  onPreviewInvoice: (invoice: any, settings: any) => void;
}

export function InvoicesTable({
  invoices,
  customTaxes,
  organization,
  globalSettings,
  currency,
  selectedYear,
  selectedMonth,
  onEditInvoice,
  onDuplicateInvoice,
  onDeleteInvoice,
  onValidateInvoice,
  onSignInvoice,
  onPaymentRecorded,
  onEmailSent,
  onPreviewInvoice
}: InvoicesTableProps) {
  const formatCurrency = (amount: number, invoiceCurrency = null) => {
    const currencyToUse = invoiceCurrency || currency;
    return `${amount.toLocaleString('fr-FR', { 
      minimumFractionDigits: currencyToUse.decimal_places, 
      maximumFractionDigits: currencyToUse.decimal_places 
    })} ${currencyToUse.symbol}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des factures</CardTitle>
        <CardDescription>
          Consultez et gérez toutes vos factures pour {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numéro</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id} className="hover:bg-neutral-50">
                <TableCell className="font-mono">{invoice.invoice_number}</TableCell>
                <TableCell>{new Date(invoice.date).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>
                  <div>
                    <span className="font-medium">{invoice.clients?.name}</span>
                    {invoice.clients?.company && (
                      <div className="text-sm text-neutral-500">{invoice.clients.company}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {formatCurrency(invoice.total_amount, invoice.currencies)}
                </TableCell>
                <TableCell>
                  <Badge variant={
                    invoice.is_signed 
                      ? 'info' 
                      : statusLabels[invoice.status as InvoiceStatus]?.variant || 'secondary'
                  }>
                    {invoice.is_signed 
                      ? 'Signée' 
                      : statusLabels[invoice.status as InvoiceStatus]?.label || invoice.status
                    }
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <InvoiceActionsMenu
                    invoice={{
                      id: invoice.id,
                      number: invoice.invoice_number,
                      client: invoice.clients?.name || '',
                      amount: invoice.total_amount,
                      paidAmount: invoice.amount_paid || 0,
                      status: invoice.status as InvoiceStatus,
                      is_signed: invoice.is_signed
                    }}
                    pdfComponent={
                      <SimplePDFGenerator 
                        invoice={invoice} 
                        organization={organization}
                        customTaxes={customTaxes}
                        globalSettings={{
                          ...globalSettings,
                          // Utiliser les paramètres spécifiques de la facture s'ils existent
                          show_discount: invoice.invoiceSettings?.useDiscount ?? globalSettings?.show_discount,
                          use_vat: invoice.use_vat ?? globalSettings?.use_vat
                        }}
                        currency={currency}
                      />
                    }
                    onValidate={() => onValidateInvoice(invoice)}
                    onEdit={() => onEditInvoice(invoice)}
                    onDuplicate={() => onDuplicateInvoice(invoice)}
                    onDelete={() => onDeleteInvoice(invoice)}
                    onPaymentRecorded={onPaymentRecorded}
                    onEmailSent={onEmailSent}
                    onSign={() => onSignInvoice(invoice)}
                    hasSignature={!!organization?.signature_url}
                  />
                </TableCell>
              </TableRow>
            ))}
            {invoices.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                  Aucune facture ne correspond à votre recherche
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}