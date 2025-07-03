
export interface Organization {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  status: 'active' | 'suspended' | 'pending';
  plan: 'essential' | 'pro';
  created_at: string;
  updated_at: string;
  subscription_start: string;
  subscription_end: string | null;
  logo_url: string | null;
  // Ajout des propriétés manquantes de la base de données
  updated_by?: string | null;
  vat_number?: string | null;
  website?: string | null;
}
