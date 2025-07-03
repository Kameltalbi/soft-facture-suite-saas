
export interface Organization {
  id: string;
  name: string;
  logo?: string;
  address: string;
  email: string;
  phone: string;
  website?: string;
  rib?: string;
  iban?: string;
  swift?: string;
  bank?: string;
  siret?: string;
  fiscal_id?: string;
  vat_code?: string;
  tenant_id: string;
}

export interface Currency {
  id: string;
  code: string;
  symbol: string;
  name: string;
  is_primary: boolean;
  decimal_places: number;
  tenant_id: string;
}

export interface DocumentNumbering {
  id: string;
  document_type: 'invoice' | 'quote' | 'delivery_note' | 'credit';
  prefix: string;
  format: 'incremental' | 'yearly' | 'monthly';
  next_number: number;
  reset_frequency: 'never' | 'monthly' | 'yearly';
  tenant_id: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  status: 'active' | 'pending' | 'inactive';
  created_at: string;
  tenant_id: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: Record<string, Permission>;
  tenant_id: string;
}

export interface Permission {
  read: boolean;
  write: boolean;
  delete: boolean;
}

export interface GlobalSettings {
  id: string;
  footer_content: string;
  footer_display: 'all' | 'invoices_only' | 'none';
  primary_currency: string;
  invoice_template?: string;
  quote_template?: string;
  delivery_note_template?: string;
  credit_template?: string;
  tenant_id: string;
}
