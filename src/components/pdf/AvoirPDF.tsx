
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
  };
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
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#DC2626', // Rouge pour les avoirs
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
    color: '#DC2626', // Rouge pour les avoirs
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
  avoirDetails: {
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
    backgroundColor: '#DC2626', // Rouge pour les avoirs
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
  tableCol1: { width: '50%' },
  tableCol2: { width: '10%', textAlign: 'center' },
  tableCol3: { width: '15%', textAlign: 'right' },
  tableCol4: { width: '10%', textAlign: 'center' },
  tableCol5: { width: '15%', textAlign: 'right' },
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
    borderTopColor: '#DC2626',
    marginTop: 5,
    fontWeight: 'bold',
    fontSize: 12,
    color: '#DC2626',
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
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 3,
    borderLeftColor: '#DC2626',
  },
  amountInWords: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#FEF2F2',
    fontStyle: 'italic',
    color: '#DC2626',
  },
  invoiceReference: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#F3F4F6',
    borderLeftWidth: 3,
    borderLeftColor: '#6B7280',
  },
});

const numberToWords = (num: number): string => {
  const absNum = Math.abs(num);
  if (absNum === 0) return 'zéro';
  return `${Math.floor(absNum)} euros et ${Math.round((absNum % 1) * 100)} centimes`;
};

export const AvoirPDF: React.FC<AvoirPDFProps> = ({
  avoirData,
  client,
  company,
  settings = {
    showVat: true,
    showDiscount: false,
    currency: 'EUR',
    amountInWords: true
  }
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
          <View>
            {companyData.logo && (
              <Image style={styles.logo} src={companyData.logo} />
            )}
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.title}>AVOIR</Text>
            <Text style={styles.text}>{companyData.name}</Text>
            {companyData.address && <Text style={styles.text}>{companyData.address}</Text>}
            {companyData.email && <Text style={styles.text}>{companyData.email}</Text>}
            {companyData.phone && <Text style={styles.text}>{companyData.phone}</Text>}
          </View>
        </View>

        {/* Document Info */}
        <View style={styles.documentInfo}>
          <View style={styles.clientInfo}>
            <Text style={styles.sectionTitle}>AVOIR ÉMIS POUR :</Text>
            <Text style={styles.text}>{clientData.name}</Text>
            {clientData.company && clientData.company !== clientData.name && (
              <Text style={styles.text}>{clientData.company}</Text>
            )}
            {clientData.address && <Text style={styles.text}>{clientData.address}</Text>}
            {clientData.email && <Text style={styles.text}>{clientData.email}</Text>}
          </View>
          <View style={styles.avoirDetails}>
            <Text style={styles.text}>Avoir N° : {avoirData.number}</Text>
            <Text style={styles.text}>Date : {new Date(avoirData.date).toLocaleDateString('fr-FR')}</Text>
            <Text style={styles.text}>Type : {avoirData.type === 'facture_liee' ? 'Facture liée' : 'Économique'}</Text>
          </View>
        </View>

        {/* Invoice Reference if applicable */}
        {avoirData.type === 'facture_liee' && avoirData.invoiceNumber && (
          <View style={styles.invoiceReference}>
            <Text style={[styles.text, { fontWeight: 'bold', marginBottom: 5 }]}>Facture de référence :</Text>
            <Text style={styles.text}>Facture N° {avoirData.invoiceNumber}</Text>
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
              <Text style={styles.tableCol3}>-{item.unitPrice.toFixed(2)} {settings.currency}</Text>
              {settings.showVat && <Text style={styles.tableCol4}>{item.vatRate}%</Text>}
              <Text style={styles.tableCol5}>-{item.total.toFixed(2)} {settings.currency}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text>Sous-total HT :</Text>
            <Text>-{subtotalHT.toFixed(2)} {settings.currency}</Text>
          </View>
          {settings.showVat && (
            <View style={styles.totalRow}>
              <Text>TVA :</Text>
              <Text>-{totalVAT.toFixed(2)} {settings.currency}</Text>
            </View>
          )}
          <View style={styles.totalFinal}>
            <Text>TOTAL AVOIR TTC :</Text>
            <Text>-{totalTTC.toFixed(2)} {settings.currency}</Text>
          </View>
        </View>

        {/* Amount in words */}
        {settings.amountInWords && (
          <View style={styles.amountInWords}>
            <Text style={[styles.text, { fontWeight: 'bold' }]}>Montant en lettres :</Text>
            <Text style={styles.text}>Avoir de {numberToWords(totalTTC)}</Text>
          </View>
        )}

        {/* Notes */}
        {avoirData.notes && (
          <View style={styles.notes}>
            <Text style={[styles.text, { fontWeight: 'bold', marginBottom: 5 }]}>Motif de l'avoir :</Text>
            <Text style={styles.text}>{avoirData.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Note de crédit • {companyData.name}</Text>
          <Text>Cet avoir vient en déduction de votre prochain règlement</Text>
        </View>
      </Page>
    </Document>
  );
};
