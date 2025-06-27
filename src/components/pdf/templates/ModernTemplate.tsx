import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 30,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 40,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#2563EB',
    padding: 20,
    marginBottom: 25,
    marginLeft: -40,
    marginRight: -40,
    marginTop: -30,
    position: 'relative',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoSection: {
    width: '20%',
  },
  logo: {
    width: 52,
    height: 39,
    objectFit: 'contain',
  },
  titleSection: {
    width: '60%',
    alignItems: 'center',
  },
  headerAccent: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 100,
    height: '100%',
    backgroundColor: '#1D4ED8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 11,
    color: '#E0E7FF',
  },
  mainContent: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  leftColumn: {
    width: '50%',
    paddingRight: 20,
  },
  rightColumn: {
    width: '50%',
    paddingLeft: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  address: {
    fontSize: 9,
    color: '#6B7280',
    lineHeight: 1.4,
    marginBottom: 2,
  },
  documentInfo: {
    backgroundColor: '#F3F4F6',
    padding: 15,
    marginBottom: 20,
    borderLeft: '4pt solid #2563EB',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 8,
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 10,
    color: '#1F2937',
    fontWeight: 'bold',
  },
  table: {
    marginBottom: 15,
    border: '1pt solid #E5E7EB',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    padding: 10,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #E5E7EB',
    padding: 10,
    minHeight: 30,
  },
  tableRowEven: {
    flexDirection: 'row',
    borderBottom: '1pt solid #E5E7EB',
    backgroundColor: '#F9FAFB',
    padding: 10,
    minHeight: 30,
  },
  col1: { width: '45%', fontSize: 9, color: '#374151' },
  col2: { width: '12%', fontSize: 9, textAlign: 'center', color: '#374151' },
  col3: { width: '15%', fontSize: 9, textAlign: 'right', color: '#374151' },
  col4: { width: '13%', fontSize: 9, textAlign: 'center', color: '#374151' },
  col5: { width: '15%', fontSize: 9, textAlign: 'right', color: '#374151', fontWeight: 'bold' },
  totalSection: {
    alignItems: 'flex-end',
    marginTop: 15,
  },
  totalBox: {
    width: '45%',
    backgroundColor: '#F3F4F6',
    border: '1pt solid #E5E7EB',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottom: '1pt solid #E5E7EB',
  },
  totalLabel: {
    fontSize: 9,
    color: '#6B7280',
  },
  totalValue: {
    fontSize: 9,
    color: '#374151',
    fontWeight: 'bold',
  },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#2563EB',
  },
  grandTotalLabel: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  grandTotalValue: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#9CA3AF',
    borderTop: '1pt solid #E5E7EB',
    paddingTop: 10,
  },
});

interface ModernTemplateProps {
  invoiceData: any;
  lineItems: any[];
  client: any;
  company: any;
  settings: any;
  documentType?: string;
}

export const ModernTemplate = ({ 
  invoiceData, 
  lineItems, 
  client, 
  company, 
  settings,
  documentType = 'FACTURE'
}: ModernTemplateProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.headerAccent} />
        <View style={styles.headerContent}>
          <View style={styles.logoSection}>
            {company.logo && (
              <Image style={styles.logo} src={company.logo} />
            )}
          </View>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{documentType}</Text>
            <Text style={styles.subtitle}>N° {invoiceData.number}</Text>
          </View>
          <View style={styles.logoSection}>
            {/* Espace pour équilibrer le layout */}
          </View>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.leftColumn}>
          <Text style={styles.sectionTitle}>De</Text>
          <Text style={styles.companyName}>{company.name}</Text>
          <Text style={styles.address}>{company.address}</Text>
          <Text style={styles.address}>Tél : {company.phone}</Text>
          <Text style={styles.address}>Email : {company.email}</Text>
        </View>
        <View style={styles.rightColumn}>
          <Text style={styles.sectionTitle}>À</Text>
          <Text style={styles.companyName}>{client.name}</Text>
          <Text style={styles.address}>{client.company}</Text>
          <Text style={styles.address}>{client.address}</Text>
          <Text style={styles.address}>{client.email}</Text>
        </View>
      </View>

      <View style={styles.documentInfo}>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{invoiceData.date}</Text>
          </View>
          {invoiceData.dueDate && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Échéance</Text>
              <Text style={styles.infoValue}>{invoiceData.dueDate}</Text>
            </View>
          )}
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Sujet</Text>
            <Text style={styles.infoValue}>{invoiceData.subject}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Référence</Text>
            <Text style={styles.infoValue}>{invoiceData.number}</Text>
          </View>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, styles.col1]}>Description</Text>
          <Text style={[styles.headerText, styles.col2]}>Qté</Text>
          <Text style={[styles.headerText, styles.col3]}>Prix Unit.</Text>
          <Text style={[styles.headerText, styles.col4]}>TVA</Text>
          <Text style={[styles.headerText, styles.col5]}>Total</Text>
        </View>
        {lineItems.map((item, index) => (
          <View key={item.id} style={index % 2 === 0 ? styles.tableRow : styles.tableRowEven}>
            <Text style={styles.col1}>{item.description}</Text>
            <Text style={styles.col2}>{item.quantity}</Text>
            <Text style={styles.col3}>{item.unitPrice.toFixed(2)} €</Text>
            <Text style={styles.col4}>{item.vatRate}%</Text>
            <Text style={styles.col5}>{item.total.toFixed(2)} €</Text>
          </View>
        ))}
      </View>

      <View style={styles.totalSection}>
        <View style={styles.totalBox}>
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
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalLabel}>Total TTC</Text>
            <Text style={styles.grandTotalValue}>
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
