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
import { InvoicePDF } from '@/components/pdf/InvoicePDF';
import { usePDFGeneration } from '@/hooks/usePDFGeneration';

interface Document {
  id: string;
  type: 'invoice' | 'quote' | 'delivery' | 'credit';
  number: string;
  date: string;
  client: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

const mockDocuments: Document[] = [
  {
    id: '1',
    type: 'invoice',
    number: 'FAC-2024-001',
    date: '2024-01-15',
    client: 'Entreprise ABC',
    amount: 1250.00,
    status: 'paid'
  },
  {
    id: '2',
    type: 'quote',
    number: 'DEV-2024-001',
    date: '2024-01-12',
    client: 'Société XYZ',
    amount: 850.00,
    status: 'sent'
  },
  {
    id: '3',
    type: 'delivery',
    number: 'BL-2024-001',
    date: '2024-01-10',
    client: 'Client Premium',
    amount: 2100.00,
    status: 'sent'
  },
  {
    id: '4',
    type: 'credit',
    number: 'AV-2024-001',
    date: '2024-01-08',
    client: 'Entreprise ABC',
    amount: -150.00,
    status: 'sent'
  }
];

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

export function Sales() {
  const { generateInvoicePDF } = usePDFGeneration();
  const [searchTerm, setSearchTerm] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);

  const filteredDocuments = mockDocuments.filter(doc =>
    doc.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewDocument = (type: 'invoice' | 'quote' | 'delivery' | 'credit') => {
    setEditingDocument(null);
    setShowInvoiceModal(true);
  };

  const handleEditDocument = (document: Document) => {
    setEditingDocument(document);
    setShowInvoiceModal(true);
  };

  const getPDFData = (document: Document) => {
    const mockLineItems = [
      {
        id: '1',
        description: 'Service de consultation',
        quantity: 1,
        unitPrice: document.amount,
        vatRate: 20,
        discount: 0,
        total: document.amount
      }
    ];

    const mockSettings = {
      showVat: true,
      showDiscount: false,
      showAdvance: false,
      currency: 'EUR',
      amountInWords: true
    };

    return generateInvoicePDF(
      {
        number: document.number,
        date: document.date,
        clientId: '1',
        subject: `${documentTypes[document.type].label} pour ${document.client}`,
        notes: 'Merci pour votre confiance.'
      },
      mockLineItems,
      mockSettings
    );
  };

  return (
    <div className="p-6 space-y-6 bg-neutral-50 min-h-screen">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
          <Input
            placeholder="Rechercher par client ou numéro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-neutral-200"
          />
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Factures ce mois</p>
                <p className="text-2xl font-bold text-neutral-900">24</p>
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
                <p className="text-2xl font-bold text-neutral-900">8</p>
              </div>
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">CA en attente</p>
                <p className="text-2xl font-bold text-neutral-900">12 450 €</p>
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
                <p className="text-2xl font-bold text-neutral-900">3</p>
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
            Gérez vos factures, devis, bons de livraison et avoirs
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditDocument(document)}>
                          <Eye size={16} className="mr-2" />
                          Voir
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditDocument(document)}>
                          <Edit size={16} className="mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <PDFDownloadLink
                          document={<InvoicePDF {...getPDFData(document)} />}
                          fileName={`${document.number}.pdf`}
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

      {/* Invoice Modal */}
      <InvoiceModal
        open={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        document={editingDocument}
      />
    </div>
  );
}
