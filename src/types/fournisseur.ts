
export interface Fournisseur {
  id: string;
  nom: string;
  contactPrincipal: {
    nom: string;
    email: string;
    telephone: string;
  };
  adresse: {
    rue: string;
    ville: string;
    codePostal: string;
    pays: string;
  };
  matriculeFiscal?: string;
  secteurActivite: string;
  statut: 'actif' | 'inactif';
  notesInternes?: string;
  dateAjout: string;
  organisationId: string;
}

export interface CreateFournisseurData extends Omit<Fournisseur, 'id' | 'dateAjout' | 'organisationId'> {}
