
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
  unifiedTemplate?: string;
  useUnifiedTemplate?: boolean;
}

export const TemplatedInvoicePDF = ({ 
  template = 'classic',
  documentType = 'FACTURE',
  unifiedTemplate,
  useUnifiedTemplate = false,
  ...props 
}: TemplatedInvoicePDFProps) => {
  const templateProps = { 
    ...props, 
    documentType
  };
  
  // Si le template unifié est activé, l'utiliser pour tous les documents
  const selectedTemplate = useUnifiedTemplate && unifiedTemplate ? unifiedTemplate : template;
  
  switch (selectedTemplate) {
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
