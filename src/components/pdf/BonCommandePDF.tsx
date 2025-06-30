
import React from 'react';
import { TemplatedInvoicePDF } from './TemplatedInvoicePDF';
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
  company?: {
    name: string;
    logo?: string;
    address?: string;
    email?: string;
    phone?: string;
  };
  settings?: {
    showVat: boolean;
    showDiscount: boolean;
    currency: string;
    amountInWords: boolean;
    purchase_order_template?: string;
    unified_template?: string;
    use_unified_template?: boolean;
  };
}

export const BonCommandePDF: React.FC<BonCommandePDFProps> = ({
  bonCommande,
  fournisseur,
  company,
  settings = {
    showVat: true,
    showDiscount: false,
    currency: 'EUR',
    amountInWords: true
  }
}) => {
  // Transformer les données du bon de commande en format compatible avec TemplatedInvoicePDF
  const invoiceData = {
    number: bonCommande.numero,
    date: bonCommande.dateCommande,
    dueDate: bonCommande.dateCommande,
    clientId: 'mock-supplier-id',
    subject: `Bon de commande fournisseur`,
    notes: bonCommande.remarques || ''
  };

  // Transformer les lignes du bon de commande
  const lineItems = bonCommande.lignes.map(ligne => ({
    id: ligne.id,
    description: ligne.designation,
    quantity: ligne.quantite,
    unitPrice: ligne.prixUnitaireHT,
    vatRate: ligne.tva,
    discount: 0,
    total: ligne.totalHT
  }));

  // Transformer les données fournisseur en format client
  const clientData = {
    name: bonCommande.fournisseurNom,
    company: bonCommande.fournisseurNom,
    address: fournisseur ? `${fournisseur.adresse.rue}, ${fournisseur.adresse.ville} ${fournisseur.adresse.codePostal}` : '123 Rue du Fournisseur, 75001 Paris',
    email: fournisseur?.contactPrincipal.email || 'contact@fournisseur.com'
  };

  // Transformer les données société
  const companyData = company || {
    name: 'Soft Facture',
    address: '456 Avenue de la République, 69000 Lyon',
    email: 'contact@softfacture.fr',
    phone: '04 72 00 00 00'
  };

  // Déterminer le template à utiliser
  let template = 'classic';
  if (settings.use_unified_template && settings.unified_template) {
    template = settings.unified_template;
  } else if (settings.purchase_order_template) {
    template = settings.purchase_order_template;
  }

  console.log('BonCommandePDF template selection:', {
    template,
    useUnifiedTemplate: settings.use_unified_template,
    unifiedTemplate: settings.unified_template,
    purchaseOrderTemplate: settings.purchase_order_template
  });

  return (
    <TemplatedInvoicePDF
      invoiceData={invoiceData}
      lineItems={lineItems}
      client={clientData}
      company={companyData}
      settings={settings}
      template={template}
      unifiedTemplate={settings.unified_template}
      useUnifiedTemplate={settings.use_unified_template}
      documentType="BON DE COMMANDE"
    />
  );
};
