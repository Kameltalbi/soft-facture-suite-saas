
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 40,
    paddingLeft: 80,
    paddingRight: 80,
    paddingBottom: 40,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'normal',
    color: '#000000',
    marginBottom: 10,
    letterSpacing: 6,
    textTransform: 'uppercase',
  },
  documentNumber: {
    fontSize: 12,
    color: '#666666',
    letterSpacing: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#000000',
    marginVertical: 20,
  },
  addressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  addressBlock: {
    width: '40%',
  },
  addressTitle: {
    fontSize: 8,
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  addressText: {
    fontSize: 10,
    color: '#000000',
    lineHeight: 1.4,
    marginBottom: 3,
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 6,
  },
  documentDetails: {
    marginBottom: 30,
    paddingVertical: 15,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '30%',
  },
  detailLabel: {
    fontSize: 8,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 10,
    color: '#000000',
  },
  table: {
    marginBottom: 25,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '2pt solid #000000',
    paddingBottom: 10,
    marginBottom: 15,
  },
  headerCell: {
    fontSize: 8,
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottom: '1pt solid #E0E0E0',
  },
  cellText: {
    fontSize: 9,
    color: '#000000',
  },
  col1: { width: '50%' },
  col2: { width: '10%', textAlign: 'center' },
  col3: { width: '15%', textAlign: 'right' },
  col4: { width: '10%', textAlign: 'center' },
  col5: { width: '15%', textAlign: 'right' },
  totalsSection: {
    marginTop: 30,
    alignItems: 'flex-end',
  },
  totalsTable: {
    width: '40%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottom: '1pt solid #E0E0E0',
  },
  totalLabel: {
    fontSize: 9,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  totalValue: {
    fontSize: 9,
    color: '#000000',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTop: '2pt solid #000000',
    marginTop: 8,
  },
  grandTotalLabel: {
    fontSize: 12,
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  grandTotalValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: 'bold',
  },
  notes: {
    marginTop: 40,
    paddingTop: 20,
    borderTop: '1pt solid #E0E0E0',
  },
  notesTitle: {
    fontSize: 8,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  notesText: {
    fontSize: 9,
    color: '#000000',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 80,
    right: 80,
    textAlign: 'center',
    fontSize: 7,
    color: '#999999',
    lineHeight: 1.4,
  },
});

interface MinimalTemplateProps {
  invoiceData: any;
  lineItems: any[];
  client: any;
  company: any;
  settings: any;
  documentType?: string;
}

export const MinimalTemplate = ({ 
  invoiceData, 
  lineItems, 
  client, 
  company, 
  settings,
  documentType = 'FACTURE'
}: MinimalTemplateProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>{documentType}</Text>
        <Text style={styles.documentNumber}>{invoiceData.number}</Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.addressSection}>
        <View style={styles.addressBlock}>
          <Text style={styles.addressTitle}>De</Text>
          <Text style={styles.companyName}>{company.name}</Text>
          <Text style={styles.addressText}>{company.address}</Text>
          <Text style={styles.addressText}>{company.phone}</Text>
          <Text style={styles.addressText}>{company.email}</Text>
        </View>
        <View style={styles.addressBlock}>
          <Text style={styles.addressTitle}>À</Text>
          <Text style={styles.companyName}>{client.name}</Text>
          <Text style={styles.addressText}>{client.company}</Text>
          <Text style={styles.addressText}>{client.address}</Text>
          <Text style={styles.addressText}>{client.email}</Text>
        </View>
      </View>

      <View style={styles.documentDetails}>
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{invoiceData.date}</Text>
          </View>
          {invoiceData.dueDate && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Échéance</Text>
              <Text style={styles.detailValue}>{invoiceData.dueDate}</Text>
            </View>
          )}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Sujet</Text>
            <Text style={styles.detailValue}>{invoiceData.subject}</Text>
          </View>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.col1]}>Description</Text>
          <Text style={[styles.headerCell, styles.col2]}>Qté</Text>
          <Text style={[styles.headerCell, styles.col3]}>Prix</Text>
          <Text style={[styles.headerCell, styles.col4]}>TVA</Text>
          <Text style={[styles.headerCell, styles.col5]}>Total</Text>
        </View>
        {lineItems.map((item, index) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={[styles.cellText, styles.col1]}>{item.description}</Text>
            <Text style={[styles.cellText, styles.col2]}>{item.quantity}</Text>
            <Text style={[styles.cellText, styles.col3]}>{item.unitPrice.toFixed(2)} €</Text>
            <Text style={[styles.cellText, styles.col4]}>{item.vatRate}%</Text>
            <Text style={[styles.cellText, styles.col5]}>{item.total.toFixed(2)} €</Text>
          </View>
        ))}
      </View>

      <View style={styles.totalsSection}>
        <View style={styles.totalsTable}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Sous-total</Text>
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
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>
              {lineItems.reduce((sum, item) => sum + item.total, 0).toFixed(2)} €
            </Text>
          </View>
        </View>
      </View>

      {invoiceData.notes && (
        <View style={styles.notes}>
          <Text style={styles.notesTitle}>Notes</Text>
          <Text style={styles.notesText}>{invoiceData.notes}</Text>
        </View>
      )}

      <Text style={styles.footer}>
        {settings.footer_content}
      </Text>
    </Page>
  </Document>
);
