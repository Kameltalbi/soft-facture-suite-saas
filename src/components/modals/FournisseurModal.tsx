
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Fournisseur, CreateFournisseurData } from '@/types/fournisseur';

interface FournisseurModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CreateFournisseurData) => void;
  fournisseur?: Fournisseur | null;
}

const secteursActivite = [
  'Agriculture',
  'Alimentation',
  'Automobile',
  'BTP & Construction',
  'Commerce',
  'Consulting',
  'Électronique',
  'Énergie',
  'Finance',
  'Immobilier',
  'Industrie',
  'Informatique',
  'Logistique',
  'Médical & Santé',
  'Services',
  'Textile',
  'Transport',
  'Autre'
];

export function FournisseurModal({ open, onClose, onSave, fournisseur }: FournisseurModalProps) {
  const [formData, setFormData] = useState<CreateFournisseurData>({
    nom: '',
    contactPrincipal: {
      nom: '',
      email: '',
      telephone: ''
    },
    adresse: {
      rue: '',
      ville: '',
      codePostal: '',
      pays: 'France'
    },
    matriculeFiscal: '',
    secteurActivite: '',
    statut: 'actif',
    notesInternes: ''
  });

  useEffect(() => {
    if (fournisseur) {
      setFormData({
        nom: fournisseur.nom,
        contactPrincipal: fournisseur.contactPrincipal,
        adresse: fournisseur.adresse,
        matriculeFiscal: fournisseur.matriculeFiscal || '',
        secteurActivite: fournisseur.secteurActivite,
        statut: fournisseur.statut,
        notesInternes: fournisseur.notesInternes || ''
      });
    } else {
      setFormData({
        nom: '',
        contactPrincipal: {
          nom: '',
          email: '',
          telephone: ''
        },
        adresse: {
          rue: '',
          ville: '',
          codePostal: '',
          pays: 'France'
        },
        matriculeFiscal: '',
        secteurActivite: '',
        statut: 'actif',
        notesInternes: ''
      });
    }
  }, [fournisseur, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const updateField = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {fournisseur ? 'Modifier le fournisseur' : 'Ajouter un fournisseur'}
          </DialogTitle>
          <DialogDescription>
            {fournisseur 
              ? 'Modifiez les informations du fournisseur'
              : 'Ajoutez un nouveau fournisseur à votre liste'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations générales */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Informations générales</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nom">Nom du fournisseur *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => updateField('nom', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="matriculeFiscal">Matricule fiscal / SIRET</Label>
                <Input
                  id="matriculeFiscal"
                  value={formData.matriculeFiscal}
                  onChange={(e) => updateField('matriculeFiscal', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="secteurActivite">Secteur d'activité *</Label>
                <Select 
                  value={formData.secteurActivite} 
                  onValueChange={(value) => updateField('secteurActivite', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un secteur" />
                  </SelectTrigger>
                  <SelectContent>
                    {secteursActivite.map((secteur) => (
                      <SelectItem key={secteur} value={secteur}>
                        {secteur}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="statut">Statut</Label>
                <Select 
                  value={formData.statut} 
                  onValueChange={(value: 'actif' | 'inactif') => updateField('statut', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="inactif">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Contact principal */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Contact principal</h3>
            
            <div>
              <Label htmlFor="contactNom">Nom du contact *</Label>
              <Input
                id="contactNom"
                value={formData.contactPrincipal.nom}
                onChange={(e) => updateField('contactPrincipal.nom', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactEmail">Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactPrincipal.email}
                  onChange={(e) => updateField('contactPrincipal.email', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="contactTelephone">Téléphone *</Label>
                <Input
                  id="contactTelephone"
                  value={formData.contactPrincipal.telephone}
                  onChange={(e) => updateField('contactPrincipal.telephone', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Adresse */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Adresse</h3>
            
            <div>
              <Label htmlFor="rue">Rue</Label>
              <Input
                id="rue"
                value={formData.adresse.rue}
                onChange={(e) => updateField('adresse.rue', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="codePostal">Code postal</Label>
                <Input
                  id="codePostal"
                  value={formData.adresse.codePostal}
                  onChange={(e) => updateField('adresse.codePostal', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="ville">Ville</Label>
                <Input
                  id="ville"
                  value={formData.adresse.ville}
                  onChange={(e) => updateField('adresse.ville', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="pays">Pays</Label>
                <Input
                  id="pays"
                  value={formData.adresse.pays}
                  onChange={(e) => updateField('adresse.pays', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Notes internes */}
          <div>
            <Label htmlFor="notesInternes">Notes internes</Label>
            <Textarea
              id="notesInternes"
              value={formData.notesInternes}
              onChange={(e) => updateField('notesInternes', e.target.value)}
              placeholder="Ajoutez des notes internes sur ce fournisseur..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="bg-[#6A9C89] hover:bg-[#5a8473]"
            >
              {fournisseur ? 'Modifier' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
