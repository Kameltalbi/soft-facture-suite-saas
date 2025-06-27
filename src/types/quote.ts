
export interface Quote {
  id: string;
  numero: string;
  clientNom: string;
  dateCreation: string;
  dateValidite: string;
  statut: 'brouillon' | 'en_attente' | 'validee' | 'acceptee' | 'refusee' | 'annulee';
  montantHT: number;
  montantTTC: number;
  objet: string;
  remarques: string;
  lignes: QuoteLigne[];
  organisationId: string;
  dateCreationTimestamp: number;
}

export interface QuoteLigne {
  id: string;
  designation: string;
  quantite: number;
  prixUnitaireHT: number;
  tva: number;
  totalHT: number;
}
