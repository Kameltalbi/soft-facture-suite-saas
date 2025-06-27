import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Eye, Edit, Download, MoreHorizontal, FileText } from 'lucide-react';
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
import { InvoicePDF } from '@/components/pdf/InvoicePDF';
import { usePDFGeneration } from '@/hooks/usePDFGeneration';
import { TemplatedInvoicePDF } from '@/components/pdf/TemplatedInvoicePDF';

interface Quote {
  id: string;
  number: string;
  date: string;
  client: string;
  amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil: string;
}

const mockQuotes: Quote[] = [
  {
    id: '1',
    number: 'DEV-2024-001',
    date: '2024-01-12',
    client: 'Société XYZ',
    amount: 850.00,
    status: 'sent',
    validUntil: '2024-02-12'
  },
  {
    id: '2',
    number: 'DEV-2024-002',
    date: '2024-01-18',
    client: 'Entreprise Tech',
    amount: 1500.00,
    status: 'accepted',
    validUntil: '2024-02-18'
  },
  {
    id: '3',
    number: 'DEV-2024-003',
    date: '2024-01-22',
    client: 'Start-up Alpha',
    amount: 750.00,
    status: 'draft',
    validUntil: '2024-02-22'
  }
];

const statusLabels = {
  draft: { label: 'Brouillon', variant: 'secondary' as const },
  sent: { label: 'Envoyé', variant: 'default' as const },
  accepted: { label: 'Accepté', variant: 'default' as const },
  rejected: { label: 'Refusé', variant: 'destructive' as const },
  expired: { label: 'Expiré', variant: 'secondary' as const }
};

export default function Quotes() {
  const { generateInvoicePDF } = usePDFGeneration();
  const [searchTerm, setSearchTerm] = useState('');
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);

  const filteredQuotes = mockQuotes.filter(quote =>
    quote.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewQuote = () => {
    setEditingQuote(null);
    setShowQuoteModal(true);
  };

  const handleEditQuote = (quote: Quote) => {
    setEditingQuote(quote);
    setShowQuoteModal(true);
  };

  const getPDFData = (quote: Quote) => {
    const mockLineItems = [
      {
        id: '1',
        description: 'Service de consultation',
        quantity: 1,
        unitPrice: quote.amount,
        vatRate: 20,
        discount: 0,
        total: quote.amount
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
        number: quote.number,
        date: quote.date,
        clientId: '1',
        subject: `Devis pour ${quote.client}`,
        notes: 'Devis valable jusqu\'au ' + new Date(quote.validUntil).toLocaleDateString('fr-FR')
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
          <h1 className="text-2xl font-bold text-neutral-900">Devis</h1>
          <p className="text-neutral-600">Gérez vos devis clients</p>
        </div>
        <Button onClick={handleNewQuote} className="bg-secondary hover:bg-secondary/90">
          <Plus size={16} className="mr-2" />
          Nouveau Devis
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
                <p className="text-sm text-neutral-600">Total devis</p>
                <p className="text-2xl font-bold text-neutral-900">{mockQuotes.length}</p>
              </div>
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Acceptés</p>
                <p className="text-2xl font-bold text-success">{mockQuotes.filter(q => q.status === 'accepted').length}</p>
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
                <p className="text-2xl font-bold text-primary">{mockQuotes.filter(q => q.status === 'sent').length}</p>
              </div>
              <div className="w-3 h-3 bg-primary rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Refusés</p>
                <p className="text-2xl font-bold text-destructive">{mockQuotes.filter(q => q.status === 'rejected').length}</p>
              </div>
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des devis</CardTitle>
          <CardDescription>
            Consultez et gérez tous vos devis
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
                <TableHead>Validité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotes.map((quote) => (
                <TableRow key={quote.id} className="hover:bg-neutral-50">
                  <TableCell className="font-mono">{quote.number}</TableCell>
                  <TableCell>{new Date(quote.date).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>{quote.client}</TableCell>
                  <TableCell>
                    {quote.amount.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    })}
                  </TableCell>
                  <TableCell>{new Date(quote.validUntil).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>
                    <Badge variant={statusLabels[quote.status].variant}>
                      {statusLabels[quote.status].label}
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
                        <DropdownMenuItem onClick={() => handleEditQuote(quote)}>
                          <Eye size={16} className="mr-2" />
                          Voir
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditQuote(quote)}>
                          <Edit size={16} className="mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText size={16} className="mr-2" />
                          Convertir en facture
                        </DropdownMenuItem>
                        <PDFDownloadLink
                          document={<TemplatedInvoicePDF {...getPDFData(quote)} template="modern" documentType="DEVIS" />}
                          fileName={`${quote.number}.pdf`}
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
        open={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        document={editingQuote}
      />
    </div>
  );
}
