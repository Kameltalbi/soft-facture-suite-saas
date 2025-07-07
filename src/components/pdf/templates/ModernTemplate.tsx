
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  discount: number;
  total: number;
}

interface ModernTemplateProps {
  invoiceData: any;
  lineItems: LineItem[];
  client: any;
  company: any;
  settings: any;
  documentType?: string;
  customTaxes?: any[];
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 25,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 35,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  logo: {
    width: 90,
    height: 70,
    objectFit: 'contain',
  },
  companyInfo: {
    alignItems: 'flex-start',
    maxWidth: 280,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 8,
    letterSpacing: 1,
  },
  companyText: {
    fontSize: 9,
    color: '#4B5563',
    marginBottom: 2,
    lineHeight: 1.4,
  },
  documentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 8,
  },
  clientInfo: {
    maxWidth: 280,
    flex: 1,
  },
  invoiceDetails: {
    alignItems: 'flex-end',
    maxWidth: 220,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  text: {
    fontSize: 9,
    color: '#374151',
    marginBottom: 3,
    lineHeight: 1.3,
  },
  table: {
    marginTop: 25,
    marginBottom: 25,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    padding: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    padding: 12,
    minHeight: 32,
    backgroundColor: '#FFFFFF',
  },
  tableRowAlt: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    padding: 12,
    minHeight: 32,
    backgroundColor: '#F8FAFC',
  },
  // Colonnes sans remise
  tableCol1: { width: '50%', color: '#374151' },
  tableCol2: { width: '10%', textAlign: 'center', color: '#374151' },
  tableCol3: { width: '15%', textAlign: 'right', color: '#374151' },
  tableCol4: { width: '10%', textAlign: 'center', color: '#374151' },
  tableCol5: { width: '15%', textAlign: 'right', color: '#374151', fontWeight: 'bold' },
  // Colonnes avec remise (largeurs ajustées)
  tableCol1WithDiscount: { width: '40%', color: '#374151' },
  tableCol2WithDiscount: { width: '8%', textAlign: 'center', color: '#374151' },
  tableCol3WithDiscount: { width: '12%', textAlign: 'right', color: '#374151' },
  tableCol4WithDiscount: { width: '8%', textAlign: 'center', color: '#374151' },
  tableCol5WithDiscount: { width: '8%', textAlign: 'center', color: '#374151' },
  tableCol6WithDiscount: { width: '12%', textAlign: 'right', color: '#374151', fontWeight: 'bold' },
  totalsSection: {
    marginTop: 25,
    alignItems: 'flex-end',
  },
  totalsContainer: {
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: 250,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 10,
    color: '#4B5563',
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 10,
    color: '#374151',
    fontWeight: 'bold',
  },
  totalFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 2,
    borderTopColor: '#3B82F6',
    marginTop: 15,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  totalFinalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  totalFinalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 25,
    right: 25,
    textAlign: 'center',
    fontSize: 8,
    color: '#6B7280',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 15,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  notes: {
    marginTop: 25,
    padding: 18,
    backgroundColor: '#FEF3C7',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    borderRadius: 6,
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 9,
    color: '#92400E',
    lineHeight: 1.4,
  },
  subjectContainer: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  subjectText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
});

