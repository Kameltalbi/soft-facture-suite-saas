
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
  console.log('🧮 calculateCustomTaxes - Début:', {
    subtotal,
    documentType,
    customTaxes: customTaxes.map(t => ({
      id: t.id,
      name: t.name,
      type: t.type,
      value: t.value,
      active: t.active,
      applicable_documents: t.applicable_documents
    }))
  });

  const applicableTaxes = customTaxes.filter(tax => 
    tax.active && tax.applicable_documents.includes(documentType)
  );

  console.log('🧮 calculateCustomTaxes - Taxes applicables:', {
    documentType,
    applicableTaxes: applicableTaxes.map(t => ({
      id: t.id,
      name: t.name,
      applicable_documents: t.applicable_documents
    }))
  });

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
