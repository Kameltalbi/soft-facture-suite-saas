import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DeliveryNoteModal } from '@/components/modals/DeliveryNoteModal';
import { DeliveryNoteActionsMenu } from '@/components/deliveryNotes/DeliveryNoteActionsMenu';
import { useDeliveryNotes } from '@/hooks/useDeliveryNotes';

interface DeliveryNote {
  id: string;
  organization_id: string;
  client_id: string;
  delivery_number: string;
  date: string;
  expected_delivery_date: string | null;
  delivery_address: string | null;
  status: 'pending' | 'sent' | 'delivered' | 'signed';
  notes: string | null;
  created_at: string;
  updated_at: string;
  clients: { name: string } | null;
  delivery_note_items?: any[];
}

interface DeliveryNoteModalProps {
  open: boolean;
  onClose: () => void;
  deliveryNote: DeliveryNote | null;
  onSave: (data: any) => void;
}

interface DeliveryNoteActionsMenuProps {
  deliveryNote: DeliveryNote;
  onEdit: () => void;
  onDelete: () => void;
}

const DeliveryNotes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDeliveryNote, setEditingDeliveryNote] = useState(null);
  const { deliveryNotes, loading, createDeliveryNote, updateDeliveryNote, deleteDeliveryNote } = useDeliveryNotes();

  const filteredDeliveryNotes = deliveryNotes.filter(note =>
    note.delivery_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.clients?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDeliveryNote = () => {
    setEditingDeliveryNote(null);
    setShowModal(true);
  };

  const handleEditDeliveryNote = (note) => {
    // Transform the delivery note to match the expected modal interface
    const transformedNote = {
      ...note,
      number: note.delivery_number,
      client: note.clients,
      expectedDeliveryDate: note.expected_delivery_date,
      deliveryAddress: note.delivery_address,
      items: note.delivery_note_items || []
    };
    setEditingDeliveryNote(transformedNote);
    setShowModal(true);
  };

  const handleSaveDeliveryNote = async (data) => {
    if (editingDeliveryNote) {
      await updateDeliveryNote(editingDeliveryNote.id, data);
    } else {
      await createDeliveryNote(data);
    }
    setShowModal(false);
  };

  const handleDeleteDeliveryNote = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce bon de livraison ?')) {
      await deleteDeliveryNote(id);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'En attente', variant: 'secondary', icon: Clock },
      sent: { label: 'Envoyé', variant: 'outline', icon: Package },
      delivered: { label: 'Livré', variant: 'default', icon: CheckCircle },
      signed: { label: 'Signé', variant: 'default', icon: CheckCircle }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent size={12} />
        {config.label}
      </Badge>
    );
  };

  const stats = {
    totalNotes: deliveryNotes.length,
    pendingNotes: deliveryNotes.filter(n => n.status === 'pending').length,
    deliveredNotes: deliveryNotes.filter(n => n.status === 'delivered').length,
    sentNotes: deliveryNotes.filter(n => n.status === 'sent').length
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement des bons de livraison...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-[#F7F9FA] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bons de livraison</h1>
          <p className="text-muted-foreground">
            Gérez vos bons de livraison et suivez les expéditions
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
            <Input
              placeholder="Rechercher un bon de livraison..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-neutral-200"
            />
          </div>

          <Button 
            onClick={handleAddDeliveryNote}
            className="bg-[#6A9C89] hover:bg-[#5a8473]"
          >
            <Plus size={16} className="mr-2" />
            Nouveau bon de livraison
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.totalNotes}</p>
              </div>
              <Package className="h-8 w-8 text-[#6A9C89]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">En attente</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingNotes}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Envoyés</p>
                <p className="text-2xl font-bold text-blue-600">{stats.sentNotes}</p>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Livrés</p>
                <p className="text-2xl font-bold text-green-600">{stats.deliveredNotes}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des bons de livraison */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date prévue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeliveryNotes.map((note) => (
                <TableRow key={note.id} className="hover:bg-neutral-50">
                  <TableCell>
                    <div className="font-medium text-neutral-900">{note.delivery_number}</div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{note.clients?.name || 'N/A'}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{new Date(note.date).toLocaleDateString('fr-FR')}</span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(note.status)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {note.expected_delivery_date
                        ? new Date(note.expected_delivery_date).toLocaleDateString('fr-FR')
                        : 'N/A'
                      }
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DeliveryNoteActionsMenu
                      deliveryNote={note}
                      onEdit={() => handleEditDeliveryNote(note)}
                      onDelete={() => handleDeleteDeliveryNote(note.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {filteredDeliveryNotes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                    {deliveryNotes.length === 0
                      ? 'Aucun bon de livraison trouvé. Créez votre premier bon de livraison !'
                      : 'Aucun bon de livraison ne correspond à votre recherche'
                    }
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal */}
      <DeliveryNoteModal
        open={showModal}
        onClose={() => setShowModal(false)}
        deliveryNote={editingDeliveryNote}
        onSave={handleSaveDeliveryNote}
      />
    </div>
  );
};

export default DeliveryNotes;
