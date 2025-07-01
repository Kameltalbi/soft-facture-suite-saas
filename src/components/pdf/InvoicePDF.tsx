import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { TaxCalculation } from '@/utils/customTaxCalculations';
import { numberToWords } from '@/utils/numberToWords';

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
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#6A9C89',
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
    color: '#6A9C89',
    marginBottom: 10,
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
    color: '#2E2E2E',
    marginBottom: 8,
  },
  text: {
    fontSize: 10,
    color: '#2E2E2E',
    marginBottom: 3,
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#6A9C89',
    padding: 8,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    padding: 8,
    minHeight: 30,
  },
  tableCol1: { width: '40%' },
  tableCol2: { width: '10%', textAlign: 'center' },
  tableCol3: { width: '15%', textAlign: 'right' },
  tableCol4: { width: '10%', textAlign: 'center' },
  tableCol5: { width: '10%', textAlign: 'center' },
  tableCol6: { width: '15%', textAlign: 'right' },
  totalsSection: {
    marginTop: 20,
    alignItems: 'flex-end',
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
    paddingVertical: 5,
    borderTopWidth: 2,
    borderTopColor: '#6A9C89',
    marginTop: 5,
    fontWeight: 'bold',
    fontSize: 12,
  },
  customTaxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 250,
    paddingVertical: 3,
    color: '#D96C4F',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#6C6C6C',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 10,
  },
  notes: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#FAFAF9',
    borderLeftWidth: 3,
    borderLeftColor: '#D96C4F',
  },
  amountInWords: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#E9E4DB',
    fontStyle: 'italic',
  },
});

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  discount: number;
  total: number;
}

interface InvoiceData {
  number: string;
  date: string;
  dueDate?: string;
  clientId: string;
  subject: string;
  notes: string;
}

interface InvoicePDFProps {
  invoiceData: InvoiceData;
  lineItems: LineItem[];
  client: {
    name: string;
    company?: string;
    address?: string;
    email?: string;
  };
  company: {
    name: string;
    address?: string;
    email?: string;
    phone?: string;
    logo?: string;
  };
  settings: {
    showVat: boolean;
    showDiscount: boolean;
    showAdvance: boolean;
    currency: string;
    amountInWords: boolean;
  };
  customTaxes?: TaxCalculation[];
}

export const InvoicePDF: React.FC<InvoicePDFProps> = ({
  invoiceData,
  lineItems,
  client,
  company,
  settings,
  customTaxes = [],
}) => {
  const calculateTotals = () => {
    const subtotalHT = lineItems.reduce((sum, item) => sum + item.total, 0);
    const totalVAT = lineItems.reduce((sum, item) => {
      return sum + (item.total * item.vatRate / 100);
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
          <View>
            {company.logo && (
              <Image style={styles.logo} src={company.logo} />
            )}
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.title}>FACTURE</Text>
            <Text style={styles.text}>{company.name}</Text>
            {company.address && <Text style={styles.text}>{company.address}</Text>}
            {company.email && <Text style={styles.text}>{company.email}</Text>}
            {company.phone && <Text style={styles.text}>{company.phone}</Text>}
          </View>
        </View>

        {/* Document Info */}
        <View style={styles.documentInfo}>
          <View style={styles.clientInfo}>
            <Text style={styles.sectionTitle}>FACTURÉ À :</Text>
            <Text style={styles.text}>{client.name}</Text>
            {client.company && <Text style={styles.text}>{client.company}</Text>}
            {client.address && <Text style={styles.text}>{client.address}</Text>}
            {client.email && <Text style={styles.text}>{client.email}</Text>}
          </View>
          <View style={styles.invoiceDetails}>
            <Text style={styles.text}>Facture N° : {invoiceData.number}</Text>
            <Text style={styles.text}>Date : {new Date(invoiceData.date).toLocaleDateString('fr-FR')}</Text>
            {invoiceData.dueDate && (
              <Text style={styles.text}>Échéance : {new Date(invoiceData.dueDate).toLocaleDateString('fr-FR')}</Text>
            )}
            {invoiceData.subject && (
              <Text style={styles.text}>Objet : {invoiceData.subject}</Text>
            )}
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCol1}>Description</Text>
            <Text style={styles.tableCol2}>Qté</Text>
            <Text style={styles.tableCol3}>Prix unit.</Text>
            {settings.showVat && <Text style={styles.tableCol4}>TVA</Text>}
            {settings.showDiscount && <Text style={styles.tableCol5}>Remise</Text>}
            <Text style={styles.tableCol6}>Total</Text>
          </View>
          
          {lineItems.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.tableCol1}>{item.description}</Text>
              <Text style={styles.tableCol2}>{item.quantity}</Text>
              <Text style={styles.tableCol3}>{item.unitPrice.toFixed(2)} {settings.currency}</Text>
              {settings.showVat && <Text style={styles.tableCol4}>{item.vatRate}%</Text>}
              {settings.showDiscount && <Text style={styles.tableCol5}>{item.discount}%</Text>}
              <Text style={styles.tableCol6}>{item.total.toFixed(2)} {settings.currency}</Text>
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
          
          {/* Affichage des taxes personnalisées */}
          {customTaxes.map((tax) => (
            <View key={tax.id} style={styles.customTaxRow}>
              <Text>{tax.name} ({tax.type === 'percentage' ? `${tax.value}%` : `${tax.value} ${settings.currency}`}) :</Text>
              <Text>{tax.amount.toFixed(2)} {settings.currency}</Text>
            </View>
          ))}
          
          <View style={styles.totalFinal}>
            <Text>TOTAL TTC :</Text>
            <Text>{totalTTC.toFixed(2)} {settings.currency}</Text>
          </View>
        </View>

        {/* Amount in words */}
        {settings.amountInWords && (
          <View style={styles.amountInWords}>
            <Text style={[styles.text, { fontWeight: 'bold' }]}>Montant en lettres :</Text>
            <Text style={styles.text}>{numberToWords(totalTTC, settings.currency)}</Text>
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
          <Text>Merci pour votre confiance • {company.name}</Text>
          <Text>Conditions de paiement : 30 jours • Tout retard de paiement entraînera des pénalités</Text>
        </View>
      </Page>
    </Document>
  );
};
