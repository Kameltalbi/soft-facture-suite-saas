
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { BonCommandeFournisseur } from '@/types/bonCommande';

interface BonCommandePDFProps {
  bonCommande: BonCommandeFournisseur;
  fournisseur?: {
    nom: string;
    adresse: {
      rue: string;
      ville: string;
      codePostal: string;
      pays: string;
    };
    contactPrincipal: {
      nom: string;
      email: string;
      telephone: string;
    };
  };
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6A9C89',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  column: {
    flexDirection: 'column',
    width: '48%',
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#666666',
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 8,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#F5F5F5',
  },
  tableColHeader: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 8,
  },
  tableCol: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 8,
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333333',
  },
  tableCell: {
    fontSize: 9,
    color: '#333333',
  },
  totalsSection: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginBottom: 3,
  },
  totalLabel: {
    fontSize: 10,
    color: '#666666',
  },
  totalValue: {
    fontSize: 10,
    color: '#333333',
  },
  grandTotal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6A9C89',
  },
  statusBadge: {
    backgroundColor: '#E8F5E8',
    borderRadius: 4,
    padding: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 10,
    color: '#6A9C89',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    borderTop: 1,
    borderColor: '#E0E0E0',
    paddingTop: 15,
  },
  footerText: {
    fontSize: 9,
    color: '#666666',
    textAlign: 'center',
  },
});

const getStatusLabel = (statut: BonCommandeFournisseur['statut']) => {
  const labels = {
    'brouillon': 'Brouillon',
    'en_attente': 'En attente',
    'validee': 'Validée',
    'livree': 'Livrée',
    'annulee': 'Annulée'
  };
  return labels[statut];
};

export const BonCommandePDF = ({ bonCommande, fournisseur }: BonCommandePDFProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`;
  };

  const calculateTotals = () => {
    const totalHT = bonCommande.lignes.reduce((sum, ligne) => sum + ligne.totalHT, 0);
    const remiseAmount = (totalHT * (bonCommande.remise || 0)) / 100;
    const totalHTApresRemise = totalHT - remiseAmount;
    const totalTVA = bonCommande.lignes.reduce((sum, ligne) => sum + (ligne.totalHT * ligne.tva / 100), 0);
    
    return {
      totalHT,
      remiseAmount,
      totalHTApresRemise,
      totalTVA,
      totalTTC: bonCommande.montantTTC
    };
  };

  const totaux = calculateTotals();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.title}>BON DE COMMANDE</Text>
          <Text style={styles.subtitle}>N° {bonCommande.numero}</Text>
          <Text style={styles.subtitle}>Date: {formatDate(bonCommande.dateCommande)}</Text>
        </View>

        {/* Informations du bon de commande et fournisseur */}
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Informations de commande</Text>
            <View>
              <Text style={styles.label}>Numéro:</Text>
              <Text style={styles.value}>{bonCommande.numero}</Text>
            </View>
            <View>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>{formatDate(bonCommande.dateCommande)}</Text>
            </View>
            <View>
              <Text style={styles.label}>Statut:</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{getStatusLabel(bonCommande.statut)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Fournisseur</Text>
            <View>
              <Text style={styles.label}>Nom:</Text>
              <Text style={styles.value}>{bonCommande.fournisseurNom}</Text>
            </View>
            {fournisseur && (
              <>
                <View>
                  <Text style={styles.label}>Contact:</Text>
                  <Text style={styles.value}>{fournisseur.contactPrincipal.nom}</Text>
                  <Text style={styles.value}>{fournisseur.contactPrincipal.email}</Text>
                  <Text style={styles.value}>{fournisseur.contactPrincipal.telephone}</Text>
                </View>
                <View>
                  <Text style={styles.label}>Adresse:</Text>
                  <Text style={styles.value}>
                    {fournisseur.adresse.rue}, {fournisseur.adresse.ville} {fournisseur.adresse.codePostal}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Tableau des articles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Articles commandés</Text>
          <View style={styles.table}>
            {/* En-tête du tableau */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={[styles.tableColHeader, { width: '35%' }]}>
                <Text style={styles.tableCellHeader}>Désignation</Text>
              </View>
              <View style={[styles.tableColHeader, { width: '15%' }]}>
                <Text style={styles.tableCellHeader}>Quantité</Text>
              </View>
              <View style={[styles.tableColHeader, { width: '15%' }]}>
                <Text style={styles.tableCellHeader}>Prix unitaire HT</Text>
              </View>
              <View style={[styles.tableColHeader, { width: '15%' }]}>
                <Text style={styles.tableCellHeader}>TVA (%)</Text>
              </View>
              <View style={[styles.tableColHeader, { width: '20%' }]}>
                <Text style={styles.tableCellHeader}>Total HT</Text>
              </View>
            </View>

            {/* Lignes du tableau */}
            {bonCommande.lignes.map((ligne) => (
              <View key={ligne.id} style={styles.tableRow}>
                <View style={[styles.tableCol, { width: '35%' }]}>
                  <Text style={styles.tableCell}>{ligne.designation}</Text>
                </View>
                <View style={[styles.tableCol, { width: '15%' }]}>
                  <Text style={styles.tableCell}>{ligne.quantite}</Text>
                </View>
                <View style={[styles.tableCol, { width: '15%' }]}>
                  <Text style={styles.tableCell}>{formatCurrency(ligne.prixUnitaireHT)}</Text>
                </View>
                <View style={[styles.tableCol, { width: '15%' }]}>
                  <Text style={styles.tableCell}>{ligne.tva}%</Text>
                </View>
                <View style={[styles.tableCol, { width: '20%' }]}>
                  <Text style={styles.tableCell}>{formatCurrency(ligne.totalHT)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Totaux */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total HT:</Text>
            <Text style={styles.totalValue}>{formatCurrency(totaux.totalHT)}</Text>
          </View>
          {bonCommande.remise && bonCommande.remise > 0 && (
            <>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Remise ({bonCommande.remise}%):</Text>
                <Text style={styles.totalValue}>-{formatCurrency(totaux.remiseAmount)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total HT après remise:</Text>
                <Text style={styles.totalValue}>{formatCurrency(totaux.totalHTApresRemise)}</Text>
              </View>
            </>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total TVA:</Text>
            <Text style={styles.totalValue}>{formatCurrency(totaux.totalTVA)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.grandTotal}>Total TTC:</Text>
            <Text style={styles.grandTotal}>{formatCurrency(totaux.totalTTC)}</Text>
          </View>
        </View>

        {/* Remarques */}
        {bonCommande.remarques && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Remarques</Text>
            <Text style={styles.value}>{bonCommande.remarques}</Text>
          </View>
        )}

        {/* Pied de page */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Bon de commande généré le {new Date().toLocaleDateString('fr-FR')}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
