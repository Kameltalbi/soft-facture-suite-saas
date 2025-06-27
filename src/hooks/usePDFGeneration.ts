
import { PDFDownloadLink } from '@react-pdf/renderer';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  discount: number;
  total: number;
}

interface InvoiceData {
  number: string;
  date: string;
  dueDate?: string;
  clientId: string;
  subject: string;
  notes: string;
}

export const usePDFGeneration = () => {
  const generateInvoicePDF = (
    invoiceData: InvoiceData,
    lineItems: LineItem[],
    settings: any
  ) => {
    // Données mockées pour l'exemple - à remplacer par les vraies données
    const mockClient = {
      name: 'Entreprise ABC',
      company: 'ABC Solutions',
      address: '123 Rue de la Paix, 75001 Paris',
      email: 'contact@abc-solutions.fr'
    };

    const mockCompany = {
      name: 'Soft Facture',
      address: '456 Avenue de la République, 69000 Lyon',
      email: 'contact@softfacture.fr',
      phone: '04 72 00 00 00'
    };

    return {
      invoiceData,
      lineItems,
      client: mockClient,
      company: mockCompany,
      settings
    };
  };

  return { generateInvoicePDF };
};
