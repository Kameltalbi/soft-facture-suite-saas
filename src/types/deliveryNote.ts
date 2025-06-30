
export interface DeliveryNoteFromDB {
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

export interface DeliveryNoteModalData {
  id?: string;
  number: string;
  date: string;
  client: { name: string } | null;
  expectedDeliveryDate: string | null;
  deliveryAddress: string | null;
  status: 'pending' | 'sent' | 'delivered' | 'signed';
  notes: string | null;
  items: any[];
  amount?: number;
}
