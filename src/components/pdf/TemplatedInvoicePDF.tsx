
import React from 'react';
import { ClassicTemplate, ModernTemplate, MinimalTemplate, ProfessionalTemplate } from './templates';

interface TemplatedInvoicePDFProps {
  invoiceData: any;
  lineItems: any[];
  client: any;
  company: any;
  settings: any;
  template?: string;
  documentType?: string;
}

export const TemplatedInvoicePDF = ({ 
  template = 'classic',
  documentType = 'FACTURE',
  ...props 
}: TemplatedInvoicePDFProps) => {
  const templateProps = { ...props, documentType };
  
  switch (template) {
    case 'modern':
      return <ModernTemplate {...templateProps} />;
    case 'minimal':
      return <MinimalTemplate {...templateProps} />;
    case 'professional':
      return <ProfessionalTemplate {...templateProps} />;
    case 'classic':
    default:
      return <ClassicTemplate {...templateProps} />;
  }
};
