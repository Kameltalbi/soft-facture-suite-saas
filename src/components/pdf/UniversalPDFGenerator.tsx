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
      
      const customTaxCalculations = calculateCustomTaxes(subtotal, enabledCustomTaxes, documentType.toLowerCase());

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

      // Get due date based on type
      const getDueDate = () => {
        switch (documentType) {
          case 'DEVIS': return document.valid_until;
          case 'BON DE LIVRAISON': return document.expected_delivery_date;
          case 'BON DE COMMANDE': return document.expected_delivery_date;
          case 'FACTURE':
          case 'AVOIR':
          default: return document.due_date;
        }
      };

      const data = {
        documentData: {
          number: getDocumentNumber(),
          date: document.date,
          dueDate: getDueDate(),
          subject: document.subject || '',
          notes: document.notes || ''
        },
        lineItems,
        client,
        company,
        settings: {
          showVat: document.use_vat ?? globalSettings?.use_vat ?? true,
          showDiscount: globalSettings?.show_discount ?? true,
          // showFiscalStamp est basé sur les taxes personnalisées utilisées dans cette facture
          showFiscalStamp: (enabledCustomTaxes.some(tax => 
            tax.name.toLowerCase().includes('timbre')
          )) || (globalSettings?.show_fiscal_stamp ?? true),
          footer_content: globalSettings?.footer_content || '',
          footer_display: globalSettings?.footer_display || 'all'
        },
        currency: currency, // Utiliser la devise du contexte qui contient decimal_places
        customTaxes: customTaxCalculations,
        isSigned: document.is_signed || false,
        documentType
      };

      setPdfData(data);
    };

    generatePDFData();
  }, [document, organization, customTaxes, globalSettings, currency, documentType]);

  if (!pdfData) {
    return null;
  }

  return <UnifiedTemplate {...pdfData} />;
};