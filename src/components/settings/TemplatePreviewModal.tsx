
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { TemplatedInvoicePDF } from '@/components/pdf/TemplatedInvoicePDF';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: string;
  documentType: string;
}

// Mock data pour la prévisualisation
const mockInvoiceData = {
  number: 'FACT-2024-001',
  date: '27/06/2024',
  dueDate: '27/07/2024',
  subject: 'Prestation de service',
  notes: 'Merci pour votre confiance. Paiement à réception de facture.'
};

const mockLineItems = [
  {
    id: '1',
    description: 'Développement site web',
    quantity: 1,
    unitPrice: 1500,
    vatRate: 20,
    discount: 5,
    total: 1800
  },
  {
    id: '2',
    description: 'Formation utilisateur',
    quantity: 2,
    unitPrice: 300,
    vatRate: 20,
    discount: 0,
    total: 720
  },
  {
    id: '3',
    description: 'Maintenance mensuelle',
    quantity: 12,
    unitPrice: 50,
    vatRate: 20,
    discount: 10,
    total: 720
  }
];

const mockClient = {
  name: 'Jean Dupont',
  company: 'Entreprise ABC',
  address: '123 Rue de la Paix, 75001 Paris',
  email: 'jean.dupont@entreprise-abc.fr'
};

const mockCompany = {
  name: 'Soft Facture SARL',
  address: '123 Avenue Habib Bourguiba, 1000 Tunis, Tunisie',
  phone: '+216 71 123 456',
  email: 'contact@softfacture.tn'
};

const mockSettings = {
  showVat: true,
  showDiscount: true,
  footer_content: 'Soft Facture SARL - 123 Avenue Habib Bourguiba, 1000 Tunis\nTél: +216 71 123 456 - Email: contact@softfacture.tn\nRIB: 12345678901234567890 - IBAN: TN59 1234 5678 9012 3456 7890'
};

const documentTypeLabels: Record<string, string> = {
  invoice: 'FACTURE',
  quote: 'DEVIS',
  delivery_note: 'BON DE LIVRAISON',
  credit: 'AVOIR'
};

export function TemplatePreviewModal({ isOpen, onClose, template, documentType }: TemplatePreviewModalProps) {
  const pdfDocument = (
    <TemplatedInvoicePDF
      template={template}
      invoiceData={mockInvoiceData}
      lineItems={mockLineItems}
      client={mockClient}
      company={mockCompany}
      settings={mockSettings}
      documentType={documentTypeLabels[documentType] || documentType}
    />
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <span>Aperçu du template {template} - {documentTypeLabels[documentType] || documentType}</span>
            <PDFDownloadLink
              document={pdfDocument}
              fileName={`template-${template}-${documentType}.pdf`}
            >
              {({ loading }) => (
                <Button variant="outline" size="sm" disabled={loading}>
                  <Download className="h-4 w-4 mr-2" />
                  {loading ? 'Préparation...' : 'Télécharger'}
                </Button>
              )}
            </PDFDownloadLink>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 border rounded-lg overflow-hidden bg-gray-50">
          <PDFViewer 
            width="100%" 
            height="100%"
            showToolbar={true}
            style={{ border: 'none' }}
          >
            {pdfDocument}
          </PDFViewer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
