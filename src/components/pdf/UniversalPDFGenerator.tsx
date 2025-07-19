import React, { useState, useEffect } from 'react';
import { UnifiedTemplate } from './templates/UnifiedTemplate';
import { imageUrlToBase64 } from '@/utils/imageToBase64';
import { calculateCustomTaxes } from '@/utils/customTaxCalculations';

interface UniversalPDFGeneratorProps {
  document: any;
  organization: any;
  customTaxes: any[];
  globalSettings: any;
  currency: any;
  documentType: 'FACTURE' | 'DEVIS' | 'BON DE LIVRAISON' | 'AVOIR' | 'BON DE COMMANDE';
}

export const UniversalPDFGenerator: React.FC<UniversalPDFGeneratorProps> = ({
  document,
  organization,
  customTaxes,
  globalSettings,
  currency,
  documentType
}) => {
  const [pdfData, setPdfData] = useState(null);

  useEffect(() => {
    console.log('🚀 UniversalPDFGenerator - Début génération:', {
      documentNumber: document?.invoice_number || document?.quote_number,
      customTaxes: customTaxes?.length,
      customTaxesUsed: document?.custom_taxes_used,
      hasAdvance: document?.has_advance,
      advanceAmount: document?.advance_amount,
      documentCurrency: document?.currencies,
      contextCurrency: currency
    });

    const generatePDFData = async () => {
      // Map line items based on document type
      let lineItems = [];
      switch (documentType) {
        case 'FACTURE':
          lineItems = document.invoice_items?.map(item => ({
            id: item.id,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unit_price,
            vatRate: item.tax_rate,
            discount: item.discount || 0,
            total: item.total_price
          })) || [];
          break;
        case 'DEVIS':
          lineItems = document.quote_items?.map(item => ({
            id: item.id,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unit_price,
            vatRate: item.tax_rate,
            discount: item.discount || 0,
            total: item.total_price
          })) || [];
          break;
        case 'BON DE LIVRAISON':
          lineItems = document.delivery_note_items?.map(item => ({
            id: item.id,
            description: item.description,
            quantity: item.quantity,
            delivered_quantity: item.delivered_quantity,
            unitPrice: 0, // No prices in delivery notes
            vatRate: 0,
            discount: 0,
            total: 0
          })) || [];
          break;
        case 'AVOIR':
          lineItems = document.credit_note_items?.map(item => ({
            id: item.id,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unit_price,
            vatRate: item.tax_rate,
            discount: item.discount || 0,
            total: item.total_price
          })) || [];
          break;
        case 'BON DE COMMANDE':
          lineItems = document.purchase_order_items?.map(item => ({
            id: item.id,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unit_price,
            vatRate: item.tax_rate,
            discount: item.discount || 0,
            total: item.total_price
          })) || [];
          break;
        default:
          lineItems = [];
      }

      // Convert signature to base64 if exists
      let signatureBase64 = null;
      if (organization?.signature_url) {
        try {
          signatureBase64 = await imageUrlToBase64(organization.signature_url);
        } catch (error) {
          console.error('❌ Erreur conversion signature:', error);
          signatureBase64 = organization.signature_url;
        }
      }

      const company = {
        name: organization?.name || 'Mon Entreprise',
        address: organization?.address || 'Adresse de l\'entreprise',
        email: organization?.email || 'contact@monentreprise.fr',
        phone: organization?.phone || 'Téléphone',
        logo_url: organization?.logo_url || null,
        signature_url: signatureBase64
      };

      const client = {
        name: document.clients?.name || document.client?.name || 'Nom du client',
        company: document.clients?.company || document.client?.company || '',
        address: document.clients?.address || document.client?.address || 'Adresse du client',
        email: document.clients?.email || document.client?.email || '',
        vat_number: document.clients?.vat_number || document.client?.vat_number || ''
      };

      // Calculate custom taxes if applicable - only use taxes that are enabled for this specific document
      const subtotal = lineItems.reduce((sum, item) => sum + (item.total || 0), 0);
      
      // Filter custom taxes to only include those enabled for this document
      const enabledCustomTaxes = customTaxes.filter(tax => 
        document.custom_taxes_used && document.custom_taxes_used.includes(tax.id)
      );
      
      console.log('🔍 PDF Generator - Taxes personnalisées pour cette facture:', {
        documentNumber: document.invoice_number,
        customTaxesUsed: document.custom_taxes_used,
        allCustomTaxes: customTaxes.map(t => ({ id: t.id, name: t.name })),
        enabledCustomTaxes: enabledCustomTaxes.map(t => ({ id: t.id, name: t.name }))
      });
      
      const customTaxCalculations = calculateCustomTaxes(subtotal, enabledCustomTaxes, documentType);
      
      console.log('🧮 PDF Generator - Calcul des taxes personnalisées:', {
        documentType,
        subtotal,
        enabledCustomTaxes: enabledCustomTaxes.map(t => ({
          id: t.id,
          name: t.name,
          type: t.type,
          value: t.value,
          applicable_documents: t.applicable_documents,
          active: t.active
        })),
        customTaxCalculations
      });

      // Get document number based on type
      const getDocumentNumber = () => {
        switch (documentType) {
          case 'DEVIS': return document.quote_number;
          case 'BON DE LIVRAISON': return document.delivery_number;
          case 'AVOIR': return document.credit_note_number;
          case 'BON DE COMMANDE': return document.purchase_order_number;
          case 'FACTURE':
          default: return document.invoice_number;
        }
      };

      // Utiliser la devise du document ou celle du contexte
      const documentCurrency = document.currencies || currency;
      
      console.log('💱 PDF Generator - Devise utilisée:', {
        documentCurrency,
        contextCurrency: currency,
        finalCurrency: documentCurrency
      });

      console.log('🔍 DEBUG SUBJECT - Document reçu:', {
        documentSubject: document.subject,
        documentNumber: getDocumentNumber(),
        allDocumentFields: Object.keys(document)
      });

      const data = {
        documentData: {
          number: getDocumentNumber(),
          date: document.date,
          subject: document.subject || '',
          notes: document.notes || '',
          hasAdvance: document.has_advance,
          advanceAmount: document.advance_amount
        },
        lineItems,
        client,
        company,
        settings: {
          showVat: document.use_vat ?? globalSettings?.use_vat ?? true,
          showDiscount: globalSettings?.show_discount ?? true,
          // showFiscalStamp est basé sur les taxes personnalisées utilisées dans cette facture
          showFiscalStamp: (enabledCustomTaxes.some(tax => 
            tax.is_fiscal_stamp
          )) || (globalSettings?.show_fiscal_stamp ?? true),
          footer_content: globalSettings?.footer_content || '',
          footer_display: globalSettings?.footer_display || 'all'
        },
        currency: documentCurrency, // Utiliser la devise du document
        customTaxes: customTaxCalculations,
        isSigned: document.is_signed || false,
        documentType
      };

      console.log('📄 PDF Generator - Données finales envoyées au template:', {
        documentNumber: data.documentData.number,
        hasAdvance: data.documentData.hasAdvance,
        advanceAmount: data.documentData.advanceAmount,
        customTaxes: data.customTaxes,
        customTaxesLength: data.customTaxes?.length,
        showFiscalStamp: data.settings.showFiscalStamp,
        finalCurrency: data.currency
      });

      setPdfData(data);
    };

    generatePDFData();
  }, [document, organization, customTaxes, globalSettings, currency, documentType]);

  if (!pdfData) {
    return null;
  }

  return <UnifiedTemplate {...pdfData} />;
};
