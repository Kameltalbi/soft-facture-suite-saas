
export interface Quote {
  id: string;
  quote_number: string;
  client_id: string;
  date: string;
  valid_until: string | null;
  status: 'draft' | 'pending' | 'approved' | 'accepted' | 'rejected' | 'cancelled' | null;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  subject: string | null;
  notes: string | null;
  organization_id: string;
  created_at: string | null;
  updated_at: string | null;
  is_signed: boolean | null;
  use_vat: boolean | null;
  currency_id: string | null;
  custom_taxes_used: string[] | null;
  // Relations
  clients?: {
    name: string;
    company: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    postal_code: string | null;
    country: string | null;
  };
  quote_items?: QuoteItem[];
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  total_price: number;
  quote_id: string;
  organization_id: string;
  product_id: string | null;
  created_at: string | null;
}

// Legacy interface for backward compatibility
export interface QuoteLigne {
  id: string;
  designation: string;
  quantite: number;
  prixUnitaireHT: number;
  tva: number;
  totalHT: number;
}
