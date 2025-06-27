
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
import { DeliveryNoteActionsMenu } from '@/components/deliveryNotes/DeliveryNoteActionsMenu';

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
  },
  {
    id: '4',
    number: 'BL-2024-004',
    date: '2024-02-05',
    client: 'Commerce Digital',
    amount: 1800.75,
    status: 'delivered',
    deliveryDate: '2024-02-07'
  },
  {
    id: '5',
    number: 'BL-2024-005',
    date: '2024-02-10',
    client: 'Startup Innovation',
    amount: 750.00,
    status: 'draft'
  },
  {
    id: '6',
    number: 'BL-2024-006',
    date: '2024-02-15',
    client: 'Groupe Industriel SA',
    amount: 4500.00,
    status: 'sent'
  },
  {
    id: '7',
    number: 'BL-2024-007',
    date: '2024-02-20',
    client: 'Restaurant Le Gourmet',
    amount: 980.00,
    status: 'signed',
    deliveryDate: '2024-02-22'
  },
  {
    id: '8',
    number: 'BL-2024-008',
    date: '2024-02-25',
    client: 'Cabinet Avocat & Associés',
    amount: 5200.00,
    status: 'delivered',
    deliveryDate: '2024-02-27'
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

  const filteredDeliveryNotes = mockDeliveryNotes.filter(delivery => {
    const deliveryDate = new Date(delivery.date);
    const matchesSearch = delivery.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = deliveryDate.getFullYear() === selectedYear;
    const matchesMonth = deliveryDate.getMonth() + 1 === selectedMonth;
    
    return matchesSearch && matchesYear && matchesMonth;
  });

  const handleNewDelivery = () => {
    setEditingDelivery(null);
    setShowDeliveryModal(true);
  };

  const handleViewDelivery = (delivery: DeliveryNote) => {
    console.log('Viewing delivery note:', delivery.number);
  };

  const handleEditDelivery = (delivery: DeliveryNote) => {
    setEditingDelivery(delivery);
    setShowDeliveryModal(true);
  };

  const handleDuplicateDelivery = (delivery: DeliveryNote) => {
    console.log('Duplicating delivery note:', delivery.number);
  };

  const handleMarkAsDelivered = (delivery: DeliveryNote) => {
    console.log('Marking as delivered:', delivery.number);
  };

  const handleConvertToInvoice = (delivery: DeliveryNote) => {
    console.log('Converting to invoice:', delivery.number);
  };

  const handleDeleteDelivery = (delivery: DeliveryNote) => {
    console.log('Deleting delivery note:', delivery.number);
  };

  const handleEmailSent = (emailData: any) => {
    console.log('Sending email:', emailData);
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
      amountInWords: false,
      footer_content: 'Soft Facture SARL - Merci pour votre confiance'
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
                <p className="text-sm text-neutral-600">Total bons</p>
                <p className="text-2xl font-bold text-neutral-900">{filteredDeliveryNotes.length}</p>
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
                <p className="text-2xl font-bold text-success">{filteredDeliveryNotes.filter(d => d.status === 'signed').length}</p>
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
                <p className="text-2xl font-bold text-primary">{filteredDeliveryNotes.filter(d => d.status === 'delivered').length}</p>
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
                <p className="text-2xl font-bold text-secondary">{filteredDeliveryNotes.filter(d => d.status === 'sent').length}</p>
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
            Consultez et gérez tous vos bons de livraison pour {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
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
                    <DeliveryNoteActionsMenu
                      deliveryNote={delivery}
                      pdfComponent={<TemplatedInvoicePDF {...getPDFData(delivery)} template="minimal" documentType="BON DE LIVRAISON" />}
                      onView={() => handleViewDelivery(delivery)}
                      onEdit={() => handleEditDelivery(delivery)}
                      onDuplicate={() => handleDuplicateDelivery(delivery)}
                      onMarkAsDelivered={() => handleMarkAsDelivered(delivery)}
                      onConvertToInvoice={() => handleConvertToInvoice(delivery)}
                      onDelete={() => handleDeleteDelivery(delivery)}
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
        open={showDeliveryModal}
        onClose={() => setShowDeliveryModal(false)}
        document={editingDelivery}
      />
    </div>
  );
}
