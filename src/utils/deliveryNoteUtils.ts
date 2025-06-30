
import { DeliveryNoteFromDB, DeliveryNoteModalData } from '@/types/deliveryNote';

export function transformDeliveryNoteForModal(note: DeliveryNoteFromDB): DeliveryNoteModalData {
  return {
    id: note.id,
    number: note.delivery_number,
    date: note.date,
    client: note.clients,
    expectedDeliveryDate: note.expected_delivery_date,
    deliveryAddress: note.delivery_address,
    status: note.status,
    notes: note.notes,
    items: note.delivery_note_items || [],
    amount: 0 // Default amount since it's not in the original data
  };
}

export function filterDeliveryNotes(notes: DeliveryNoteFromDB[], searchTerm: string): DeliveryNoteFromDB[] {
  return notes.filter(note =>
    note.delivery_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.clients?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

export function calculateDeliveryNotesStats(notes: DeliveryNoteFromDB[]) {
  return {
    totalNotes: notes.length,
    pendingNotes: notes.filter(n => n.status === 'pending').length,
    deliveredNotes: notes.filter(n => n.status === 'delivered').length,
    sentNotes: notes.filter(n => n.status === 'sent').length
  };
}
