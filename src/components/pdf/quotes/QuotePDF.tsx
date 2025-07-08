
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    paddingBottom: 45, // Espace pour le pied de page fixe
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#8B5CF6',
  },
  companyInfo: {
    flex: 1,
  },
  companyLogoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  companyLogo: {
    width: 80,
    height: 40,
    marginRight: 15,
    objectFit: 'contain',
  },
  companyDetails: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5CF6',
    textAlign: 'right',
    marginBottom: 10,
  },
  documentNumber: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'right',
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
    backgroundColor: '#8B5CF6',
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
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    backgroundColor: '#8B5CF6',
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
    bottom: 15, // 1,5 cm = environ 42 points, on met 15 pour être dans la marge
    left: 30,
    right: 30,
    fontSize: 8,
    color: '#666666',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
  },
});

interface QuotePDFProps {
  quoteData: any;
  lineItems: any[];
  client: any;
  company: any;
  settings: any;
  currency?: { code: string; symbol: string; name: string };
  showDiscount?: boolean;
  showVat?: boolean;
}

export const QuotePDF = ({
  quoteData,
  lineItems,
  client,
  company,
  settings,
  currency,
  showDiscount = true,
  showVat = true
}: QuotePDFProps) => {
  const currencySymbol = currency?.symbol || '€';
  
  const calculateTotals = () => {
    const subtotalBeforeDiscount = lineItems.reduce((sum, item) => {
      return sum + ((item.quantity || 0) * (item.unitPrice || 0));
    }, 0);
    
    const totalDiscount = lineItems.reduce((sum, item) => {
      const itemSubtotal = (item.quantity || 0) * (item.unitPrice || 0);
      const discountAmount = itemSubtotal * ((item.discount || 0) / 100);
      return sum + discountAmount;
    }, 0);
    
    const subtotalHT = lineItems.reduce((sum, item) => sum + (item.total || 0), 0);
    const totalVAT = lineItems.reduce((sum, item) => {
      return sum + ((item.total || 0) * (item.vatRate || 0) / 100);
    }, 0);
    const totalTTC = subtotalHT + totalVAT;

    return { subtotalBeforeDiscount, totalDiscount, subtotalHT, totalVAT, totalTTC };
  };

  const { subtotalBeforeDiscount, totalDiscount, subtotalHT, totalVAT, totalTTC } = calculateTotals();

  // Debug: log the settings to see what's being passed
  console.log('QuotePDF settings:', settings);
  console.log('Footer content:', settings?.footer_content);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <View style={styles.companyLogoSection}>
              {company?.logo_url && (
                <Image
                  style={styles.companyLogo}
                  src={company.logo_url}
                />
              )}
              <View style={styles.companyDetails}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>
                  {company?.name || 'Soft Facture'}
                </Text>
                <Text style={{ fontSize: 10, color: '#666666', lineHeight: 1.4 }}>
                  {company?.address || 'Adresse de l\'entreprise'}
                </Text>
                <Text style={{ fontSize: 10, color: '#666666' }}>
                  {company?.email || 'contact@softfacture.fr'}
                </Text>
                <Text style={{ fontSize: 10, color: '#666666' }}>
                  {company?.phone || 'Téléphone'}
                </Text>
              </View>
            </View>
          </View>
          <View>
            <Text style={styles.documentTitle}>DEVIS</Text>
            <Text style={styles.documentNumber}>N° {quoteData?.number || 'N/A'}</Text>
            <Text style={styles.documentNumber}>
              Date: {new Date(quoteData?.date || Date.now()).toLocaleDateString('fr-FR')}
            </Text>
          </View>
        </View>

        {/* Client Section */}
        <View style={styles.clientSection}>
          <Text style={styles.sectionTitle}>DEVIS POUR :</Text>
          <Text style={styles.clientInfo}>
            {client?.company || client?.name || 'Nom du client'}
          </Text>
          <Text style={styles.clientInfo}>
            {client?.address || 'Adresse du client'}
          </Text>
          <Text style={styles.clientInfo}>
            {client?.email || 'Email du client'}
          </Text>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 3 }]}>DESCRIPTION</Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>QTÉ</Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>P.U. HT</Text>
            {showDiscount && (
              <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>REMISE %</Text>
            )}
            {showVat && (
              <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>TVA</Text>
            )}
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>TOTAL HT</Text>
          </View>

          {lineItems?.filter(item => item.description && item.description.trim()).map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 3 }]}>{item.description}</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>{item.quantity || 0}</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>
                {(item.unitPrice || 0).toFixed(2)} {currencySymbol}
              </Text>
              {showDiscount && (
                <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>
                  {(item.discount || 0).toFixed(0)}%
                </Text>
              )}
              {showVat && (
                <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>
                  {(item.vatRate || 0).toFixed(0)}%
                </Text>
              )}
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>
                {(item.total || 0).toFixed(2)} {currencySymbol}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          {totalDiscount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Sous-total HT:</Text>
              <Text style={styles.totalValue}>{subtotalBeforeDiscount.toFixed(2)} {currencySymbol}</Text>
            </View>
          )}
          {totalDiscount > 0 && (
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: '#ef4444' }]}>Remise totale:</Text>
              <Text style={[styles.totalValue, { color: '#ef4444' }]}>-{totalDiscount.toFixed(2)} {currencySymbol}</Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{totalDiscount > 0 ? 'Net HT:' : 'Sous-total HT:'}</Text>
            <Text style={styles.totalValue}>{subtotalHT.toFixed(2)} {currencySymbol}</Text>
          </View>
          {showVat && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TVA:</Text>
              <Text style={styles.totalValue}>{totalVAT.toFixed(2)} {currencySymbol}</Text>
            </View>
          )}
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalText}>TOTAL TTC:</Text>
            <Text style={styles.grandTotalText}>{totalTTC.toFixed(2)} {currencySymbol}</Text>
          </View>
        </View>

        {/* Notes */}
        {quoteData?.notes && quoteData.notes.trim() && (
          <View style={styles.notes}>
            <Text style={styles.sectionTitle}>NOTES :</Text>
            <Text>{quoteData.notes}</Text>
          </View>
        )}

        {/* Footer fixe en bas de page - only show if footer_content exists and footer_display allows it */}
        {settings?.footer_content && settings?.footer_content.trim() && 
         (settings?.footer_display === 'all' || settings?.footer_display === undefined) && (
          <View style={styles.footer} fixed>
            <Text>{settings.footer_content}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};
