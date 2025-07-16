import React from 'react';
import { UniversalPDFGenerator } from './UniversalPDFGenerator';

interface SimplePDFGeneratorProps {
  invoice: any;
  organization: any;
  customTaxes: any[];
  globalSettings: any;
  currency: any;
}

export const SimplePDFGenerator: React.FC<SimplePDFGeneratorProps> = ({
  invoice,
  organization,
  customTaxes,
  globalSettings,
  currency
}) => {
  console.log('🔥 SimplePDFGenerator - Début rendu:', {
    invoiceNumber: invoice?.invoice_number,
    invoiceId: invoice?.id,
    hasAdvance: invoice?.has_advance,
    advanceAmount: invoice?.advance_amount,
    customTaxesUsed: invoice?.custom_taxes_used,
    customTaxesLength: customTaxes?.length,
    organizationId: organization?.id,
    globalSettingsId: globalSettings?.id,
    currencyCode: currency?.code
  });

  return (
    <UniversalPDFGenerator
      document={invoice}
      organization={organization}
      customTaxes={customTaxes}
      globalSettings={globalSettings}
      currency={currency}
      documentType="FACTURE"
    />
  );
};