import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 30,
    paddingLeft: 50,
    paddingRight: 50,
    paddingBottom: 50,
    backgroundColor: '#ffffff',
  },
  headerSection: {
    flexDirection: 'row',
    marginBottom: 25,
    alignItems: 'flex-start',
  },
  leftHeader: {
    width: '50%',
  },
  rightHeader: {
    width: '50%',
    alignItems: 'flex-end',
  },
  logoContainer: {
    marginBottom: 15,
  },
  logo: {
    width: 55,
    height: 41,
    objectFit: 'contain',
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 5,
  },
  companyDetails: {
    fontSize: 9,
    color: '#4A5568',
    lineHeight: 1.4,
    marginBottom: 1,
  },
  documentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'right',
    marginBottom: 5,
  },
  documentNumber: {
    fontSize: 11,
    color: '#718096',
    textAlign: 'right',
  },
  billToSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#F7FAFC',
    border: '1pt solid #E2E8F0',
  },
  billToTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clientName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 5,
  },
  clientDetails: {
    fontSize: 9,
    color: '#4A5568',
    lineHeight: 1.4,
    marginBottom: 2,
  },
  documentInfoSection: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#EDF2F7',
    border: '1pt solid #CBD5E0',
  },
  infoColumn: {
    width: '33.33%',
    paddingHorizontal: 10,
  },
  infoLabel: {
    fontSize: 8,
    color: '#718096',
    textTransform: 'uppercase',
    marginBottom: 3,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 10,
    color: '#2D3748',
    fontWeight: 'bold',
  },
  tableContainer: {
    marginBottom: 20,
    border: '1pt solid #CBD5E0',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2D3748',
    padding: 10,
  },
  tableHeaderText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #E2E8F0',
    padding: 10,
    minHeight: 35,
  },
  tableRowAlt: {
    flexDirection: 'row',
    borderBottom: '1pt solid #E2E8F0',
    backgroundColor: '#F7FAFC',
    padding: 10,
    minHeight: 35,
  },
  cellText: {
    fontSize: 9,
    color: '#2D3748',
  },
  col1: { width: '42%' },
  col2: { width: '12%', textAlign: 'center' },
  col3: { width: '16%', textAlign: 'right' },
  col4: { width: '12%', textAlign: 'center' },
  col5: { width: '18%', textAlign: 'right', fontWeight: 'bold' },
  summarySection: {
    alignItems: 'flex-end',
    marginTop: 15,
  },
  summaryBox: {
    width: '50%',
    border: '1pt solid #CBD5E0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottom: '1pt solid #E2E8F0',
  },
  summaryLabel: {
    fontSize: 10,
    color: '#4A5568',
  },
  summaryValue: {
    fontSize: 10,
    color: '#2D3748',
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#2D3748',
  },
  totalLabel: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  totalValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: 'center',
    fontSize: 7,
    color: '#A0AEC0',
    borderTop: '1pt solid #E2E8F0',
    paddingTop: 10,
    lineHeight: 1.4,
  },
});

interface ProfessionalTemplateProps {
  invoiceData: any;
  lineItems: any[];
  client: any;
  company: any;
  settings: any;
  documentType?: string;
}

export const ProfessionalTemplate = ({ 
  invoiceData, 
  lineItems, 
  client, 
  company, 
  settings,
  documentType = 'FACTURE'
}: ProfessionalTemplateProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.headerSection}>
        <View style={styles.leftHeader}>
          {company.logo && (
            <View style={styles.logoContainer}>
              <Image style={styles.logo} src={company.logo} />
            </View>
          )}
          <Text style={styles.companyName}>{company.name}</Text>
          <Text style={styles.companyDetails}>{company.address}</Text>
          <Text style={styles.companyDetails}>Téléphone : {company.phone}</Text>
          <Text style={styles.companyDetails}>Email : {company.email}</Text>
        </View>
        <View style={styles.rightHeader}>
          <Text style={styles.documentTitle}>{documentType}</Text>
          <Text style={styles.documentNumber}>N° {invoiceData.number}</Text>
        </View>
      </View>

      <View style={styles.billToSection}>
        <Text style={styles.billToTitle}>Facturé à</Text>
        <Text style={styles.clientName}>{client.name}</Text>
        <Text style={styles.clientDetails}>{client.company}</Text>
        <Text style={styles.clientDetails}>{client.address}</Text>
        <Text style={styles.clientDetails}>{client.email}</Text>
      </View>

      <View style={styles.documentInfoSection}>
        <View style={styles.infoColumn}>
          <Text style={styles.infoLabel}>Date d'émission</Text>
          <Text style={styles.infoValue}>{invoiceData.date}</Text>
        </View>
        {invoiceData.dueDate && (
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>Date d'échéance</Text>
            <Text style={styles.infoValue}>{invoiceData.dueDate}</Text>
          </View>
        )}
        <View style={styles.infoColumn}>
          <Text style={styles.infoLabel}>Référence</Text>
          <Text style={styles.infoValue}>{invoiceData.number}</Text>
        </View>
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.col1]}>Description des services</Text>
          <Text style={[styles.tableHeaderText, styles.col2]}>Qté</Text>
          <Text style={[styles.tableHeaderText, styles.col3]}>Prix unitaire</Text>
          <Text style={[styles.tableHeaderText, styles.col4]}>TVA</Text>
          <Text style={[styles.tableHeaderText, styles.col5]}>Montant total</Text>
        </View>
        {lineItems.map((item, index) => (
          <View key={item.id} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
            <Text style={[styles.cellText, styles.col1]}>{item.description}</Text>
            <Text style={[styles.cellText, styles.col2]}>{item.quantity}</Text>
            <Text style={[styles.cellText, styles.col3]}>{item.unitPrice.toFixed(2)} €</Text>
            <Text style={[styles.cellText, styles.col4]}>{item.vatRate}%</Text>
            <Text style={[styles.cellText, styles.col5]}>{item.total.toFixed(2)} €</Text>
          </View>
        ))}
      </View>

      <View style={styles.summarySection}>
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sous-total HT</Text>
            <Text style={styles.summaryValue}>
              {lineItems.reduce((sum, item) => sum + (item.total / (1 + item.vatRate / 100)), 0).toFixed(2)} €
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total TVA</Text>
            <Text style={styles.summaryValue}>
              {lineItems.reduce((sum, item) => sum + (item.total - (item.total / (1 + item.vatRate / 100))), 0).toFixed(2)} €
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total TTC</Text>
            <Text style={styles.totalValue}>
              {lineItems.reduce((sum, item) => sum + item.total, 0).toFixed(2)} €
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.footer}>
        {settings.footer_content}
      </Text>
    </Page>
  </Document>
);
