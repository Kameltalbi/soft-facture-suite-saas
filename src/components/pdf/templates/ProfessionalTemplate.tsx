
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

interface ProfessionalTemplateProps {
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
    padding: 35,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 35,
    paddingBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: '#2563EB',
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 10,
    letterSpacing: 1,
  },
  text: {
    fontSize: 10,
    color: '#1F2937',
    marginBottom: 3,
    lineHeight: 1.4,
  },
  documentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 35,
  },
  clientInfo: {
    maxWidth: 250,
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  invoiceDetails: {
    alignItems: 'flex-end',
    maxWidth: 200,
    backgroundColor: '#EFF6FF',
    padding: 20,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  table: {
    marginTop: 25,
    marginBottom: 25,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    padding: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    padding: 12,
    minHeight: 35,
    backgroundColor: '#FFFFFF',
  },
  tableRowAlt: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    padding: 12,
    minHeight: 35,
    backgroundColor: '#F9FAFB',
  },
  tableCol1: { width: '50%' },
  tableCol2: { width: '10%', textAlign: 'center' },
  tableCol3: { width: '15%', textAlign: 'right' },
  tableCol4: { width: '10%', textAlign: 'center' },
  tableCol5: { width: '15%', textAlign: 'right' },
  totalsSection: {
    marginTop: 25,
    alignItems: 'flex-end',
    backgroundColor: '#F8FAFC',
    padding: 25,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 280,
    paddingVertical: 4,
    fontSize: 11,
  },
  totalFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 280,
    paddingVertical: 10,
    borderTopWidth: 2,
    borderTopColor: '#2563EB',
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#2563EB',
  },
  footer: {
    position: 'absolute',
    bottom: 35,
    left: 35,
    right: 35,
    textAlign: 'center',
    fontSize: 9,
    color: '#6B7280',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 15,
  },
  notes: {
    marginTop: 25,
    padding: 20,
    backgroundColor: '#FEF3C7',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    borderRadius: 6,
  },
  amountInWords: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    fontStyle: 'italic',
    color: '#1E40AF',
    fontSize: 11,
  },
  subjectBox: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#64748B',
  },
});

const numberToWords = (num: number): string => {
  if (num === 0) return 'zéro';
  return `${Math.floor(num)} euros et ${Math.round((num % 1) * 100)} centimes`;
};

export const ProfessionalTemplate: React.FC<ProfessionalTemplateProps> = ({
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
            <Text style={[styles.text, { fontWeight: 'bold', fontSize: 12 }]}>{company.name}</Text>
            {company.address && <Text style={styles.text}>{company.address}</Text>}
            {company.email && <Text style={styles.text}>{company.email}</Text>}
            {company.phone && <Text style={styles.text}>{company.phone}</Text>}
          </View>
        </View>

        {/* Document Info */}
        <View style={styles.documentInfo}>
          <View style={styles.clientInfo}>
            <Text style={styles.sectionTitle}>Document adressé à</Text>
            <Text style={[styles.text, { fontWeight: 'bold' }]}>{client.name}</Text>
            {client.company && client.company !== client.name && (
              <Text style={styles.text}>{client.company}</Text>
            )}
            {client.address && <Text style={styles.text}>{client.address}</Text>}
            {client.email && <Text style={styles.text}>{client.email}</Text>}
          </View>
          <View style={styles.invoiceDetails}>
            <Text style={[styles.text, { fontWeight: 'bold' }]}>{documentType} N° {invoiceData.number}</Text>
            <Text style={styles.text}>Date d'émission : {new Date(invoiceData.date).toLocaleDateString('fr-FR')}</Text>
            {invoiceData.dueDate && (
              <Text style={styles.text}>Date d'échéance : {new Date(invoiceData.dueDate).toLocaleDateString('fr-FR')}</Text>
            )}
          </View>
        </View>

        {invoiceData.subject && (
          <View style={styles.subjectBox}>
            <Text style={[styles.text, { fontWeight: 'bold', fontSize: 11 }]}>Référence : {invoiceData.subject}</Text>
          </View>
        )}

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCol1}>DESCRIPTION</Text>
            <Text style={styles.tableCol2}>QTÉ</Text>
            <Text style={styles.tableCol3}>PRIX UNIT.</Text>
            {settings.showVat && <Text style={styles.tableCol4}>TVA</Text>}
            <Text style={styles.tableCol5}>TOTAL</Text>
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
            <Text>Sous-total hors taxes :</Text>
            <Text>{subtotalHT.toFixed(2)} {settings.currency}</Text>
          </View>
          {settings.showVat && (
            <View style={styles.totalRow}>
              <Text>Montant de la TVA :</Text>
              <Text>{totalVAT.toFixed(2)} {settings.currency}</Text>
            </View>
          )}
          <View style={styles.totalFinal}>
            <Text>MONTANT TOTAL TTC :</Text>
            <Text>{totalTTC.toFixed(2)} {settings.currency}</Text>
          </View>
        </View>

        {/* Amount in words */}
        {settings.amountInWords && (
          <View style={styles.amountInWords}>
            <Text style={[styles.text, { fontWeight: 'bold' }]}>Montant en toutes lettres :</Text>
            <Text style={styles.text}>{numberToWords(totalTTC)}</Text>
          </View>
        )}

        {/* Notes */}
        {invoiceData.notes && (
          <View style={styles.notes}>
            <Text style={[styles.text, { fontWeight: 'bold', marginBottom: 8 }]}>Notes et conditions :</Text>
            <Text style={styles.text}>{invoiceData.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={{ fontWeight: 'bold' }}>{company.name} • {documentType}</Text>
          {settings.footer_content && <Text>{settings.footer_content}</Text>}
        </View>
      </Page>
    </Document>
  );
};
