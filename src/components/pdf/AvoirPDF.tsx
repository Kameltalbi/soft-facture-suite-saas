
import React from 'react';
import { TemplatedInvoicePDF } from './TemplatedInvoicePDF';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  total: number;
}

interface AvoirData {
  id: string;
  number: string;
  type: 'facture_liee' | 'economique';
  invoiceNumber?: string;
  clientName: string;
  amount: number;
  date: string;
  status: string;
  notes?: string;
  items?: LineItem[];
}

interface AvoirPDFProps {
  avoirData: AvoirData;
  client?: {
    name: string;
    company?: string;
    address?: string;
    email?: string;
  };
  company?: {
    name: string;
    address?: string;
    email?: string;
    phone?: string;
    logo?: string;
  };
  settings?: {
    showVat: boolean;
    showDiscount: boolean;
    currency: string;
    amountInWords: boolean;
    credit_template?: string;
    unified_template?: string;
    use_unified_template?: boolean;
  };
}

export const AvoirPDF: React.FC<AvoirPDFProps> = ({
  avoirData,
  client,
  company,
  settings = {
    showVat: true,
    showDiscount: false,
    currency: 'EUR',
    amountInWords: true
  }
}) => {
  // Transformer les données de l'avoir en format compatible avec TemplatedInvoicePDF
  const invoiceData = {
    number: avoirData.number,
    date: avoirData.date,
    dueDate: avoirData.date, // Pour un avoir, la date d'échéance est la même que la date
    clientId: 'mock-client-id',
    subject: avoirData.type === 'facture_liee' 
      ? `Avoir sur facture ${avoirData.invoiceNumber}` 
      : 'Avoir économique',
    notes: avoirData.notes || ''
  };

  // Transformer les items de l'avoir
  const lineItems = avoirData.items || [
    {
      id: '1',
      description: avoirData.type === 'facture_liee' 
        ? `Avoir sur facture ${avoirData.invoiceNumber}` 
        : 'Avoir économique',
      quantity: 1,
      unitPrice: Math.abs(avoirData.amount),
      vatRate: 20,
      discount: 0,
      total: Math.abs(avoirData.amount)
    }
  ];

  // Transformer les données client
  const clientData = client || {
    name: avoirData.clientName,
    company: avoirData.clientName,
    address: '123 Rue de l\'Exemple, 75001 Paris',
    email: 'contact@example.com'
  };

  // Transformer les données société
  const companyData = company || {
    name: 'Soft Facture',
    address: '456 Avenue de la République, 69000 Lyon',
    email: 'contact@softfacture.fr',
    phone: '04 72 00 00 00'
  };

  // Déterminer le template à utiliser
  let template = 'classic';
  if (settings.use_unified_template && settings.unified_template) {
    template = settings.unified_template;
  } else if (settings.credit_template) {
    template = settings.credit_template;
  }

  console.log('AvoirPDF template selection:', {
    template,
    useUnifiedTemplate: settings.use_unified_template,
    unifiedTemplate: settings.unified_template,
    creditTemplate: settings.credit_template
  });

  return (
    <TemplatedInvoicePDF
      invoiceData={invoiceData}
      lineItems={lineItems}
      client={clientData}
      company={companyData}
      settings={settings}
      template={template}
      unifiedTemplate={settings.unified_template}
      useUnifiedTemplate={settings.use_unified_template}
      documentType="AVOIR"
    />
  );
};
