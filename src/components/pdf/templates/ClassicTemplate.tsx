
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

interface ClassicTemplateProps {
  invoiceData: any;
  lineItems: LineItem[];
  client: any;
  company: any;
  settings: any;
  documentType?: string;
  customTaxes?: any[];
  isSigned?: boolean;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 11,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 60,
    objectFit: 'contain',
  },
  companyInfo: {
    alignItems: 'flex-start',
    maxWidth: 250,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  companyText: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 3,
  },
  documentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  clientInfo: {
    maxWidth: 250,
  },
  invoiceDetails: {
    alignItems: 'flex-end',
    maxWidth: 200,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  text: {
    fontSize: 10,
    color: '#333333',
    marginBottom: 3,
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    padding: 10,
    minHeight: 30,
  },
  // Colonnes sans remise
  tableCol1: { width: '50%' },
  tableCol2: { width: '10%', textAlign: 'center' },
  tableCol3: { width: '15%', textAlign: 'right' },
  tableCol4: { width: '10%', textAlign: 'center' },
  tableCol5: { width: '15%', textAlign: 'right' },
  // Colonnes avec remise (largeurs ajustées)
  tableCol1WithDiscount: { width: '40%' },
  tableCol2WithDiscount: { width: '8%', textAlign: 'center' },
  tableCol3WithDiscount: { width: '12%', textAlign: 'right' },
  tableCol4WithDiscount: { width: '8%', textAlign: 'center' },
  tableCol5WithDiscount: { width: '8%', textAlign: 'center' },
  tableCol6WithDiscount: { width: '12%', textAlign: 'right' },
  totalsSection: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    paddingVertical: 3,
  },
  totalFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    paddingVertical: 5,
    borderTopWidth: 2,
    borderTopColor: '#333333',
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#666666',
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    paddingTop: 10,
  },
  notes: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderLeftWidth: 3,
    borderLeftColor: '#666666',
  },
  signature: {
    marginTop: 56, // 2cm en dessous (environ 56 points)
    alignItems: 'center',
    maxWidth: 170, // Largeur max de 6cm (environ 170 points)
  },
  signatureLabel: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 10,
    textAlign: 'center',
  },
  signatureImage: {
    maxWidth: 170, // 6cm max
    maxHeight: 85, // Hauteur proportionnelle
    objectFit: 'contain',
  },
});

export const ClassicTemplate: React.FC<ClassicTemplateProps> = ({
  invoiceData,
  lineItems,
  client,
  company,
  settings,
  documentType = 'FACTURE',
  customTaxes = [],
  isSigned = false
}) => {
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
            <Text style={styles.companyText}>{company.name}</Text>
            {company.address && <Text style={styles.companyText}>{company.address}</Text>}
            {company.email && <Text style={styles.companyText}>{company.email}</Text>}
            {company.phone && <Text style={styles.companyText}>{company.phone}</Text>}
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
            <Text style={styles.sectionTitle}>FACTURÉ À :</Text>
            <Text style={styles.text}>{client.name}</Text>
            {client.company && client.company !== client.name && (
              <Text style={styles.text}>{client.company}</Text>
            )}
            {client.address && <Text style={styles.text}>{client.address}</Text>}
            {client.email && <Text style={styles.text}>{client.email}</Text>}
          </View>
          <View style={styles.invoiceDetails}>
            <Text style={styles.text}>{documentType} N° : {invoiceData.number}</Text>
            <Text style={styles.text}>Date : {new Date(invoiceData.date).toLocaleDateString('fr-FR')}</Text>
            {invoiceData.dueDate && (
              <Text style={styles.text}>Échéance : {new Date(invoiceData.dueDate).toLocaleDateString('fr-FR')}</Text>
            )}
          </View>
        </View>

        {invoiceData.subject && (
          <View style={{ marginBottom: 20 }}>
            <Text style={[styles.text, { fontWeight: 'bold' }]}>Objet : {invoiceData.subject}</Text>
          </View>
        )}

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={settings?.showDiscount ? styles.tableCol1WithDiscount : styles.tableCol1}>Description</Text>
            <Text style={settings?.showDiscount ? styles.tableCol2WithDiscount : styles.tableCol2}>Qté</Text>
            <Text style={settings?.showDiscount ? styles.tableCol3WithDiscount : styles.tableCol3}>Prix unit.</Text>
            {settings?.showDiscount && <Text style={styles.tableCol4WithDiscount}>Remise</Text>}
            <Text style={settings?.showDiscount ? styles.tableCol5WithDiscount : styles.tableCol4}>TVA</Text>
            <Text style={settings?.showDiscount ? styles.tableCol6WithDiscount : styles.tableCol5}>Total</Text>
          </View>
          
          {lineItems.map((item, index) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={settings?.showDiscount ? styles.tableCol1WithDiscount : styles.tableCol1}>{item.description}</Text>
              <Text style={settings?.showDiscount ? styles.tableCol2WithDiscount : styles.tableCol2}>{item.quantity}</Text>
              <Text style={settings?.showDiscount ? styles.tableCol3WithDiscount : styles.tableCol3}>{item.unitPrice.toFixed(2)} €</Text>
              {settings?.showDiscount && <Text style={styles.tableCol4WithDiscount}>{item.discount || 0}%</Text>}
              <Text style={settings?.showDiscount ? styles.tableCol5WithDiscount : styles.tableCol4}>{item.vatRate}%</Text>
              <Text style={settings?.showDiscount ? styles.tableCol6WithDiscount : styles.tableCol5}>{item.total.toFixed(2)} €</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text>Sous-total HT :</Text>
            <Text>{subtotalHT.toFixed(2)} €</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>TVA :</Text>
            <Text>{totalVAT.toFixed(2)} €</Text>
          </View>
          {customTaxes.length > 0 && customTaxes.map((tax, index) => (
            <View key={index} style={styles.totalRow}>
              <Text>{tax.name} :</Text>
              <Text>{tax.amount.toFixed(2)} €</Text>
            </View>
          ))}
          <View style={styles.totalFinal}>
            <Text>TOTAL TTC :</Text>
            <Text>{totalTTC.toFixed(2)} €</Text>
          </View>
        </View>

        {/* Signature */}
        {isSigned && company.signature_url && (
          <View style={styles.signature}>
            <Text style={styles.signatureLabel}>Signature de l'entreprise</Text>
            <Image style={styles.signatureImage} src={company.signature_url} />
          </View>
        )}

        {/* Notes */}
        {invoiceData.notes && (
          <View style={styles.notes}>
            <Text style={[styles.text, { fontWeight: 'bold', marginBottom: 5 }]}>Notes :</Text>
            <Text style={styles.text}>{invoiceData.notes}</Text>
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
