
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    paddingBottom: 45, // Espace pour le pied de page fixe
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#6A9C89',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  logo: {
    width: 80,
    height: 60,
    objectFit: 'contain',
    marginRight: 15,
  },
  logoPlaceholder: {
    width: 80,
    height: 60,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderStyle: 'dashed',
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPlaceholderText: {
    fontSize: 8,
    color: '#999999',
    textAlign: 'center',
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
  },
  companyDetails: {
    fontSize: 10,
    color: '#666666',
    lineHeight: 1.4,
    marginBottom: 2,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  documentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6A9C89',
    marginBottom: 15,
  },
  documentInfo: {
    alignItems: 'flex-end',
  },
  documentNumber: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  documentDate: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 3,
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
  notes: {
    marginTop: 20,
    fontSize: 9,
    color: '#666666',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 15, // 1,5 cm = environ 42 points, on met 15 pour être dans la marge
    left: 30,
    right: 30,
    fontSize: 8,
    color: '#666666',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
  },
});

interface DeliveryNotePDFProps {
  deliveryData: any;
  lineItems: any[];
  client: any;
  company: any;
  settings: any;
  currency?: { code: string; symbol: string; name: string };
}

export const DeliveryNotePDF = ({
  deliveryData,
  lineItems,
  client,
  company,
  settings,
  currency
}: DeliveryNotePDFProps) => {
  const currencySymbol = currency?.symbol || '€';

  console.log('PDF Component - Company data:', company);
  console.log('PDF Component - Logo URL:', company?.logo_url);
  console.log('PDF Component - Logo URL type:', typeof company?.logo_url);
  console.log('PDF Component - Logo URL length:', company?.logo_url?.length);

  // Vérifier si l'URL du logo est valide
  const isValidLogoUrl = company?.logo_url && 
    company.logo_url.trim() && 
    (company.logo_url.startsWith('http://') || 
     company.logo_url.startsWith('https://') || 
     company.logo_url.startsWith('data:') ||
     company.logo_url.startsWith('/'));

  console.log('PDF Component - Is valid logo URL:', isValidLogoUrl);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.leftSection}>
            {isValidLogoUrl ? (
              <Image 
                style={styles.logo} 
                src={company.logo_url}
              />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoPlaceholderText}>LOGO{'\n'}ENTREPRISE</Text>
              </View>
            )}
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>
                {company?.name || 'Soft Facture'}
              </Text>
              <Text style={styles.companyDetails}>
                {company?.address || 'Adresse de l\'entreprise'}
              </Text>
              <Text style={styles.companyDetails}>
                {company?.email || 'contact@softfacture.fr'}
              </Text>
              <Text style={styles.companyDetails}>
                {company?.phone || 'Téléphone'}
              </Text>
            </View>
          </View>
          
          <View style={styles.rightSection}>
            <Text style={styles.documentTitle}>BON DE LIVRAISON</Text>
            <View style={styles.documentInfo}>
              <Text style={styles.documentNumber}>N° {deliveryData?.number || 'N/A'}</Text>
              <Text style={styles.documentDate}>
                Date: {new Date(deliveryData?.date || Date.now()).toLocaleDateString('fr-FR')}
              </Text>
            </View>
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

          {lineItems?.filter(item => item.description && item.description.trim()).map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 4 }]}>{item.description}</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>Conforme</Text>
            </View>
          ))}
        </View>

        {/* Notes */}
        {deliveryData?.notes && deliveryData.notes.trim() && (
          <View style={styles.notes}>
            <Text style={styles.sectionTitle}>NOTES :</Text>
            <Text>{deliveryData.notes}</Text>
          </View>
        )}

        {/* Footer fixe en bas de page - only show if footer_content exists and footer_display allows it */}
        {settings?.footer_content && settings?.footer_content.trim() && 
         (settings?.footer_display === 'all' || settings?.footer_display === 'delivery_notes_only') && (
          <View style={styles.footer} fixed>
            <Text>{settings.footer_content}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};
