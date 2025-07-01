
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
  customTaxes?: any[]; // Ajouter les taxes personnalisées
}

export const TemplatedInvoicePDF = ({ 
  template = 'classic',
  documentType = 'FACTURE',
  customTaxes = [], // Valeur par défaut
  ...props 
}: TemplatedInvoicePDFProps) => {
  console.log('🎨 TemplatedInvoicePDF - Taxes reçues:', customTaxes);
  
  const templateProps = { 
    ...props, 
    documentType,
    customTaxes // Passer les taxes aux templates
  };
  
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
