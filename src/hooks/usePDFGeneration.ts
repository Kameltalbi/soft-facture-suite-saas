
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useAuth } from '@/hooks/useAuth';

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
  const { organization } = useAuth();

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

    const companyData = {
      name: organization?.name || 'Soft Facture',
      address: organization?.address || '456 Avenue de la République, 69000 Lyon',
      email: organization?.email || 'contact@softfacture.fr',
      phone: organization?.phone || '04 72 00 00 00',
      logo: organization?.logo_url
    };

    return {
      invoiceData,
      lineItems,
      client: mockClient,
      company: companyData,
      settings
    };
  };

  return { generateInvoicePDF };
};
