
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
  ...props 
}: TemplatedInvoicePDFProps) => {
  switch (template) {
    case 'modern':
      return <ModernTemplate {...props} />;
    case 'minimal':
      return <MinimalTemplate {...props} />;
    case 'professional':
      return <ProfessionalTemplate {...props} />;
    case 'classic':
    default:
      return <ClassicTemplate {...props} />;
  }
};
