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
import { InvoicePDF } from '@/components/pdf/InvoicePDF';
import { InvoiceActionsMenu } from '@/components/invoices/InvoiceActionsMenu';
import { usePDFGeneration } from '@/hooks/usePDFGeneration';
import { useSettings } from '@/hooks/useSettings';
import { useInvoicesData } from '@/hooks/useInvoicesData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Document {
  id: string;
  type: 'invoice' | 'quote' | 'delivery' | 'credit';
  number: string;
  date: string;
  client: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'partially_paid' | 'validated' | 'signed';
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
  overdue: { label: 'En retard', variant: 'destructive' as const },
  partially_paid: { label: 'Payé P.', variant: 'outline' as const },
  validated: { label: 'Validée', variant: 'success' as const },
  signed: { label: 'Signée', variant: 'info' as const }
};

export function Sales() {
  const { generateInvoicePDF } = usePDFGeneration();
  const { globalSettings } = useSettings();
  const { invoices, isLoading } = useInvoicesData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [currentDocumentType, setCurrentDocumentType] = useState<'invoice' | 'quote' | 'delivery'>('invoice');
  
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

  // Convertir les données de la base en format Document
  const documents: Document[] = invoices.map(invoice => ({
    id: invoice.id,
    type: 'invoice' as const,
    number: invoice.invoice_number,
    date: invoice.date,
    client: invoice.clients?.name || 'Client inconnu',
    amount: invoice.total_amount,
    status: invoice.status as Document['status']
  }));

  const filteredDocuments = documents.filter(doc => {
    const docDate = new Date(doc.date);
    const matchesSearch = doc.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = docDate.getFullYear() === selectedYear;
    const matchesMonth = docDate.getMonth() + 1 === selectedMonth;
    
    return matchesSearch && matchesYear && matchesMonth;
  });

  const handleNewDocument = (type: 'invoice' | 'quote' | 'delivery' | 'credit') => {
    setEditingDocument(null);
    if (type !== 'credit') {
      setCurrentDocumentType(type);
    }
    setShowInvoiceModal(true);
  };

  const handleEditDocument = (document: Document) => {
    setEditingDocument(document);
    if (document.type !== 'credit') {
      setCurrentDocumentType(document.type);
    }
    setShowInvoiceModal(true);
  };

  const handleValidateDocument = async (document: Document) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ status: 'validated' })
        .eq('id', document.id);

      if (error) {
        throw error;
      }

      toast.success('Facture validée avec succès');
      // Optionally refresh the data or update the local state
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      toast.error('Erreur lors de la validation de la facture');
    }
  };

  const handleDuplicateDocument = (document: Document) => {
    const duplicatedDocument = {
      ...document,
      id: Date.now().toString(),
      number: `${document.type.toUpperCase()}-2024-${String(documents.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      status: 'draft' as const
    };
    console.log('Duplicating document:', duplicatedDocument);
  };

  const handleMarkAsSent = (document: Document) => {
    console.log('Marking as sent:', document.number);
  };

  const handleDeleteDocument = (document: Document) => {
    console.log('Deleting document:', document.number);
  };

  const handlePaymentRecorded = (paymentData: any) => {
    console.log('Recording payment:', paymentData);
  };

  const handleEmailSent = (emailData: any) => {
    console.log('Sending email:', emailData);
  };

  const getPDFData = (document: Document) => {
    // Récupérer les vraies données de la facture
    const invoice = invoices.find(inv => inv.id === document.id);
    if (!invoice) return null;

    const lineItems = invoice.invoice_items?.map(item => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      vatRate: item.tax_rate,
      discount: 0, // À récupérer depuis la base si nécessaire
      total: item.total_price
    })) || [];

    const settings = {
      showVat: invoice.use_vat ?? true,
      showDiscount: globalSettings?.show_discount ?? true,
      showAdvance: invoice.has_advance ?? false,
      currency: invoice.currencies?.code || 'EUR',
      amountInWords: true
    };

    return generateInvoicePDF(
      {
        number: document.number,
        date: document.date,
        clientId: invoice.client_id,
        subject: `Facture pour ${document.client}`,
        notes: invoice.notes || 'Merci pour votre confiance.'
      },
      lineItems,
      settings
    );
  };

  return (
    <div className="p-6 space-y-6 bg-neutral-50 min-h-screen">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Documents de vente</h1>
          <p className="text-neutral-600">Gérez tous vos documents commerciaux</p>
        </div>

        <div className="flex space-x-2">
          <Button 
            onClick={() => handleNewDocument('quote')}
            variant="outline"
            className="border-secondary text-secondary hover:bg-secondary hover:text-white"
          >
            <Plus size={16} className="mr-2" />
            Nouveau Devis
          </Button>
          <Button 
            onClick={() => handleNewDocument('invoice')}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus size={16} className="mr-2" />
            Nouvelle Facture
          </Button>
        </div>
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Factures ce mois</p>
                <p className="text-2xl font-bold text-neutral-900">{filteredDocuments.filter(d => d.type === 'invoice').length}</p>
              </div>
              <div className="w-3 h-3 bg-primary rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Devis en attente</p>
                <p className="text-2xl font-bold text-neutral-900">{filteredDocuments.filter(d => d.type === 'quote').length}</p>
              </div>
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">CA filtré</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {filteredDocuments.reduce((sum, doc) => sum + (doc.amount > 0 ? doc.amount : 0), 0).toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </p>
              </div>
              <div className="w-3 h-3 bg-success rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Avoirs émis</p>
                <p className="text-2xl font-bold text-neutral-900">{filteredDocuments.filter(d => d.type === 'credit').length}</p>
              </div>
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents Table */}
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
              {filteredDocuments.map((document) => (
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
                        paidAmount: invoices.find(inv => inv.id === document.id)?.amount_paid || 0,
                        status: document.status,
                        is_signed: invoices.find(inv => inv.id === document.id)?.is_signed || false
                      }}
                      pdfComponent={getPDFData(document) ? <InvoicePDF {...getPDFData(document)!} /> : null}
                      onValidate={() => handleValidateDocument(document)}
                      onEdit={() => handleEditDocument(document)}
                      onDuplicate={() => handleDuplicateDocument(document)}
                      onDelete={() => handleDeleteDocument(document)}
                      onPaymentRecorded={handlePaymentRecorded}
                      onEmailSent={handleEmailSent}
                      onSign={() => {}}
                      hasSignature={false}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invoice Modal */}
      <InvoiceModal
        open={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        invoice={editingDocument}
        onSave={(data) => {
          console.log('Saving document:', data);
          setShowInvoiceModal(false);
        }}
      />
    </div>
  );
}
