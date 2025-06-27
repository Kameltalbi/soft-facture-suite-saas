
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#6A9C89',
  },
  companyInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6A9C89',
    textAlign: 'right',
    marginBottom: 10,
  },
  documentNumber: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'right',
  },
  clientSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
  },
  clientInfo: {
    fontSize: 10,
    lineHeight: 1.4,
    color: '#666666',
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#6A9C89',
    padding: 8,
  },
  tableHeaderText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    padding: 8,
  },
  tableCell: {
    fontSize: 9,
    color: '#333333',
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    fontSize: 8,
    color: '#666666',
    textAlign: 'center',
  },
  notes: {
    marginTop: 20,
    fontSize: 9,
    color: '#666666',
    lineHeight: 1.4,
  },
});

interface DeliveryNotePDFProps {
  deliveryData: any;
  lineItems: any[];
  client: any;
  company: any;
  settings: any;
}

export const DeliveryNotePDF = ({
  deliveryData,
  lineItems,
  client,
  company,
  settings
}: DeliveryNotePDFProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>
              {company?.name || 'Soft Facture'}
            </Text>
            <Text style={{ fontSize: 10, color: '#666666', lineHeight: 1.4 }}>
              {company?.address || 'Adresse de l\'entreprise'}
            </Text>
            <Text style={{ fontSize: 10, color: '#666666' }}>
              {company?.email || 'contact@softfacture.fr'}
            </Text>
            <Text style={{ fontSize: 10, color: '#666666' }}>
              {company?.phone || 'Téléphone'}
            </Text>
          </View>
          <View>
            <Text style={styles.documentTitle}>BON DE LIVRAISON</Text>
            <Text style={styles.documentNumber}>N° {deliveryData?.number}</Text>
            <Text style={styles.documentNumber}>
              Date: {new Date(deliveryData?.date || Date.now()).toLocaleDateString('fr-FR')}
            </Text>
          </View>
        </View>

        {/* Client Section */}
        <View style={styles.clientSection}>
          <Text style={styles.sectionTitle}>LIVRER À :</Text>
          <Text style={styles.clientInfo}>
            {client?.company || client?.name || 'Nom du client'}
          </Text>
          <Text style={styles.clientInfo}>
            {client?.address || 'Adresse du client'}
          </Text>
          <Text style={styles.clientInfo}>
            {client?.email || 'Email du client'}
          </Text>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 4 }]}>DESCRIPTION</Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>QTÉ LIVRÉE</Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>ÉTAT</Text>
          </View>

          {lineItems?.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 4 }]}>{item.description}</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>Conforme</Text>
            </View>
          ))}
        </View>

        {/* Signature Section */}
        <View style={{ marginTop: 40, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: 200 }}>
            <Text style={styles.sectionTitle}>SIGNATURE DU LIVREUR :</Text>
            <View style={{ height: 60, borderBottomWidth: 1, borderBottomColor: '#E0E0E0', marginTop: 20 }}></View>
            <Text style={{ fontSize: 8, color: '#666666', marginTop: 5 }}>Date et signature</Text>
          </View>
          <View style={{ width: 200 }}>
            <Text style={styles.sectionTitle}>SIGNATURE DU CLIENT :</Text>
            <View style={{ height: 60, borderBottomWidth: 1, borderBottomColor: '#E0E0E0', marginTop: 20 }}></View>
            <Text style={{ fontSize: 8, color: '#666666', marginTop: 5 }}>Date et signature</Text>
          </View>
        </View>

        {/* Notes */}
        {deliveryData?.notes && (
          <View style={styles.notes}>
            <Text style={styles.sectionTitle}>NOTES :</Text>
            <Text>{deliveryData.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>{settings?.footer_content || 'Soft Facture - Merci pour votre confiance'}</Text>
        </View>
      </Page>
    </Document>
  );
};
