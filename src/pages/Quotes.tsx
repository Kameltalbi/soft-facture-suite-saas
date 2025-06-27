
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { InvoiceModal } from '@/components/modals/InvoiceModal';
import { usePDFGeneration } from '@/hooks/usePDFGeneration';
import { TemplatedInvoicePDF } from '@/components/pdf/TemplatedInvoicePDF';
import { QuoteActionsMenu } from '@/components/quotes/QuoteActionsMenu';

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
  
  // Date filters
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  
  // Generate available years (5 years back to 2 years forward)
  const availableYears = Array.from({ length: 8 }, (_, i) => currentDate.getFullYear() - 5 + i);
  
  const months = [
    { value: 1, label: 'Janvier' },
    { value: 2, label: 'Février' },
    { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' },
    { value: 8, label: 'Août' },
    { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' },
    { value: 11, label: 'Novembre' },
    { value: 12, label: 'Décembre' },
  ];

  const filteredQuotes = mockQuotes.filter(quote => {
    const quoteDate = new Date(quote.date);
    const matchesSearch = quote.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = quoteDate.getFullYear() === selectedYear;
    const matchesMonth = quoteDate.getMonth() + 1 === selectedMonth;
    
    return matchesSearch && matchesYear && matchesMonth;
  });

  const handleNewQuote = () => {
    setEditingQuote(null);
    setShowQuoteModal(true);
  };

  const handleViewQuote = (quote: Quote) => {
    console.log('Viewing quote:', quote.number);
  };

  const handleEditQuote = (quote: Quote) => {
    setEditingQuote(quote);
    setShowQuoteModal(true);
  };

  const handleDuplicateQuote = (quote: Quote) => {
    const duplicatedQuote = {
      ...quote,
      id: Date.now().toString(),
      number: `DEV-2024-${String(mockQuotes.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      status: 'draft' as const
    };
    console.log('Duplicating quote:', duplicatedQuote);
  };

  const handleConvertToInvoice = (quote: Quote) => {
    console.log('Converting quote to invoice:', quote.number);
    // Logic to convert quote to invoice
  };

  const handleStatusChange = (quote: Quote, newStatus: Quote['status']) => {
    console.log('Changing status of quote:', quote.number, 'to:', newStatus);
    // Logic to update quote status
  };

  const handleDeleteQuote = (quote: Quote) => {
    console.log('Deleting quote:', quote.number);
    // Logic to delete quote
  };

  const handleEmailSent = (emailData: any) => {
    console.log('Sending email:', emailData);
    // Logic to send email
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

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
              <Input
                placeholder="Rechercher par client ou numéro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-neutral-200"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Année :</label>
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Mois :</label>
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(parseInt(value))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total devis</p>
                <p className="text-2xl font-bold text-neutral-900">{filteredQuotes.length}</p>
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
                <p className="text-2xl font-bold text-success">{filteredQuotes.filter(q => q.status === 'accepted').length}</p>
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
                <p className="text-2xl font-bold text-primary">{filteredQuotes.filter(q => q.status === 'sent').length}</p>
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
                <p className="text-2xl font-bold text-destructive">{filteredQuotes.filter(q => q.status === 'rejected').length}</p>
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
            Consultez et gérez tous vos devis pour {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
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
                    <QuoteActionsMenu
                      quote={quote}
                      pdfComponent={<TemplatedInvoicePDF {...getPDFData(quote)} template="modern" documentType="DEVIS" />}
                      onView={() => handleViewQuote(quote)}
                      onEdit={() => handleEditQuote(quote)}
                      onDuplicate={() => handleDuplicateQuote(quote)}
                      onConvertToInvoice={() => handleConvertToInvoice(quote)}
                      onStatusChange={(status) => handleStatusChange(quote, status)}
                      onDelete={() => handleDeleteQuote(quote)}
                      onEmailSent={handleEmailSent}
                    />
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
