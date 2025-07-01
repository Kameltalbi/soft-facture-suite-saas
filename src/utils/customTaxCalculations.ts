
import { CustomTax } from '@/types/customTax';

export interface TaxCalculation {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  amount: number;
}

export function calculateCustomTaxes(
  subtotal: number,
  customTaxes: CustomTax[],
  documentType: string
): TaxCalculation[] {
  const applicableTaxes = customTaxes.filter(tax => 
    tax.active && tax.applicable_documents.includes(documentType)
  );

  return applicableTaxes.map(tax => {
    const amount = tax.type === 'percentage' 
      ? (subtotal * tax.value) / 100
      : tax.value;

    return {
      id: tax.id,
      name: tax.name,
      type: tax.type,
      value: tax.value,
      amount: Number(amount.toFixed(2))
    };
  });
}

export function getTotalCustomTaxAmount(taxCalculations: TaxCalculation[]): number {
  return taxCalculations.reduce((total, tax) => total + tax.amount, 0);
}
