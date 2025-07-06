import { useState, useEffect } from 'react';
import { InvoicePDF } from './invoices/InvoicePDF';
import { imageUrlToBase64 } from '@/utils/imageToBase64';
import { useAuth } from '@/hooks/useAuth';
import { useCustomTaxes } from '@/hooks/useCustomTaxes';
import { calculateCustomTaxes } from '@/utils/customTaxCalculations';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AsyncInvoicePDFProps {
  invoice: any;
  currency: any;
}

export const AsyncInvoicePDF: React.FC<AsyncInvoicePDFProps> = ({ invoice, currency }) => {
  const { organization } = useAuth();
  const { customTaxes } = useCustomTaxes();
  const [pdfData, setPdfData] = useState(null);

  const { data: globalSettings } = useQuery({
    queryKey: ['globalSettings', organization?.id],
    queryFn: async () => {
      if (!organization?.id) return null;
      
      const { data, error } = await supabase
        .from('global_settings')
        .select('*')
        .eq('organization_id', organization.id)
        .maybeSingle();

      if (error) {
        console.error('Erreur lors de la récupération des paramètres globaux:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!organization?.id
  });

  useEffect(() => {
    const generatePDFData = async () => {
      if (!invoice || !organization) return;

      const mockLineItems = invoice.invoice_items?.map(item => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        vatRate: item.tax_rate,
        discount: 0,
        total: item.total_price
      })) || [];

      // Convertir l'image de signature en base64 si elle existe
      let signatureBase64 = null;
      if (organization?.signature_url) {
        try {
          signatureBase64 = await imageUrlToBase64(organization.signature_url);
          console.log('✅ Signature convertie en base64:', signatureBase64 ? 'Succès' : 'Échec');
        } catch (error) {
          console.error('❌ Erreur conversion signature:', error);
        }
      }

      const company = {
        name: organization?.name || 'Mon Entreprise',
        address: organization?.address || 'Adresse de l\'entreprise',
        email: organization?.email || 'contact@monentreprise.fr',
        phone: organization?.phone || 'Téléphone',
        logo_url: organization?.logo_url,
        signature_url: signatureBase64 || organization?.signature_url // Utiliser base64 si disponible
      };

      const client = {
        name: invoice.clients?.name || '',
        company: invoice.clients?.company || '',
        address: invoice.clients?.address || '',
        email: invoice.clients?.email || '',
        vat_number: invoice.clients?.vat_number || ''
      };

      // Calcul des taxes personnalisées - Filtrer seulement celles qui ont été sélectionnées
      const subtotal = mockLineItems.reduce((sum, item) => sum + (item.total || 0), 0);
      const activeCustomTaxes = invoice.custom_taxes_used 
        ? customTaxes.filter(tax => invoice.custom_taxes_used.includes(tax.id))
        : [];
      const customTaxCalculations = calculateCustomTaxes(subtotal, activeCustomTaxes, 'invoice');

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
    return <div>Chargement...</div>;
  }

  return <InvoicePDF {...pdfData} />;
};