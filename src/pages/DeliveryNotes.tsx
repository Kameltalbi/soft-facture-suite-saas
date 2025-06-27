
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

interface DeliveryNote {
  id: string;
  number: string;
  date: string;
  client: string;
  amount: number;
  status: 'draft' | 'sent' | 'delivered' | 'signed';
  deliveryDate?: string;
}

const mockDeliveryNotes: DeliveryNote[] = [
  {
    id: '1',
    number: 'BL-2024-001',
    date: '2024-01-10',
    client: 'Client Premium',
    amount: 2100.00,
    status: 'delivered',
    deliveryDate: '2024-01-12'
  },
  {
    id: '2',
    number: 'BL-2024-002',
    date: '2024-01-15',
    client: 'Entreprise ABC',
    amount: 1250.00,
    status: 'signed',
    deliveryDate: '2024-01-16'
  },
  {
    id: '3',
    number: 'BL-2024-003',
    date: '2024-01-20',
    client: 'Société Tech',
    amount: 980.00,
    status: 'sent'
  }
];

const statusLabels = {
  draft: { label: 'Brouillon', variant: 'secondary' as const },
  sent: { label: 'Envoyé', variant: 'default' as const },
  delivered: { label: 'Livré', variant: 'default' as const },
  signed: { label: 'Signé', variant: 'default' as const }
};

export default function DeliveryNotes() {
  const { generateInvoicePDF } = usePDFGeneration();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<DeliveryNote | null>(null);

  const filteredDeliveryNotes = mockDeliveryNotes.filter(delivery =>
    delivery.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewDelivery = () => {
    setEditingDelivery(null);
    setShowDeliveryModal(true);
  };

  const handleEditDelivery = (delivery: DeliveryNote) => {
    setEditingDelivery(delivery);
    setShowDeliveryModal(true);
  };

  const getPDFData = (delivery: DeliveryNote) => {
    const mockLineItems = [
      {
        id: '1',
        description: 'Produits livrés',
        quantity: 1,
        unitPrice: delivery.amount,
        vatRate: 20,
        discount: 0,
        total: delivery.amount
      }
    ];

    const mockSettings = {
      showVat: true,
      showDiscount: false,
      showAdvance: false,
      currency: 'EUR',
      amountInWords: false
    };

    return generateInvoicePDF(
      {
        number: delivery.number,
        date: delivery.date,
        clientId: '1',
        subject: `Bon de livraison pour ${delivery.client}`,
        notes: delivery.deliveryDate ? `Livré le ${new Date(delivery.deliveryDate).toLocaleDateString('fr-FR')}` : 'En cours de livraison'
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
          <h1 className="text-2xl font-bold text-neutral-900">Bons de livraison</h1>
          <p className="text-neutral-600">Gérez vos bons de livraison</p>
        </div>
        <Button onClick={handleNewDelivery} className="bg-success hover:bg-success/90">
          <Plus size={16} className="mr-2" />
          Nouveau Bon de livraison
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
                <p className="text-sm text-neutral-600">Total bons</p>
                <p className="text-2xl font-bold text-neutral-900">{mockDeliveryNotes.length}</p>
              </div>
              <div className="w-3 h-3 bg-success rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Signés</p>
                <p className="text-2xl font-bold text-success">{mockDeliveryNotes.filter(d => d.status === 'signed').length}</p>
              </div>
              <div className="w-3 h-3 bg-success rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Livrés</p>
                <p className="text-2xl font-bold text-primary">{mockDeliveryNotes.filter(d => d.status === 'delivered').length}</p>
              </div>
              <div className="w-3 h-3 bg-primary rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">En cours</p>
                <p className="text-2xl font-bold text-secondary">{mockDeliveryNotes.filter(d => d.status === 'sent').length}</p>
              </div>
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des bons de livraison</CardTitle>
          <CardDescription>
            Consultez et gérez tous vos bons de livraison
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
                <TableHead>Date livraison</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeliveryNotes.map((delivery) => (
                <TableRow key={delivery.id} className="hover:bg-neutral-50">
                  <TableCell className="font-mono">{delivery.number}</TableCell>
                  <TableCell>{new Date(delivery.date).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>{delivery.client}</TableCell>
                  <TableCell>
                    {delivery.amount.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    })}
                  </TableCell>
                  <TableCell>
                    {delivery.deliveryDate ? 
                      new Date(delivery.deliveryDate).toLocaleDateString('fr-FR') : 
                      <span className="text-neutral-400">-</span>
                    }
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusLabels[delivery.status].variant}>
                      {statusLabels[delivery.status].label}
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
                        <DropdownMenuItem onClick={() => handleEditDelivery(delivery)}>
                          <Eye size={16} className="mr-2" />
                          Voir
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditDelivery(delivery)}>
                          <Edit size={16} className="mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText size={16} className="mr-2" />
                          Créer facture
                        </DropdownMenuItem>
                        <PDFDownloadLink
                          document={<InvoicePDF {...getPDFData(delivery)} />}
                          fileName={`${delivery.number}.pdf`}
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
        open={showDeliveryModal}
        onClose={() => setShowDeliveryModal(false)}
        document={editingDelivery}
      />
    </div>
  );
}
