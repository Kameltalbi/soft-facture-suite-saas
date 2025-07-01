
export interface CustomTax {
  id: string;
  organization_id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  applicable_documents: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomTaxData {
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  applicable_documents: string[];
}
