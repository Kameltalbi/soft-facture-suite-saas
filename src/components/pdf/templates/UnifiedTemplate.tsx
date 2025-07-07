import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { TaxCalculation } from '@/utils/customTaxCalculations';
import { numberToWords } from '@/utils/numberToWords';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    paddingBottom: 45,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  logo: {
    width: 80,
    height: 60,
    objectFit: 'contain',
    marginRight: 15,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
  },
  companyDetails: {
    fontSize: 10,
    color: '#666666',
    lineHeight: 1.4,
    marginBottom: 2,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  documentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 15,
  },
  documentInfo: {
    alignItems: 'flex-end',
  },
  documentNumber: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  documentDate: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 3,
  },
  clientSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
  },
  clientInfo: {
    fontSize: 10,
    lineHeight: 1.4,
    color: '#666666',
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    padding: 8,
  },
  tableHeaderText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    padding: 8,
  },
  tableCell: {
    fontSize: 9,
    color: '#333333',
  },
  // Columns without discount
  colDescription: { flex: 3 },
  colQuantity: { flex: 1, textAlign: 'center' },
  colUnitPrice: { flex: 1, textAlign: 'right' },
  colVat: { flex: 1, textAlign: 'center' },
  colTotal: { flex: 1, textAlign: 'right' },
  // Columns with discount (adjusted widths)
  colDescriptionWithDiscount: { flex: 2.5 },
  colQuantityWithDiscount: { flex: 0.8, textAlign: 'center' },
  colUnitPriceWithDiscount: { flex: 1, textAlign: 'right' },
  colDiscountWithDiscount: { flex: 0.8, textAlign: 'center' },
  colVatWithDiscount: { flex: 0.8, textAlign: 'center' },
  colTotalWithDiscount: { flex: 1, textAlign: 'right' },
  totalsSection: {
    alignSelf: 'flex-end',
    width: 200,
    marginTop: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 10,
    color: '#666666',
  },
  totalValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333333',
  },
  customTaxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    marginTop: 5,
    paddingHorizontal: 10,
  },
  grandTotalText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  notes: {
    marginTop: 20,
    fontSize: 9,
    color: '#666666',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 30,
    right: 30,
    fontSize: 8,
    color: '#666666',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
  },
  signature: {
    marginTop: 40,
    alignItems: 'center',
    maxWidth: 150,
    alignSelf: 'center',
  },
  signatureLabel: {
    fontSize: 10,
    color: '#333333',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  signatureImage: {
    maxWidth: 150,
    maxHeight: 75,
    objectFit: 'contain',
  },
  amountInWords: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#F8F9FA',
    borderRadius: 5,
    textAlign: 'center',
  },
});

interface UnifiedTemplateProps {
  documentData: any;
  lineItems: any[];
  client: any;
  company: any;
  settings: any;
  currency?: { code: string; symbol: string; name: string };
  customTaxes?: TaxCalculation[];
  isSigned?: boolean;
  documentType?: 'FACTURE' | 'DEVIS' | 'BON DE LIVRAISON' | 'AVOIR' | 'BON DE COMMANDE';
}

