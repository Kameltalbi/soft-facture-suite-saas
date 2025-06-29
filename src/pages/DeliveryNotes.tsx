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
import { DeliveryNoteModal } from '@/components/modals/DeliveryNoteModal';
import { DeliveryNotePDF } from '@/components/pdf/deliveryNotes/DeliveryNotePDF';
import { DeliveryNoteActionsMenu } from '@/components/deliveryNotes/DeliveryNoteActionsMenu';
import { useDeliveryNotes } from '@/hooks/useDeliveryNotes';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/contexts/CurrencyContext';
import { toast } from 'sonner';

const statusLabels = {
  pending: { label: 'En attente', variant: 'secondary' as const },
  sent: { label: 'Envoyé', variant: 'default' as const },
  delivered: { label: 'Livré', variant: 'default' as const },
  signed: { label: 'Signé', variant: 'default' as const }
};

export default function DeliveryNotes() {
  const { organization } = useAuth();
  const { currency } = useCurrency();
  const { deliveryNotes, loading, createDeliveryNote, updateDeliveryNote, deleteDeliveryNote } = useDeliveryNotes();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<any>(null);
  
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

  // Fetch global settings for PDF generation
  const { data: globalSettings } = useQuery({
    queryKey: ['globalSettings', organization?.id],
    queryFn: async () => {
      if (!organization?.id) return null;
      
      const { data, error } = await supabase
        .from('global_settings')
        .select('*')
        .eq('organization_id', organization.id)
        .maybeSingle();

      if (error) {
        console.error('Erreur lors de la récupération des paramètres globaux:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!organization?.id
  });

  const filteredDeliveryNotes = deliveryNotes.filter(delivery => {
    const deliveryDate = new Date(delivery.date);
    const clientName = delivery.clients?.company || delivery.clients?.name || '';
    const matchesSearch = clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.delivery_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = deliveryDate.getFullYear() === selectedYear;
    const matchesMonth = deliveryDate.getMonth() + 1 === selectedMonth;
    
    return matchesSearch && matchesYear && matchesMonth;
  });

  const handleNewDelivery = () => {
    setEditingDelivery(null);
    setShowDeliveryModal(true);
  };

  const handleViewDelivery = (delivery: any) => {
    console.log('Viewing delivery note:', delivery.delivery_number);
  };

  const handleEditDelivery = (delivery: any) => {
    setEditingDelivery(delivery);
    setShowDeliveryModal(true);
  };

  const handleDuplicateDelivery = (delivery: any) => {
    console.log('Duplicating delivery note:', delivery.delivery_number);
  };

  const handleMarkAsDelivered = async (delivery: any) => {
    const result = await updateDeliveryNote(delivery.id, { status: 'delivered' });
    if (result.error) {
      toast.error('Erreur lors de la mise à jour du statut');
    } else {
      toast.success('Bon de livraison marqué comme livré');
    }
  };

  const handleConvertToInvoice = (delivery: any) => {
    console.log('Converting to invoice:', delivery.delivery_number);
  };

  const handleDeleteDelivery = async (delivery: any) => {
    const result = await deleteDeliveryNote(delivery.id);
    if (result.error) {
      toast.error('Erreur lors de la suppression');
    } else {
      toast.success('Bon de livraison supprimé');
    }
  };

  const handleEmailSent = (emailData: any) => {
    console.log('Sending email:', emailData);
  };

  const handleSaveDelivery = async (data: any) => {
    if (editingDelivery) {
      const result = await updateDeliveryNote(editingDelivery.id, data);
      if (result.error) {
        toast.error('Erreur lors de la mise à jour');
      } else {
        toast.success('Bon de livraison mis à jour');
        setShowDeliveryModal(false);
      }
    } else {
      const result = await createDeliveryNote(data);
      if (result.error) {
        toast.error('Erreur lors de la création');
      } else {
        toast.success('Bon de livraison créé');
        setShowDeliveryModal(false);
      }
    }
  };

  const getPDFData = (delivery: any) => {
    const mockLineItems = delivery.delivery_note_items?.map((item: any) => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      deliveredQuantity: item.delivered_quantity
    })) || [];

    const company = {
      name: organization?.name || 'Mon Entreprise',
      address: organization?.address || 'Adresse de l\'entreprise',
      email: organization?.email || 'contact@monentreprise.fr',
      phone: organization?.phone || 'Téléphone',
      logo_url: organization?.logo_url || null // Assurer que le logo_url est bien passé
    };

    const client = {
      name: delivery.clients?.name || 'Client',
      company: delivery.clients?.company || delivery.clients?.name || 'Client',
      address: delivery.clients?.address || 'Adresse du client',
      email: delivery.clients?.email || 'client@email.com'
    };

    console.log('Organization logo URL:', organization?.logo_url); // Debug log

    return {
      deliveryData: {
        number: delivery.delivery_number,
        date: delivery.date,
        subject: `Bon de livraison pour ${client.company}`,
        notes: delivery.notes || (delivery.expected_delivery_date ? `Livraison prévue le ${new Date(delivery.expected_delivery_date).toLocaleDateString('fr-FR')}` : 'En cours de livraison')
      },
      lineItems: mockLineItems,
      client,
      company,
      settings: {
        showVat: true,
        footer_content: globalSettings?.footer_content || '',
        footer_display: globalSettings?.footer_display || 'all'
      },
      currency: currency
    };
  };

  // Transform delivery note data for the actions menu component
  const transformDeliveryForActionsMenu = (delivery: any) => ({
    id: delivery.id,
    number: delivery.delivery_number,
    date: delivery.date,
    client: delivery.clients?.company || delivery.clients?.name || 'Client',
    amount: 0, // Delivery notes don't have amounts, so we set to 0
    status: delivery.status as 'draft' | 'sent' | 'delivered' | 'signed',
    deliveryDate: delivery.expected_delivery_date
  });

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-neutral-50 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Chargement des bons de livraison...</div>
        </div>
      </div>
    );
  }

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
                <p className="text-2xl font-bold text-secondary">{filteredDeliveryNotes.filter(d => d.status === 'sent' || d.status === 'pending').length}</p>
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
                <TableHead>Date livraison prévue</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeliveryNotes.map((delivery) => (
                <TableRow key={delivery.id} className="hover:bg-neutral-50">
                  <TableCell className="font-mono">{delivery.delivery_number}</TableCell>
                  <TableCell>{new Date(delivery.date).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>{delivery.clients?.company || delivery.clients?.name || 'Client'}</TableCell>
                  <TableCell>
                    {delivery.expected_delivery_date ? 
                      new Date(delivery.expected_delivery_date).toLocaleDateString('fr-FR') : 
                      <span className="text-neutral-400">-</span>
                    }
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusLabels[delivery.status as keyof typeof statusLabels]?.variant || 'secondary'}>
                      {statusLabels[delivery.status as keyof typeof statusLabels]?.label || delivery.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DeliveryNoteActionsMenu
                      deliveryNote={transformDeliveryForActionsMenu(delivery)}
                      pdfComponent={<DeliveryNotePDF {...getPDFData(delivery)} />}
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
      <DeliveryNoteModal
        open={showDeliveryModal}
        onClose={() => setShowDeliveryModal(false)}
        deliveryNote={editingDelivery}
        onSave={handleSaveDelivery}
      />
    </div>
  );
}
