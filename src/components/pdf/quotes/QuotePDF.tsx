
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
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
  validitySection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#FEF3C7',
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    fontSize: 8,
    color: '#666666',
    textAlign: 'center',
  },
  notes: {
    marginTop: 20,
    fontSize: 9,
    color: '#666666',
    lineHeight: 1.4,
  },
});

interface QuotePDFProps {
  quoteData: any;
  lineItems: any[];
  client: any;
  company: any;
  settings: any;
}

export const QuotePDF = ({
  quoteData,
  lineItems,
  client,
  company,
  settings
}: QuotePDFProps) => {
  const calculateTotals = () => {
    const subtotalHT = lineItems.reduce((sum, item) => sum + item.total, 0);
    const totalVAT = lineItems.reduce((sum, item) => {
      return sum + (item.total * item.vatRate / 100);
    }, 0);
    const totalTTC = subtotalHT + totalVAT;

    return { subtotalHT, totalVAT, totalTTC };
  };

  const { subtotalHT, totalVAT, totalTTC } = calculateTotals();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
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
          <View>
            <Text style={styles.documentTitle}>DEVIS</Text>
            <Text style={styles.documentNumber}>N° {quoteData?.number}</Text>
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
            {settings?.showVat && (
              <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>TVA</Text>
            )}
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>TOTAL HT</Text>
          </View>

          {lineItems?.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 3 }]}>{item.description}</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>
                {item.unitPrice?.toFixed(2)} €
              </Text>
              {settings?.showVat && (
                <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>
                  {item.vatRate}%
                </Text>
              )}
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>
                {item.total?.toFixed(2)} €
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Sous-total HT:</Text>
            <Text style={styles.totalValue}>{subtotalHT.toFixed(2)} €</Text>
          </View>
          {settings?.showVat && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TVA:</Text>
              <Text style={styles.totalValue}>{totalVAT.toFixed(2)} €</Text>
            </View>
          )}
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalText}>TOTAL TTC:</Text>
            <Text style={styles.grandTotalText}>{totalTTC.toFixed(2)} €</Text>
          </View>
        </View>

        {/* Validity Section */}
        <View style={styles.validitySection}>
          <Text style={styles.sectionTitle}>VALIDITÉ DU DEVIS :</Text>
          <Text style={styles.clientInfo}>
            Ce devis est valable jusqu'au {quoteData?.validUntil ? new Date(quoteData.validUntil).toLocaleDateString('fr-FR') : 'Non spécifiée'}
          </Text>
        </View>

        {/* Notes */}
        {quoteData?.notes && (
          <View style={styles.notes}>
            <Text style={styles.sectionTitle}>NOTES :</Text>
            <Text>{quoteData.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>{settings?.footer_content || 'Soft Facture - Merci pour votre confiance'}</Text>
        </View>
      </Page>
    </Document>
  );
};
