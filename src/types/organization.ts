
export interface Organization {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  status: 'active' | 'suspended' | 'pending';
  plan: 'free' | 'standard' | 'premium';
  created_at: string;
  updated_at: string;
  subscription_start: string;
  subscription_end: string | null;
  logo_url: string | null;
}
