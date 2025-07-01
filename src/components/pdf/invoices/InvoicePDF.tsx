import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { TaxCalculation } from '@/utils/customTaxCalculations';
import { numberToWords } from '@/utils/numberToWords';

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
  customTaxLabel: {
    fontSize: 10,
    color: '#D96C4F',
  },
  customTaxValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#D96C4F',
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

interface InvoicePDFProps {
  invoiceData: any;
  lineItems: any[];
  client: any;
  company: any;
  settings: any;
  currency?: { code: string; symbol: string; name: string };
  customTaxes?: TaxCalculation[];
}

export const InvoicePDF = ({
  invoiceData,
  lineItems,
  client,
  company,
  settings,
  currency,
  customTaxes = []
}: InvoicePDFProps) => {
  const currencySymbol = currency?.symbol || '€';
  
  const calculateTotals = () => {
    const subtotalHT = lineItems.reduce((sum, item) => sum + (item.total || 0), 0);
    const totalVAT = lineItems.reduce((sum, item) => {
      return sum + ((item.total || 0) * (item.vatRate || 0) / 100);
    }, 0);
    
    // Calcul du total des taxes personnalisées
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
                {company?.name || 'Soft Facture'}
              </Text>
              <Text style={styles.companyDetails}>
                {company?.address || 'Adresse de l\'entreprise'}
              </Text>
              <Text style={styles.companyDetails}>
                {company?.email || 'contact@softfacture.fr'}
              </Text>
              <Text style={styles.companyDetails}>
                {company?.phone || 'Téléphone'}
              </Text>
            </View>
          </View>
          
          <View style={styles.rightSection}>
            <Text style={styles.documentTitle}>FACTURE</Text>
            <View style={styles.documentInfo}>
              <Text style={styles.documentNumber}>N° {invoiceData?.number || 'N/A'}</Text>
              <Text style={styles.documentDate}>
                Date: {new Date(invoiceData?.date || Date.now()).toLocaleDateString('fr-FR')}
              </Text>
              {invoiceData?.dueDate && (
                <Text style={styles.documentDate}>
                  Échéance: {new Date(invoiceData.dueDate).toLocaleDateString('fr-FR')}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Client Section */}
        <View style={styles.clientSection}>
          <Text style={styles.sectionTitle}>FACTURER À :</Text>
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

          {lineItems?.filter(item => item.description && item.description.trim()).map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 3 }]}>{item.description}</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>{item.quantity || 0}</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>
                {(item.unitPrice || 0).toFixed(2)} {currencySymbol}
              </Text>
              {settings?.showVat && (
                <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>
                  {item.vatRate || 0}%
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
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Sous-total HT:</Text>
            <Text style={styles.totalValue}>{subtotalHT.toFixed(2)} {currencySymbol}</Text>
          </View>
          {settings?.showVat && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TVA:</Text>
              <Text style={styles.totalValue}>{totalVAT.toFixed(2)} {currencySymbol}</Text>
            </View>
          )}
          
          {/* Affichage des taxes personnalisées */}
          {customTaxes.map((tax) => (
            <View key={tax.id} style={styles.customTaxRow}>
              <Text style={styles.customTaxLabel}>
                {tax.name} ({tax.type === 'percentage' ? `${tax.value}%` : `${tax.value} ${currencySymbol}`}):
              </Text>
              <Text style={styles.customTaxValue}>{tax.amount.toFixed(2)} {currencySymbol}</Text>
            </View>
          ))}
          
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalText}>TOTAL TTC:</Text>
            <Text style={styles.grandTotalText}>{totalTTC.toFixed(2)} {currencySymbol}</Text>
          </View>
        </View>

        {/* Montant en toutes lettres */}
        <View style={{ marginTop: 15, padding: 10, backgroundColor: '#F8F9FA', borderRadius: 5 }}>
          <Text style={{ fontSize: 10, color: '#666666', fontStyle: 'italic', textAlign: 'center' }}>
            {numberToWords(totalTTC)}
          </Text>
        </View>

        {/* Notes */}
        {invoiceData?.notes && invoiceData.notes.trim() && (
          <View style={styles.notes}>
            <Text style={styles.sectionTitle}>NOTES :</Text>
            <Text>{invoiceData.notes}</Text>
          </View>
        )}

        {/* Footer fixe en bas de page - only show if footer_content exists and footer_display allows it */}
        {settings?.footer_content && settings?.footer_content.trim() && 
         (settings?.footer_display === 'all' || settings?.footer_display === 'invoices_only') && (
          <View style={styles.footer} fixed>
            <Text>{settings.footer_content}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};
