import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 60,
    paddingLeft: 60,
    paddingRight: 60,
    paddingBottom: 80,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2pt solid #8B4513',
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  logoSection: {
    width: '25%',
    alignItems: 'flex-start',
  },
  logo: {
    width: 62,
    height: 47,
    objectFit: 'contain',
  },
  titleSection: {
    width: '50%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  ornament: {
    textAlign: 'center',
    fontSize: 16,
    color: '#8B4513',
    marginBottom: 10,
  },
  companyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  companySection: {
    width: '45%',
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 5,
  },
  companyDetails: {
    fontSize: 9,
    color: '#555555',
    lineHeight: 1.4,
  },
  documentInfo: {
    backgroundColor: '#F5F5DC',
    padding: 15,
    marginBottom: 25,
    border: '1pt solid #8B4513',
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8,
  },
  documentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  documentField: {
    fontSize: 9,
    color: '#333333',
    marginBottom: 3,
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#8B4513',
    padding: 8,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #DDDDDD',
    padding: 8,
    minHeight: 30,
  },
  tableRowAlt: {
    flexDirection: 'row',
    borderBottom: '1pt solid #DDDDDD',
    backgroundColor: '#FAFAFA',
    padding: 8,
    minHeight: 30,
  },
  col1: { width: '40%', fontSize: 9 },
  col2: { width: '15%', fontSize: 9, textAlign: 'center' },
  col3: { width: '15%', fontSize: 9, textAlign: 'right' },
  col4: { width: '15%', fontSize: 9, textAlign: 'right' },
  col5: { width: '15%', fontSize: 9, textAlign: 'right' },
  totals: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalSection: {
    width: '40%',
    border: '1pt solid #8B4513',
    backgroundColor: '#F5F5DC',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottom: '1pt solid #8B4513',
  },
  totalLabel: {
    fontSize: 10,
    color: '#8B4513',
  },
  totalValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  finalTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: '#8B4513',
  },
  finalTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  finalTotalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 60,
    right: 60,
    textAlign: 'center',
    fontSize: 8,
    color: '#666666',
    borderTop: '1pt solid #8B4513',
    paddingTop: 10,
  },
  ornament: {
    textAlign: 'center',
    fontSize: 16,
    color: '#8B4513',
    marginBottom: 10,
  },
});

interface ClassicTemplateProps {
  invoiceData: any;
  lineItems: any[];
  client: any;
  company: any;
  settings: any;
  documentType?: string;
}

export const ClassicTemplate = ({ 
  invoiceData, 
  lineItems, 
  client, 
  company, 
  settings,
  documentType = 'FACTURE'
}: ClassicTemplateProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoSection}>
            {company.logo && (
              <Image style={styles.logo} src={company.logo} />
            )}
          </View>
          <View style={styles.titleSection}>
            <Text style={styles.ornament}>❦ ❦ ❦</Text>
            <Text style={styles.title}>{documentType}</Text>
          </View>
          <View style={styles.logoSection}>
            {/* Espace pour équilibrer le layout */}
          </View>
        </View>
      </View>

      <View style={styles.companyInfo}>
        <View style={styles.companySection}>
          <Text style={styles.companyName}>{company.name}</Text>
          <Text style={styles.companyDetails}>{company.address}</Text>
          <Text style={styles.companyDetails}>Tél : {company.phone}</Text>
          <Text style={styles.companyDetails}>Email : {company.email}</Text>
        </View>
        <View style={styles.companySection}>
          <Text style={styles.companyName}>Facturé à :</Text>
          <Text style={styles.companyDetails}>{client.name}</Text>
          <Text style={styles.companyDetails}>{client.company}</Text>
          <Text style={styles.companyDetails}>{client.address}</Text>
          <Text style={styles.companyDetails}>{client.email}</Text>
        </View>
      </View>

      <View style={styles.documentInfo}>
        <Text style={styles.documentTitle}>{documentType} N° {invoiceData.number}</Text>
        <View style={styles.documentDetails}>
          <View>
            <Text style={styles.documentField}>Date : {invoiceData.date}</Text>
            {invoiceData.dueDate && (
              <Text style={styles.documentField}>Échéance : {invoiceData.dueDate}</Text>
            )}
          </View>
          <View>
            <Text style={styles.documentField}>Sujet : {invoiceData.subject}</Text>
          </View>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.col1}>Description</Text>
          <Text style={styles.col2}>Qté</Text>
          <Text style={styles.col3}>Prix unit.</Text>
          <Text style={styles.col4}>TVA</Text>
          <Text style={styles.col5}>Total</Text>
        </View>
        {lineItems.map((item, index) => (
          <View key={item.id} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
            <Text style={styles.col1}>{item.description}</Text>
            <Text style={styles.col2}>{item.quantity}</Text>
            <Text style={styles.col3}>{item.unitPrice.toFixed(2)} €</Text>
            <Text style={styles.col4}>{item.vatRate}%</Text>
            <Text style={styles.col5}>{item.total.toFixed(2)} €</Text>
          </View>
        ))}
      </View>

      <View style={styles.totals}>
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Sous-total HT</Text>
            <Text style={styles.totalValue}>
              {lineItems.reduce((sum, item) => sum + (item.total / (1 + item.vatRate / 100)), 0).toFixed(2)} €
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TVA</Text>
            <Text style={styles.totalValue}>
              {lineItems.reduce((sum, item) => sum + (item.total - (item.total / (1 + item.vatRate / 100))), 0).toFixed(2)} €
            </Text>
          </View>
          <View style={styles.finalTotal}>
            <Text style={styles.finalTotalLabel}>Total TTC</Text>
            <Text style={styles.finalTotalValue}>
              {lineItems.reduce((sum, item) => sum + item.total, 0).toFixed(2)} €
            </Text>
          </View>
        </View>
      </View>

      {invoiceData.notes && (
        <View style={{ marginTop: 30, padding: 15, backgroundColor: '#F5F5DC', border: '1pt solid #8B4513' }}>
          <Text style={{ fontSize: 9, color: '#555555' }}>{invoiceData.notes}</Text>
        </View>
      )}

      <Text style={styles.footer}>
        {settings.footer_content}
      </Text>
    </Page>
  </Document>
);
