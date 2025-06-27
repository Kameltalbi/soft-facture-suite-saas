
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

// Nouveau type pour la base de données
export interface FournisseurDB {
  id: string;
  name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  vat_number: string | null;
  business_sector: string | null;
  status: 'active' | 'inactive' | null;
  internal_notes: string | null;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

// Fonction pour convertir les données DB vers le format UI
export function dbToFournisseur(dbFournisseur: FournisseurDB): Fournisseur {
  return {
    id: dbFournisseur.id,
    nom: dbFournisseur.name,
    contactPrincipal: {
      nom: dbFournisseur.contact_name || '',
      email: dbFournisseur.email || '',
      telephone: dbFournisseur.phone || ''
    },
    adresse: {
      rue: dbFournisseur.address || '',
      ville: dbFournisseur.city || '',
      codePostal: dbFournisseur.postal_code || '',
      pays: dbFournisseur.country || 'France'
    },
    matriculeFiscal: dbFournisseur.vat_number || undefined,
    secteurActivite: dbFournisseur.business_sector || '',
    statut: dbFournisseur.status === 'active' ? 'actif' : 'inactif',
    notesInternes: dbFournisseur.internal_notes || undefined,
    dateAjout: dbFournisseur.created_at,
    organisationId: dbFournisseur.organization_id
  };
}

// Fonction pour convertir les données UI vers le format DB
export function fournisseurToDb(fournisseur: Omit<Fournisseur, 'id' | 'dateAjout' | 'organisationId'>): Omit<FournisseurDB, 'id' | 'organization_id' | 'created_at' | 'updated_at'> {
  return {
    name: fournisseur.nom,
    contact_name: fournisseur.contactPrincipal.nom,
    email: fournisseur.contactPrincipal.email,
    phone: fournisseur.contactPrincipal.telephone,
    address: fournisseur.adresse.rue,
    city: fournisseur.adresse.ville,
    postal_code: fournisseur.adresse.codePostal,
    country: fournisseur.adresse.pays,
    vat_number: fournisseur.matriculeFiscal || null,
    business_sector: fournisseur.secteurActivite,
    status: fournisseur.statut === 'actif' ? 'active' : 'inactive',
    internal_notes: fournisseur.notesInternes || null
  };
}

export interface CreateFournisseurData extends Omit<Fournisseur, 'id' | 'dateAjout' | 'organisationId'> {}
