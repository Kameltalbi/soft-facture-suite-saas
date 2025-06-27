
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

interface MinimalTemplateProps {
  invoiceData: any;
  lineItems: LineItem[];
  client: any;
  company: any;
  settings: any;
  documentType?: string;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  logo: {
    width: 80,
    height: 60,
    objectFit: 'contain',
  },
  companyInfo: {
    alignItems: 'flex-end',
    maxWidth: 200,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  text: {
    fontSize: 10,
    color: '#000000',
    marginBottom: 2,
    lineHeight: 1.3,
  },
  documentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  clientInfo: {
    maxWidth: 250,
  },
  invoiceDetails: {
    alignItems: 'flex-end',
    maxWidth: 200,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  table: {
    marginTop: 30,
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    paddingBottom: 8,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    minHeight: 25,
  },
  tableCol1: { width: '50%' },
  tableCol2: { width: '10%', textAlign: 'center' },
  tableCol3: { width: '15%', textAlign: 'right' },
  tableCol4: { width: '10%', textAlign: 'center' },
  tableCol5: { width: '15%', textAlign: 'right' },
  totalsSection: {
    marginTop: 30,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    paddingVertical: 2,
  },
  totalFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    paddingVertical: 6,
    borderTopWidth: 2,
    borderTopColor: '#000000',
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#666666',
  },
  notes: {
    marginTop: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
  },
  amountInWords: {
    marginTop: 20,
    fontSize: 9,
    fontStyle: 'italic',
    color: '#666666',
  },
});

const numberToWords = (num: number): string => {
  if (num === 0) return 'zéro';
  return `${Math.floor(num)} euros et ${Math.round((num % 1) * 100)} centimes`;
};

export const MinimalTemplate: React.FC<MinimalTemplateProps> = ({
  invoiceData,
  lineItems,
  client,
  company,
  settings,
  documentType = 'FACTURE'
}) => {
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
          <View>
            {company.logo && (
              <Image style={styles.logo} src={company.logo} />
            )}
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.title}>{documentType}</Text>
            <Text style={styles.text}>{company.name}</Text>
            {company.address && <Text style={styles.text}>{company.address}</Text>}
            {company.email && <Text style={styles.text}>{company.email}</Text>}
            {company.phone && <Text style={styles.text}>{company.phone}</Text>}
          </View>
        </View>

        {/* Document Info */}
        <View style={styles.documentInfo}>
          <View style={styles.clientInfo}>
            <Text style={styles.sectionTitle}>À</Text>
            <Text style={styles.text}>{client.name}</Text>
            {client.company && client.company !== client.name && (
              <Text style={styles.text}>{client.company}</Text>
            )}
            {client.address && <Text style={styles.text}>{client.address}</Text>}
            {client.email && <Text style={styles.text}>{client.email}</Text>}
          </View>
          <View style={styles.invoiceDetails}>
            <Text style={styles.text}>{documentType} #{invoiceData.number}</Text>
            <Text style={styles.text}>{new Date(invoiceData.date).toLocaleDateString('fr-FR')}</Text>
            {invoiceData.dueDate && (
              <Text style={styles.text}>Échéance: {new Date(invoiceData.dueDate).toLocaleDateString('fr-FR')}</Text>
            )}
          </View>
        </View>

        {invoiceData.subject && (
          <View style={{ marginBottom: 30 }}>
            <Text style={[styles.text, { fontWeight: 'bold' }]}>{invoiceData.subject}</Text>
          </View>
        )}

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCol1}>Description</Text>
            <Text style={styles.tableCol2}>Qté</Text>
            <Text style={styles.tableCol3}>Prix unit.</Text>
            {settings.showVat && <Text style={styles.tableCol4}>TVA</Text>}
            <Text style={styles.tableCol5}>Total</Text>
          </View>
          
          {lineItems.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.tableCol1}>{item.description}</Text>
              <Text style={styles.tableCol2}>{item.quantity}</Text>
              <Text style={styles.tableCol3}>{item.unitPrice.toFixed(2)} {settings.currency}</Text>
              {settings.showVat && <Text style={styles.tableCol4}>{item.vatRate}%</Text>}
              <Text style={styles.tableCol5}>{item.total.toFixed(2)} {settings.currency}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text>Sous-total HT</Text>
            <Text>{subtotalHT.toFixed(2)} {settings.currency}</Text>
          </View>
          {settings.showVat && (
            <View style={styles.totalRow}>
              <Text>TVA</Text>
              <Text>{totalVAT.toFixed(2)} {settings.currency}</Text>
            </View>
          )}
          <View style={styles.totalFinal}>
            <Text>TOTAL</Text>
            <Text>{totalTTC.toFixed(2)} {settings.currency}</Text>
          </View>
        </View>

        {/* Amount in words */}
        {settings.amountInWords && (
          <View style={styles.amountInWords}>
            <Text>{numberToWords(totalTTC)}</Text>
          </View>
        )}

        {/* Notes */}
        {invoiceData.notes && (
          <View style={styles.notes}>
            <Text style={styles.text}>{invoiceData.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>{company.name}</Text>
          {settings.footer_content && <Text>{settings.footer_content}</Text>}
        </View>
      </Page>
    </Document>
  );
};
