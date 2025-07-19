
import { CustomTax } from '@/types/customTax';

export interface TaxCalculation {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  amount: number;
  is_fiscal_stamp: boolean;
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
      applicable_documents: t.applicable_documents,
      is_fiscal_stamp: t.is_fiscal_stamp
    }))
  });

  const applicableTaxes = customTaxes.filter(tax => {
    // Vérifier si la taxe est active
    if (!tax.active) return false;
    
    // Vérifier si le document est applicable, de manière insensible à la casse
    return tax.applicable_documents.some(doc => 
      doc.toLowerCase() === documentType.toLowerCase() ||
      // Gestion des cas spéciaux (facture/invoice, devis/quote, etc.)
      (doc.toLowerCase() === 'invoice' && documentType.toLowerCase() === 'facture') ||
      (doc.toLowerCase() === 'facture' && documentType.toLowerCase() === 'invoice') ||
      (doc.toLowerCase() === 'quote' && documentType.toLowerCase() === 'devis') ||
      (doc.toLowerCase() === 'devis' && documentType.toLowerCase() === 'quote') ||
      // Si c'est un timbre fiscal, l'inclure systématiquement pour les factures
      (tax.is_fiscal_stamp && 
       (documentType.toLowerCase() === 'facture' || documentType.toLowerCase() === 'invoice'))
    );
  });

  console.log('🧮 calculateCustomTaxes - Taxes applicables:', {
    documentType,
    applicableTaxes: applicableTaxes.map(t => ({
      id: t.id,
      name: t.name,
      applicable_documents: t.applicable_documents,
      is_fiscal_stamp: t.is_fiscal_stamp
    }))
  });

  const result = applicableTaxes.map(tax => {
    const amount = tax.type === 'percentage' 
      ? (subtotal * tax.value) / 100
      : tax.value;

    return {
      id: tax.id,
      name: tax.name,
      type: tax.type,
      value: tax.value,
      amount: Number(amount.toFixed(2)),
      is_fiscal_stamp: tax.is_fiscal_stamp
    };
  });

  console.log('🧮 calculateCustomTaxes - Résultat final:', {
    result,
    resultLength: result.length
  });

  return result;
}

export function getTotalCustomTaxAmount(taxCalculations: TaxCalculation[]): number {
  return taxCalculations.reduce((total, tax) => total + tax.amount, 0);
}
