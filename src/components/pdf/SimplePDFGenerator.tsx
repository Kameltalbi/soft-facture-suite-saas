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
  console.log('🔍 SimplePDFGenerator - invoice object:', invoice);
  console.log('🔍 SimplePDFGenerator - invoice.subject:', invoice.subject);
  
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