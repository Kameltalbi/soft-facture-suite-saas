
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
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    backgroundColor: '#1F2937',
    padding: 20,
    borderRadius: 8,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  companyText: {
    fontSize: 10,
    color: '#E5E7EB',
    marginBottom: 3,
  },
  documentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  clientInfo: {
    maxWidth: 250,
    backgroundColor: '#F9FAFB',
    padding: 15,
    borderRadius: 8,
  },
  invoiceDetails: {
    alignItems: 'flex-end',
    maxWidth: 200,
    backgroundColor: '#EFF6FF',
    padding: 15,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  text: {
    fontSize: 10,
    color: '#374151',
    marginBottom: 3,
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    padding: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    padding: 12,
    minHeight: 35,
    backgroundColor: '#FAFAFA',
  },
  tableRowAlt: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    padding: 12,
    minHeight: 35,
    backgroundColor: '#FFFFFF',
  },
  tableCol1: { width: '50%' },
  tableCol2: { width: '10%', textAlign: 'center' },
  tableCol3: { width: '15%', textAlign: 'right' },
  tableCol4: { width: '10%', textAlign: 'center' },
  tableCol5: { width: '15%', textAlign: 'right' },
  totalsSection: {
    marginTop: 20,
    alignItems: 'flex-end',
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 250,
    paddingVertical: 3,
  },
  totalFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 250,
    paddingVertical: 8,
    borderTopWidth: 2,
    borderTopColor: '#1F2937',
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#1F2937',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#6B7280',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
  notes: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#FEF3C7',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    borderRadius: 4,
  },
  amountInWords: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    fontStyle: 'italic',
    color: '#1E40AF',
  },
});

const numberToWords = (num: number): string => {
  if (num === 0) return 'zéro';
  return `${Math.floor(num)} euros et ${Math.round((num % 1) * 100)} centimes`;
};

export const ModernTemplate: React.FC<ModernTemplateProps> = ({
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
            <Text style={styles.companyText}>{company.name}</Text>
            {company.address && <Text style={styles.companyText}>{company.address}</Text>}
            {company.email && <Text style={styles.companyText}>{company.email}</Text>}
            {company.phone && <Text style={styles.companyText}>{company.phone}</Text>}
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
          <View style={{ marginBottom: 20, padding: 10, backgroundColor: '#F3F4F6', borderRadius: 4 }}>
            <Text style={[styles.text, { fontWeight: 'bold' }]}>Objet : {invoiceData.subject}</Text>
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
          
          {lineItems.map((item, index) => (
            <View key={item.id} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
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
            <Text>Sous-total HT :</Text>
            <Text>{subtotalHT.toFixed(2)} {settings.currency}</Text>
          </View>
          {settings.showVat && (
            <View style={styles.totalRow}>
              <Text>TVA :</Text>
              <Text>{totalVAT.toFixed(2)} {settings.currency}</Text>
            </View>
          )}
          <View style={styles.totalFinal}>
            <Text>TOTAL TTC :</Text>
            <Text>{totalTTC.toFixed(2)} {settings.currency}</Text>
          </View>
        </View>

        {/* Amount in words */}
        {settings.amountInWords && (
          <View style={styles.amountInWords}>
            <Text style={[styles.text, { fontWeight: 'bold' }]}>Montant en lettres :</Text>
            <Text style={styles.text}>{numberToWords(totalTTC)}</Text>
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
        <View style={styles.footer}>
          <Text>{company.name} • {documentType}</Text>
          {settings.footer_content && <Text>{settings.footer_content}</Text>}
        </View>
      </Page>
    </Document>
  );
};
