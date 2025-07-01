
import React from 'react';
import { ClassicTemplate, ModernTemplate } from './templates';

interface TemplatedInvoicePDFProps {
  invoiceData: any;
  lineItems: any[];
  client: any;
  company: any;
  settings: any;
  template?: string;
  documentType?: string;
  customTaxes?: any[];
}

export const TemplatedInvoicePDF = ({ 
  template = 'classic',
  documentType = 'FACTURE',
  customTaxes = [],
  ...props 
}: TemplatedInvoicePDFProps) => {
  console.log('🎨 TemplatedInvoicePDF - Template utilisé:', template);
  console.log('🎨 TemplatedInvoicePDF - Taxes reçues:', customTaxes);
  
  const templateProps = { 
    ...props, 
    documentType,
    customTaxes
  };
  
  switch (template) {
    case 'modern':
      return <ModernTemplate {...templateProps} />;
    case 'classic':
    default:
      return <ClassicTemplate {...templateProps} />;
  }
};
