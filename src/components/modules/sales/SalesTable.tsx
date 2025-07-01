
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
import { InvoiceActionsMenu } from '@/components/invoices/InvoiceActionsMenu';

interface Document {
  id: string;
  type: 'invoice' | 'quote' | 'delivery' | 'credit';
  number: string;
  date: string;
  client: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

interface SalesTableProps {
  documents: Document[];
  selectedMonth: number;
  selectedYear: number;
  months: Array<{ value: number; label: string }>;
  onViewDocument: (document: Document) => void;
  onEditDocument: (document: Document) => void;
  onDuplicateDocument: (document: Document) => void;
  onMarkAsSent: (document: Document) => void;
  onMarkAsValidated: (document: Document) => void;
  onDeleteDocument: (document: Document) => void;
  onPaymentRecorded: (paymentData: any) => void;
  onEmailSent: (emailData: any) => void;
  getPDFData: (document: Document) => any;
}

const documentTypes = {
  invoice: { label: 'Facture', color: 'bg-primary' },
  quote: { label: 'Devis', color: 'bg-secondary' },
  delivery: { label: 'Bon de livraison', color: 'bg-success' },
  credit: { label: 'Avoir', color: 'bg-destructive' }
};

const statusLabels = {
  draft: { label: 'Brouillon', variant: 'secondary' as const },
  sent: { label: 'Envoyé', variant: 'default' as const },
  paid: { label: 'Payé', variant: 'default' as const },
  overdue: { label: 'En retard', variant: 'destructive' as const }
};

export function SalesTable({
  documents,
  selectedMonth,
  selectedYear,
  months,
  onViewDocument,
  onEditDocument,
  onDuplicateDocument,
  onMarkAsSent,
  onMarkAsValidated,
  onDeleteDocument,
  onPaymentRecorded,
  onEmailSent,
  getPDFData
}: SalesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents de vente</CardTitle>
        <CardDescription>
          Documents pour {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Numéro</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((document) => (
              <TableRow key={document.id} className="hover:bg-neutral-50">
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${documentTypes[document.type].color}`}></div>
                    <span className="font-medium">{documentTypes[document.type].label}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono">{document.number}</TableCell>
                <TableCell>{new Date(document.date).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>{document.client}</TableCell>
                <TableCell className={document.amount < 0 ? 'text-destructive' : 'text-neutral-900'}>
                  {document.amount.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </TableCell>
                <TableCell>
                  <Badge variant={statusLabels[document.status].variant}>
                    {statusLabels[document.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <InvoiceActionsMenu
                    invoice={{
                      id: document.id,
                      number: document.number,
                      client: document.client,
                      amount: document.amount,
                      status: document.status
                    }}
                    pdfComponent={getPDFData(document)}
                    onView={() => onViewDocument(document)}
                    onEdit={() => onEditDocument(document)}
                    onDuplicate={() => onDuplicateDocument(document)}
                    onMarkAsSent={() => onMarkAsSent(document)}
                    onMarkAsValidated={() => onMarkAsValidated(document)}
                    onDelete={() => onDeleteDocument(document)}
                    onPaymentRecorded={onPaymentRecorded}
                    onEmailSent={onEmailSent}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
