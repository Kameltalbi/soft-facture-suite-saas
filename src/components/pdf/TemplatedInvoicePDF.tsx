
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
  unifiedTemplate = 'classic',
  useUnifiedTemplate = false,
  ...props 
}: TemplatedInvoicePDFProps) => {
  const templateProps = { 
    ...props, 
    documentType
  };
  
  // Détermine quel template utiliser selon les paramètres
  let selectedTemplate = template;
  
  // Si le template unifié est activé, utiliser le template unifié pour tous les documents
  if (useUnifiedTemplate) {
    selectedTemplate = unifiedTemplate;
  }
  
  console.log('Template selection:', {
    originalTemplate: template,
    unifiedTemplate,
    useUnifiedTemplate,
    selectedTemplate,
    documentType
  });
  
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
