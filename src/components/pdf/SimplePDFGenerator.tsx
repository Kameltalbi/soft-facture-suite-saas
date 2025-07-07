import React, { useState, useEffect } from 'react';
import { InvoicePDF } from './invoices/InvoicePDF';
import { imageUrlToBase64 } from '@/utils/imageToBase64';
import { calculateCustomTaxes } from '@/utils/customTaxCalculations';

interface SimplePDFGeneratorProps {
  invoice: any;
  organization: any;
  customTaxes: any[];
  globalSettings: any;
  currency: any;
}

export const SimplePDFGenerator: React.FC<SimplePDFGeneratorProps> = ({
  invoice,
  organization,
  customTaxes,
  globalSettings,
  currency
}) => {
  const [pdfData, setPdfData] = useState(null);

  useEffect(() => {
    const generatePDFData = async () => {
      const mockLineItems = invoice.invoice_items?.map(item => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        vatRate: item.tax_rate,
        discount: item.discount || 0,
        total: item.total_price
      })) || [];

      // Convertir l'image de signature en base64 si elle existe
      let signatureBase64 = null;
      if (organization?.signature_url) {
        try {
          signatureBase64 = await imageUrlToBase64(organization.signature_url);
        } catch (error) {
          console.error('❌ Erreur conversion signature:', error);
          // Fallback: utiliser l'URL directe si la conversion échoue
          signatureBase64 = organization.signature_url;
        }
      }

      const company = {
        name: organization?.name || 'Mon Entreprise',
        address: organization?.address || 'Adresse de l\'entreprise',
        email: organization?.email || 'contact@monentreprise.fr',
        phone: organization?.phone || 'Téléphone',
        logo_url: organization?.logo_url,
        signature_url: signatureBase64 // Toujours utiliser la version traitée
      };

      const client = {
        name: invoice.clients?.name || '',
        company: invoice.clients?.company || '',
        address: invoice.clients?.address || '',
        email: invoice.clients?.email || '',
        vat_number: invoice.clients?.vat_number || ''
      };

      // Calcul des taxes personnalisées
      const subtotal = mockLineItems.reduce((sum, item) => sum + (item.total || 0), 0);
      const activeCustomTaxes = invoice.custom_taxes_used 
        ? customTaxes.filter(tax => invoice.custom_taxes_used.includes(tax.id))
        : [];
      const customTaxCalculations = calculateCustomTaxes(subtotal, activeCustomTaxes, 'invoice');

      console.log('📄 SimplePDFGenerator - settings créés:', {
        showVat: true,
        showDiscount: globalSettings?.show_discount ?? true,
        globalSettings: globalSettings
      });

      const data = {
        invoiceData: {
          number: invoice.invoice_number,
          date: invoice.date,
          dueDate: invoice.due_date,
          subject: `Facture pour ${invoice.clients?.name || ''}`,
          notes: invoice.notes || 'Merci pour votre confiance.'
        },
        lineItems: mockLineItems,
        client,
        company,
        settings: {
          showVat: true,
          showDiscount: globalSettings?.show_discount ?? true,
          footer_content: globalSettings?.footer_content || '',
          footer_display: globalSettings?.footer_display || 'all'
        },
        currency: invoice.currencies || currency,
        customTaxes: customTaxCalculations,
        isSigned: invoice.is_signed || false
      };

      setPdfData(data);
    };

    generatePDFData();
  }, [invoice, organization, customTaxes, globalSettings, currency]);

  if (!pdfData) {
    return null; // Le PDFDownloadLink gérera l'état de chargement
  }

  return <InvoicePDF {...pdfData} />;
};