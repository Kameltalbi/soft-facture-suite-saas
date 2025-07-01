
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  total: number;
}

interface AvoirData {
  id: string;
  number: string;
  type: 'facture_liee' | 'economique';
  invoiceNumber?: string;
  clientName: string;
  amount: number;
  date: string;
  status: string;
  notes?: string;
  items?: LineItem[];
}

interface AvoirPDFProps {
  avoirData: AvoirData;
  client?: {
    name: string;
    company?: string;
    address?: string;
    email?: string;
  };
  company?: {
    name: string;
    address?: string;
    email?: string;
    phone?: string;
    logo?: string;
  };
  settings?: {
    showVat: boolean;
    showDiscount: boolean;
    currency: string;
    amountInWords: boolean;
    footer_content?: string;
  };
  template?: string;
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
    borderBottomColor: '#DC2626',
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
    color: '#DC2626',
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
    backgroundColor: '#FEF2F2',
    padding: 20,
    borderRadius: 8,
  },
  clientInfo: {
    maxWidth: 280,
    flex: 1,
  },
  avoirDetails: {
    alignItems: 'flex-end',
    maxWidth: 220,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#DC2626',
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
    borderColor: '#FCA5A5',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#DC2626',
    padding: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#FEF2F2',
    padding: 12,
    minHeight: 32,
    backgroundColor: '#FFFFFF',
  },
  tableRowAlt: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#FEF2F2',
    padding: 12,
    minHeight: 32,
    backgroundColor: '#FEF2F2',
  },
  tableCol1: { width: '50%', color: '#374151' },
  tableCol2: { width: '10%', textAlign: 'center', color: '#374151' },
  tableCol3: { width: '15%', textAlign: 'right', color: '#374151' },
  tableCol4: { width: '10%', textAlign: 'center', color: '#374151' },
  tableCol5: { width: '15%', textAlign: 'right', color: '#374151', fontWeight: 'bold' },
  totalsSection: {
    marginTop: 25,
    alignItems: 'flex-end',
  },
  totalsContainer: {
    backgroundColor: '#FEF2F2',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    minWidth: 250,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#FCA5A5',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 10,
    color: '#DC2626',
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 10,
    color: '#DC2626',
    fontWeight: 'bold',
  },
  totalFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 2,
    borderTopColor: '#DC2626',
    marginTop: 15,
    backgroundColor: '#DC2626',
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
    borderTopColor: '#FCA5A5',
    paddingTop: 15,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  notes: {
    marginTop: 25,
    padding: 18,
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
    borderRadius: 6,
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 9,
    color: '#DC2626',
    lineHeight: 1.4,
  },
  subjectContainer: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#DC2626',
  },
  subjectText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  invoiceReference: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#6B7280',
  },
  invoiceReferenceText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1F2937',
  },
});

export const AvoirPDF: React.FC<AvoirPDFProps> = ({
  avoirData,
  client,
  company,
  settings = {
    showVat: true,
    showDiscount: false,
    currency: 'EUR',
    amountInWords: true
  },
  template = 'modern'
}) => {
  // Utilise les données de l'organisation passées en props ou des valeurs par défaut
  const clientData = client || {
    name: avoirData.clientName,
    company: avoirData.clientName,
    address: '123 Rue de l\'Exemple, 75001 Paris',
    email: 'contact@example.com'
  };

  const companyData = company || {
    name: 'Soft Facture',
    address: '456 Avenue de la République, 69000 Lyon',
    email: 'contact@softfacture.fr',
    phone: '04 72 00 00 00'
  };

  // Utilise les items de l'avoir ou crée un item par défaut
  const lineItems = avoirData.items || [
    {
      id: '1',
      description: avoirData.type === 'facture_liee' 
        ? `Avoir sur facture ${avoirData.invoiceNumber}` 
        : 'Avoir économique',
      quantity: 1,
      unitPrice: Math.abs(avoirData.amount),
      vatRate: 20,
      total: Math.abs(avoirData.amount)
    }
  ];

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
            <Text style={styles.title}>AVOIR</Text>
            <Text style={[styles.companyText, { fontWeight: 'bold', fontSize: 11, marginBottom: 5 }]}>
              {companyData.name}
            </Text>
            {companyData.address && <Text style={styles.companyText}>{companyData.address}</Text>}
            {companyData.email && <Text style={styles.companyText}>✉ {companyData.email}</Text>}
            {companyData.phone && <Text style={styles.companyText}>☎ {companyData.phone}</Text>}
          </View>
          <View>
            {companyData.logo && (
              <Image style={styles.logo} src={companyData.logo} />
            )}
          </View>
        </View>

        {/* Document Info */}
        <View style={styles.documentInfo}>
          <View style={styles.clientInfo}>
            <Text style={styles.sectionTitle}>Client</Text>
            <Text style={[styles.text, { fontWeight: 'bold', fontSize: 10 }]}>{clientData.name}</Text>
            {clientData.company && clientData.company !== clientData.name && (
              <Text style={styles.text}>{clientData.company}</Text>
            )}
            {clientData.address && <Text style={styles.text}>{clientData.address}</Text>}
            {clientData.email && <Text style={styles.text}>✉ {clientData.email}</Text>}
          </View>
          <View style={styles.avoirDetails}>
            <Text style={[styles.text, { fontWeight: 'bold' }]}>N° {avoirData.number}</Text>
            <Text style={styles.text}>Date : {new Date(avoirData.date).toLocaleDateString('fr-FR')}</Text>
            <Text style={styles.text}>Type : {avoirData.type === 'facture_liee' ? 'Facture liée' : 'Économique'}</Text>
          </View>
        </View>

        {/* Invoice Reference if applicable */}
        {avoirData.type === 'facture_liee' && avoirData.invoiceNumber && (
          <View style={styles.invoiceReference}>
            <Text style={styles.invoiceReferenceText}>Facture de référence : {avoirData.invoiceNumber}</Text>
          </View>
        )}

        {/* Subject/Notes as subtitle if available */}
        {avoirData.notes && (
          <View style={styles.subjectContainer}>
            <Text style={styles.subjectText}>Motif : {avoirData.notes}</Text>
          </View>
        )}

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCol1}>Description</Text>
            <Text style={styles.tableCol2}>Qté</Text>
            <Text style={styles.tableCol3}>Prix unit.</Text>
            <Text style={styles.tableCol4}>TVA</Text>
            <Text style={styles.tableCol5}>Total</Text>
          </View>
          
          {lineItems.map((item, index) => (
            <View key={item.id} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
              <Text style={styles.tableCol1}>{item.description}</Text>
              <Text style={styles.tableCol2}>{item.quantity}</Text>
              <Text style={styles.tableCol3}>-{item.unitPrice.toFixed(2)} €</Text>
              <Text style={styles.tableCol4}>{item.vatRate}%</Text>
              <Text style={styles.tableCol5}>-{item.total.toFixed(2)} €</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Sous-total HT :</Text>
              <Text style={styles.totalValue}>-{subtotalHT.toFixed(2)} €</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TVA :</Text>
              <Text style={styles.totalValue}>-{totalVAT.toFixed(2)} €</Text>
            </View>
            <View style={styles.totalFinal}>
              <Text style={styles.totalFinalLabel}>TOTAL AVOIR TTC :</Text>
              <Text style={styles.totalFinalValue}>-{totalTTC.toFixed(2)} €</Text>
            </View>
          </View>
        </View>

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
