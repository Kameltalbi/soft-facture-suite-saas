
export interface LigneBonCommande {
  id: string;
  designation: string;
  quantite: number;
  prixUnitaireHT: number;
  tva: number;
  totalHT: number;
}

export interface BonCommandeFournisseur {
  id: string;
  numero: string;
  fournisseurId: string;
  fournisseurNom: string;
  dateCommande: string;
  statut: 'brouillon' | 'en_attente' | 'validee' | 'livree' | 'annulee';
  montantHT: number;
  montantTTC: number;
  remise?: number;
  remarques?: string;
  lignes: LigneBonCommande[];
  organisationId: string;
  dateCreation: string;
}

export interface CreateBonCommandeData extends Omit<BonCommandeFournisseur, 'id' | 'dateCreation' | 'organisationId'> {}