export const UnifiedTemplate = ({
  documentData,
  lineItems,
  client,
  company,
  settings,
  currency,
  customTaxes = [],
  isSigned = false,
  documentType = 'FACTURE'
}: UnifiedTemplateProps) => {
  const currencySymbol = currency?.symbol || '€';
  const currencyCode = currency?.code || 'EUR';
  
  // Document type specific configurations
  const getDocumentConfig = () => {
    switch (documentType) {
      case 'DEVIS':
        return {
          title: 'DEVIS',
          clientLabel: 'DEVIS POUR :',
          numberLabel: 'N°',
          dateLabel: 'Date:',
          dueDateLabel: 'Valide jusqu\'au:',
          showPrices: true,
          showVat: settings?.showVat ?? true,
          showTotal: true
        };
      case 'BON DE LIVRAISON':
        return {
          title: 'BON DE LIVRAISON',
          clientLabel: 'LIVRER À :',
          numberLabel: 'BL N°',
          dateLabel: 'Date:',
          dueDateLabel: 'Livraison prévue:',
          showPrices: false,
          showVat: false,
          showTotal: false
        };
      case 'AVOIR':
        return {
          title: 'AVOIR',
          clientLabel: 'AVOIR POUR :',
          numberLabel: 'AVOIR N°',
          dateLabel: 'Date:',
          dueDateLabel: 'Facture d\'origine:',
          showPrices: true,
          showVat: settings?.showVat ?? true,
          showTotal: true
        };
      case 'BON DE COMMANDE':
        return {
          title: 'BON DE COMMANDE',
          clientLabel: 'COMMANDER À :',
          numberLabel: 'BC N°',
          dateLabel: 'Date:',
          dueDateLabel: 'Livraison souhaitée:',
          showPrices: true,
          showVat: settings?.showVat ?? true,
          showTotal: true
        };
      case 'FACTURE':
      default:
        return {
          title: 'FACTURE',
          clientLabel: 'FACTURER À :',
          numberLabel: 'N°',
          dateLabel: 'Date:',
          dueDateLabel: 'Échéance:',
          showPrices: true,
          showVat: settings?.showVat ?? true,
          showTotal: true
        };
    }
  };

  const config = getDocumentConfig();
  
  const calculateTotals = () => {
    if (!config.showPrices) {
      return { subtotalHT: 0, totalVAT: 0, totalCustomTaxes: 0, totalTTC: 0 };
    }

    const subtotalHT = lineItems.reduce((sum, item) => sum + (item.total || 0), 0);
    const totalVAT = config.showVat ? lineItems.reduce((sum, item) => {
      return sum + ((item.total || 0) * (item.vatRate || 0) / 100);
    }, 0) : 0;
    
    const totalCustomTaxes = customTaxes.reduce((sum, tax) => sum + tax.amount, 0);
    const totalTTC = subtotalHT + totalVAT + totalCustomTaxes;

    return { subtotalHT, totalVAT, totalCustomTaxes, totalTTC };
  };

  const { subtotalHT, totalVAT, totalCustomTaxes, totalTTC } = calculateTotals();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.leftSection}>
            {company?.logo_url && (
              <Image style={styles.logo} src={company.logo_url} />
            )}
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>
                {company?.name || 'Nom de l\'entreprise'}
              </Text>
              <Text style={styles.companyDetails}>
                {company?.address || 'Adresse de l\'entreprise'}
              </Text>
              <Text style={styles.companyDetails}>
                {company?.email || 'Email de l\'entreprise'}
              </Text>
              <Text style={styles.companyDetails}>
                {company?.phone || 'Téléphone'}
              </Text>
            </View>
          </View>
          
          <View style={styles.rightSection}>
            <Text style={styles.documentTitle}>{config.title}</Text>
            <View style={styles.documentInfo}>
              <Text style={styles.documentNumber}>{config.numberLabel} {documentData?.number || 'N/A'}</Text>
              <Text style={styles.documentDate}>
                {config.dateLabel} {new Date(documentData?.date || Date.now()).toLocaleDateString('fr-FR')}
              </Text>
              {documentData?.dueDate && (
                <Text style={styles.documentDate}>
                  {config.dueDateLabel} {new Date(documentData.dueDate).toLocaleDateString('fr-FR')}
                </Text>
              )}
              {documentData?.subject && documentData.subject.trim() && (
                <Text style={[styles.documentDate, { marginTop: 10, fontWeight: 'bold' }]}>
                  Objet: {documentData.subject}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Client and Subject Section */}
        <View style={{ flexDirection: 'row', marginBottom: 20, gap: 20 }}>
          {/* Client Section */}
          <View style={[styles.clientSection, { flex: 1 }]}>
            <Text style={styles.sectionTitle}>{config.clientLabel}</Text>
            <Text style={styles.clientInfo}>
              {client?.company || client?.name || 'Nom du client'}
            </Text>
            <Text style={styles.clientInfo}>
              {client?.address || 'Adresse du client'}
            </Text>
            <Text style={styles.clientInfo}>
              {client?.email || 'Email du client'}
            </Text>
            {client?.vat_number && client.vat_number.trim() && (
              <Text style={styles.clientInfo}>
                N° TVA: {client.vat_number}
              </Text>
            )}
          </View>

          {/* Subject Section */}
          {documentData?.subject && documentData.subject.trim() && (
            <View style={[styles.clientSection, { flex: 1 }]}>
              <Text style={styles.sectionTitle}>OBJET :</Text>
              <Text style={styles.clientInfo}>
                {documentData.subject}
              </Text>
            </View>
          )}
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, settings?.showDiscount ? styles.colDescriptionWithDiscount : styles.colDescription]}>
              DESCRIPTION
            </Text>
            <Text style={[styles.tableHeaderText, settings?.showDiscount ? styles.colQuantityWithDiscount : styles.colQuantity]}>
              QTÉ
            </Text>
            {config.showPrices && (
              <Text style={[styles.tableHeaderText, settings?.showDiscount ? styles.colUnitPriceWithDiscount : styles.colUnitPrice]}>
                P.U. HT
              </Text>
            )}
            {settings?.showDiscount && config.showPrices && (
              <Text style={[styles.tableHeaderText, styles.colDiscountWithDiscount]}>
                REMISE
              </Text>
            )}
            {config.showVat && config.showPrices && (
              <Text style={[styles.tableHeaderText, settings?.showDiscount ? styles.colVatWithDiscount : styles.colVat]}>
                TVA
              </Text>
            )}
            {config.showPrices && (
              <Text style={[styles.tableHeaderText, settings?.showDiscount ? styles.colTotalWithDiscount : styles.colTotal]}>
                TOTAL HT
              </Text>
            )}
          </View>

          {lineItems?.filter(item => item.description && item.description.trim()).map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, settings?.showDiscount ? styles.colDescriptionWithDiscount : styles.colDescription]}>
                {item.description}
              </Text>
              <Text style={[styles.tableCell, settings?.showDiscount ? styles.colQuantityWithDiscount : styles.colQuantity]}>
                {item.quantity || 0}
              </Text>
              {config.showPrices && (
                <Text style={[styles.tableCell, settings?.showDiscount ? styles.colUnitPriceWithDiscount : styles.colUnitPrice]}>
                  {(item.unitPrice || 0).toFixed(2)} {currencySymbol}
                </Text>
              )}
              {settings?.showDiscount && config.showPrices && (
                <Text style={[styles.tableCell, styles.colDiscountWithDiscount]}>
                  {item.discount || 0}%
                </Text>
              )}
              {config.showVat && config.showPrices && (
                <Text style={[styles.tableCell, settings?.showDiscount ? styles.colVatWithDiscount : styles.colVat]}>
                  {item.vatRate || 0}%
                </Text>
              )}
              {config.showPrices && (
                <Text style={[styles.tableCell, settings?.showDiscount ? styles.colTotalWithDiscount : styles.colTotal]}>
                  {(item.total || 0).toFixed(2)} {currencySymbol}
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Totals - only for documents with prices */}
        {config.showTotal && (
          <View style={styles.totalsSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Sous-total HT:</Text>
              <Text style={styles.totalValue}>{subtotalHT.toFixed(2)} {currencySymbol}</Text>
            </View>
            {config.showVat && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>TVA:</Text>
                <Text style={styles.totalValue}>{totalVAT.toFixed(2)} {currencySymbol}</Text>
              </View>
            )}
            
            {/* Custom taxes */}
            {customTaxes.map((tax) => (
              <View key={tax.id} style={styles.customTaxRow}>
                <Text style={styles.totalLabel}>
                  {tax.name} ({tax.type === 'percentage' ? `${tax.value}%` : `${tax.value} ${currencySymbol}`}):
                </Text>
                <Text style={styles.totalValue}>{tax.amount.toFixed(2)} {currencySymbol}</Text>
              </View>
            ))}
            
            <View style={styles.grandTotal}>
              <Text style={styles.grandTotalText}>TOTAL TTC:</Text>
              <Text style={styles.grandTotalText}>{totalTTC.toFixed(2)} {currencySymbol}</Text>
            </View>
          </View>
        )}

        {/* Amount in words - only for invoices and credits */}
        {(documentType === 'FACTURE' || documentType === 'AVOIR') && config.showTotal && (
          <View style={styles.amountInWords}>
            <Text style={{ fontSize: 10, color: '#666666', fontStyle: 'italic' }}>
              {numberToWords(totalTTC, currencyCode)}
            </Text>
          </View>
        )}

        {/* Signature */}
        {isSigned && company?.signature_url && (
          <View style={styles.signature}>
            <Text style={styles.signatureLabel}>Signature de l'entreprise</Text>
            <Image style={styles.signatureImage} src={company.signature_url} />
          </View>
        )}

        {/* Notes */}
        {documentData?.notes && documentData.notes.trim() && (
          <View style={styles.notes}>
            <Text style={styles.sectionTitle}>NOTES :</Text>
            <Text>{documentData.notes}</Text>
          </View>
        )}

        {/* Footer */}
        {settings?.footer_content && settings?.footer_content.trim() && 
         (settings?.footer_display === 'all' || 
          (settings?.footer_display === 'invoices_only' && documentType === 'FACTURE')) && (
          <View style={styles.footer} fixed>
            <Text>{settings.footer_content}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};