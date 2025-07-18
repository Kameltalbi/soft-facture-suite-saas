
export interface CustomTax {
  id: string;
  organization_id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  currency_id?: string;
  applicable_documents: string[];
  active: boolean;
  is_fiscal_stamp: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomTaxData {
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  currency_id?: string;
  applicable_documents: string[];
  is_fiscal_stamp: boolean;
}