export const ModernTemplate: React.FC<ModernTemplateProps> = ({
  invoiceData,
  lineItems,
  client,
  company,
  settings,
  documentType = 'FACTURE',
  customTaxes = []
}) => {
  console.log('🎨 MODERN TEMPLATE APPELÉ !!! Settings:', settings);
  console.log('🎨 MODERN TEMPLATE showDiscount:', settings?.showDiscount);
  console.log('🎨 ModernTemplate - Taxes reçues:', customTaxes);
  
  const calculateTotals = () => {
    const subtotalHT = lineItems.reduce((sum, item) => sum + item.total, 0);
    const totalVAT = lineItems.reduce((sum, item) => {
      return sum + (item.total * item.vatRate / 100);
    }, 0);
    
    // Ajout des taxes personnalisées
    const customTaxesTotal = customTaxes.reduce((sum, tax) => sum + tax.amount, 0);
    const totalTTC = subtotalHT + totalVAT + customTaxesTotal;

    return { subtotalHT, totalVAT, totalTTC, customTaxesTotal };
  };

  const { subtotalHT, totalVAT, totalTTC, customTaxesTotal } = calculateTotals();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.title}>{documentType}</Text>
            <Text style={[styles.companyText, { fontWeight: 'bold', fontSize: 11, marginBottom: 5 }]}>
              {company.name}
            </Text>
            {company.address && <Text style={styles.companyText}>{company.address}</Text>}
            {company.email && <Text style={styles.companyText}>✉ {company.email}</Text>}
            {company.phone && <Text style={styles.companyText}>☎ {company.phone}</Text>}
          </View>
          <View>
            {company.logo && (
              <Image style={styles.logo} src={company.logo} />
            )}
          </View>
        </View>

        {/* Document Info */}
        <View style={styles.documentInfo}>
          <View style={styles.clientInfo}>
            <Text style={styles.sectionTitle}>Client</Text>
            <Text style={[styles.text, { fontWeight: 'bold', fontSize: 10 }]}>{client.name}</Text>
            {client.company && client.company !== client.name && (
              <Text style={styles.text}>{client.company}</Text>
            )}
            {client.address && <Text style={styles.text}>{client.address}</Text>}
            {client.email && <Text style={styles.text}>✉ {client.email}</Text>}
          </View>
          <View style={styles.invoiceDetails}>
            <Text style={[styles.text, { fontWeight: 'bold' }]}>N° {invoiceData.number}</Text>
            <Text style={styles.text}>Date : {new Date(invoiceData.date).toLocaleDateString('fr-FR')}</Text>
            {invoiceData.dueDate && (
              <Text style={styles.text}>Échéance : {new Date(invoiceData.dueDate).toLocaleDateString('fr-FR')}</Text>
            )}
          </View>
        </View>

        {invoiceData.subject && (
          <View style={styles.subjectContainer}>
            <Text style={styles.subjectText}>Objet : {invoiceData.subject}</Text>
          </View>
        )}

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={settings?.showDiscount ? styles.tableCol1WithDiscount : styles.tableCol1}>Description</Text>
            <Text style={settings?.showDiscount ? styles.tableCol2WithDiscount : styles.tableCol2}>Qté</Text>
            <Text style={settings?.showDiscount ? styles.tableCol3WithDiscount : styles.tableCol3}>Prix unit.</Text>
            {true && <Text style={styles.tableCol4WithDiscount}>Remise</Text>}
            <Text style={settings?.showDiscount ? styles.tableCol5WithDiscount : styles.tableCol4}>TVA</Text>
            <Text style={settings?.showDiscount ? styles.tableCol6WithDiscount : styles.tableCol5}>Total</Text>
          </View>
          
          {lineItems.map((item, index) => (
            <View key={item.id} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
              <Text style={settings?.showDiscount ? styles.tableCol1WithDiscount : styles.tableCol1}>{item.description}</Text>
              <Text style={settings?.showDiscount ? styles.tableCol2WithDiscount : styles.tableCol2}>{item.quantity}</Text>
              <Text style={settings?.showDiscount ? styles.tableCol3WithDiscount : styles.tableCol3}>{item.unitPrice.toFixed(2)} €</Text>
              {true && <Text style={styles.tableCol4WithDiscount}>{item.discount || 0}%</Text>}
              <Text style={settings?.showDiscount ? styles.tableCol5WithDiscount : styles.tableCol4}>{item.vatRate}%</Text>
              <Text style={settings?.showDiscount ? styles.tableCol6WithDiscount : styles.tableCol5}>{item.total.toFixed(2)} €</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Sous-total HT :</Text>
              <Text style={styles.totalValue}>{subtotalHT.toFixed(2)} €</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TVA :</Text>
              <Text style={styles.totalValue}>{totalVAT.toFixed(2)} €</Text>
            </View>
            {customTaxes.length > 0 && customTaxes.map((tax, index) => (
              <View key={index} style={styles.totalRow}>
                <Text style={styles.totalLabel}>{tax.name} :</Text>
                <Text style={styles.totalValue}>{tax.amount.toFixed(2)} €</Text>
              </View>
            ))}
            <View style={styles.totalFinal}>
              <Text style={styles.totalFinalLabel}>TOTAL TTC :</Text>
              <Text style={styles.totalFinalValue}>{totalTTC.toFixed(2)} €</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {invoiceData.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesTitle}>Notes :</Text>
            <Text style={styles.notesText}>{invoiceData.notes}</Text>
          </View>
        )}

        {/* Footer */}
        {settings.footer_content && (
          <View style={styles.footer}>
            <Text>{settings.footer_content}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};
