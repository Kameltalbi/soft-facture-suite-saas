import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Eye, Edit, Download, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { InvoiceModal } from '@/components/modals/InvoiceModal';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { usePDFGeneration } from '@/hooks/usePDFGeneration';
import { TemplatedInvoicePDF } from '@/components/pdf/TemplatedInvoicePDF';

interface Invoice {
  id: string;
  number: string;
  date: string;
  client: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'FAC-2024-001',
    date: '2024-01-15',
    client: 'Entreprise ABC',
    amount: 1250.00,
    status: 'paid'
  },
  {
    id: '2',
    number: 'FAC-2024-002',
    date: '2024-01-20',
    client: 'Société XYZ',
    amount: 850.00,
    status: 'sent'
  },
  {
    id: '3',
    number: 'FAC-2024-003',
    date: '2024-01-25',
    client: 'Client Premium',
    amount: 2100.00,
    status: 'overdue'
  }
];

const statusLabels = {
  draft: { label: 'Brouillon', variant: 'secondary' as const },
  sent: { label: 'Envoyé', variant: 'default' as const },
  paid: { label: 'Payé', variant: 'default' as const },
  overdue: { label: 'En retard', variant: 'destructive' as const }
};

export default function Invoices() {
  const { generateInvoicePDF } = usePDFGeneration();
  const [searchTerm, setSearchTerm] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = mockInvoices.filter(invoice =>
    invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewInvoice = () => {
    setEditingInvoice(null);
    setShowInvoiceModal(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const getPDFData = (invoice: Invoice) => {
    const mockLineItems = [
      {
        id: '1',
        description: 'Service de consultation',
        quantity: 1,
        unitPrice: invoice.amount,
        vatRate: 20,
        discount: 0,
        total: invoice.amount
      }
    ];

    const mockSettings = {
      showVat: true,
      showDiscount: false,
      showAdvance: false,
      currency: 'EUR',
      amountInWords: true,
      footer_content: 'Soft Facture SARL - Merci pour votre confiance'
    };

    return generateInvoicePDF(
      {
        number: invoice.number,
        date: invoice.date,
        clientId: '1',
        subject: `Facture pour ${invoice.client}`,
        notes: 'Merci pour votre confiance.'
      },
      mockLineItems,
      mockSettings
    );
  };

  return (
    <div className="p-6 space-y-6 bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Factures</h1>
          <p className="text-neutral-600">Gérez vos factures clients</p>
        </div>
        <Button onClick={handleNewInvoice} className="bg-primary hover:bg-primary/90">
          <Plus size={16} className="mr-2" />
          Nouvelle Facture
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
        <Input
          placeholder="Rechercher par client ou numéro..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white border-neutral-200"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total factures</p>
                <p className="text-2xl font-bold text-neutral-900">{mockInvoices.length}</p>
              </div>
              <div className="w-3 h-3 bg-primary rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Payées</p>
                <p className="text-2xl font-bold text-success">{mockInvoices.filter(i => i.status === 'paid').length}</p>
              </div>
              <div className="w-3 h-3 bg-success rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">En attente</p>
                <p className="text-2xl font-bold text-secondary">{mockInvoices.filter(i => i.status === 'sent').length}</p>
              </div>
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">En retard</p>
                <p className="text-2xl font-bold text-destructive">{mockInvoices.filter(i => i.status === 'overdue').length}</p>
              </div>
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des factures</CardTitle>
          <CardDescription>
            Consultez et gérez toutes vos factures
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
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-neutral-50">
                  <TableCell className="font-mono">{invoice.number}</TableCell>
                  <TableCell>{new Date(invoice.date).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>{invoice.client}</TableCell>
                  <TableCell>
                    {invoice.amount.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusLabels[invoice.status].variant}>
                      {statusLabels[invoice.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditInvoice(invoice)}>
                          <Eye size={16} className="mr-2" />
                          Voir
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditInvoice(invoice)}>
                          <Edit size={16} className="mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <PDFDownloadLink
                          document={<TemplatedInvoicePDF {...getPDFData(invoice)} template="classic" documentType="FACTURE" />}
                          fileName={`${invoice.number}.pdf`}
                        >
                          {({ loading }) => (
                            <DropdownMenuItem disabled={loading}>
                              <Download size={16} className="mr-2" />
                              {loading ? 'Génération...' : 'Télécharger PDF'}
                            </DropdownMenuItem>
                          )}
                        </PDFDownloadLink>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal */}
      <InvoiceModal
        open={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        document={editingInvoice}
      />
    </div>
  );
}
