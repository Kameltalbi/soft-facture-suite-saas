
import { useState } from 'react';
import { DeliveryNoteModal } from '@/components/modals/DeliveryNoteModal';
import { DeliveryNotesHeader } from '@/components/deliveryNotes/DeliveryNotesHeader';
import { DeliveryNotesStats } from '@/components/deliveryNotes/DeliveryNotesStats';
import { DeliveryNotesTable } from '@/components/deliveryNotes/DeliveryNotesTable';
import { useDeliveryNotes } from '@/hooks/useDeliveryNotes';
import { DeliveryNoteFromDB, DeliveryNoteModalData } from '@/types/deliveryNote';
import { transformDeliveryNoteForModal, filterDeliveryNotes, calculateDeliveryNotesStats } from '@/utils/deliveryNoteUtils';

const DeliveryNotes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDeliveryNote, setEditingDeliveryNote] = useState<DeliveryNoteModalData | null>(null);
  const { deliveryNotes, loading, createDeliveryNote, updateDeliveryNote, deleteDeliveryNote } = useDeliveryNotes();

  // Cast the delivery notes to our local interface to avoid type conflicts
  const typedDeliveryNotes = deliveryNotes as DeliveryNoteFromDB[];
  const filteredDeliveryNotes = filterDeliveryNotes(typedDeliveryNotes, searchTerm);
  const stats = calculateDeliveryNotesStats(typedDeliveryNotes);

  const handleAddDeliveryNote = () => {
    setEditingDeliveryNote(null);
    setShowModal(true);
  };

  const handleEditDeliveryNote = (note: DeliveryNoteFromDB) => {
    const transformedNote = transformDeliveryNoteForModal(note);
    setEditingDeliveryNote(transformedNote);
    setShowModal(true);
  };

  const handleSaveDeliveryNote = async (data: any) => {
    if (editingDeliveryNote?.id) {
      await updateDeliveryNote(editingDeliveryNote.id, data);
    } else {
      await createDeliveryNote(data);
    }
    setShowModal(false);
  };

  const handleDeleteDeliveryNote = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce bon de livraison ?')) {
      await deleteDeliveryNote(id);
    }
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
      <DeliveryNotesHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddDeliveryNote={handleAddDeliveryNote}
      />

      <DeliveryNotesStats
        totalNotes={stats.totalNotes}
        pendingNotes={stats.pendingNotes}
        sentNotes={stats.sentNotes}
        deliveredNotes={stats.deliveredNotes}
      />

      <DeliveryNotesTable
        deliveryNotes={filteredDeliveryNotes.length > 0 ? filteredDeliveryNotes : (typedDeliveryNotes.length === 0 ? [] : [])}
        onEdit={handleEditDeliveryNote}
        onDelete={handleDeleteDeliveryNote}
      />

      {filteredDeliveryNotes.length === 0 && typedDeliveryNotes.length === 0 && (
        <div className="text-center py-8 text-neutral-500">
          Aucun bon de livraison trouvé. Créez votre premier bon de livraison !
        </div>
      )}

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
