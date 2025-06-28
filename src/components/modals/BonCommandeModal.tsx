import { useState, useEffect } from 'react';
import { Plus, Trash2, CalendarIcon, Eye, Save, Printer, Download, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { BonCommandeFournisseur, LigneBonCommande } from '@/types/bonCommande';
import { useBonCommandePDF } from '@/hooks/useBonCommandePDF';
import { useFournisseurs } from '@/hooks/useFournisseurs';
import { useCurrency } from '@/contexts/CurrencyContext';
import { EmailModal } from '@/components/modals/EmailModal';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface BonCommandeModalProps {
  isOpen: boolean;
  onClose: () => void;
  bonCommande?: BonCommandeFournisseur | null;
  onSave: (data: any) => void;
}

// Interface étendue pour les lignes avec notes et remise
interface LigneBonCommandeEtendue extends LigneBonCommande {
  notes?: string;
  remise?: number;
}

export const BonCommandeModal = ({ isOpen, onClose, bonCommande, onSave }: BonCommandeModalProps) => {
  const { exportToPDF } = useBonCommandePDF();
  const { fournisseurs, loading: fournisseursLoading } = useFournisseurs();
  const { currency } = useCurrency();
  const { toast } = useToast();
  const { user, organization } = useAuth();
  
  const [formData, setFormData] = useState<{
    numero: string;
    fournisseurId: string;
    dateCommande: Date;
    statut: 'brouillon' | 'en_attente' | 'validee' | 'livree' | 'annulee';
    remise: number;
    remarques: string;
  }>({
    numero: '',
    fournisseurId: '',
    dateCommande: new Date(),
    statut: 'brouillon',
    remise: 0,
    remarques: '',
  });

  const [lignes, setLignes] = useState<LigneBonCommandeEtendue[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  useEffect(() => {
    if (bonCommande) {
      setFormData({
        numero: bonCommande.numero,
        fournisseurId: bonCommande.fournisseurId,
        dateCommande: new Date(bonCommande.dateCommande),
        statut: bonCommande.statut,
        remise: bonCommande.remise || 0,
        remarques: bonCommande.remarques || '',
      });
      setLignes(bonCommande.lignes.map(ligne => ({ ...ligne, notes: '' })));
      setSelectedDate(new Date(bonCommande.dateCommande));
    } else {
      const nextNumber = `BC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`;
      setFormData({
        numero: nextNumber,
        fournisseurId: '',
        dateCommande: new Date(),
        statut: 'brouillon',
        remise: 0,
        remarques: '',
      });
      setLignes([]);
      setSelectedDate(new Date());
    }
  }, [bonCommande, isOpen]);

  const ajouterLigne = () => {
    const nouvelleLigne: LigneBonCommandeEtendue = {
      id: Date.now().toString(),
      designation: '',
      quantite: 1,
      prixUnitaireHT: 0,
      tva: 20,
      totalHT: 0,
      notes: '',
      remise: 0,
    };
    setLignes([...lignes, nouvelleLigne]);
  };

  const supprimerLigne = (id: string) => {
    setLignes(lignes.filter(ligne => ligne.id !== id));
  };

  const modifierLigne = (id: string, champ: keyof LigneBonCommandeEtendue, valeur: any) => {
    setLignes(lignes.map(ligne => {
      if (ligne.id === id) {
        const ligneMise = { ...ligne, [champ]: valeur };
        if (champ === 'quantite' || champ === 'prixUnitaireHT' || champ === 'remise') {
          const prixAvantRemise = ligneMise.quantite * ligneMise.prixUnitaireHT;
          const remiseAmount = (prixAvantRemise * (ligneMise.remise || 0)) / 100;
          ligneMise.totalHT = prixAvantRemise - remiseAmount;
        }
        return ligneMise;
      }
      return ligne;
    }));
  };

  const calculerTotaux = () => {
    const totalHT = lignes.reduce((sum, ligne) => sum + ligne.totalHT, 0);
    const remiseAmount = (totalHT * formData.remise) / 100;
    const totalHTApresRemise = totalHT - remiseAmount;
    const totalTVA = lignes.reduce((sum, ligne) => sum + (ligne.totalHT * ligne.tva / 100), 0);
    const totalTTC = totalHTApresRemise + totalTVA;

    return {
      totalHT,
      remiseAmount,
      totalHTApresRemise,
      totalTVA,
      totalTTC
    };
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} ${currency.symbol}`;
  };

  const formatDate = (date: Date) => {
    return format(date, "dd/MM/yyyy", { locale: fr });
  };

  const getCompanyData = () => ({
    name: organization?.name || user?.user_metadata?.company_name || 'Mon Entreprise',
    logo: organization?.logo_url || user?.user_metadata?.avatar_url,
    address: organization?.address || user?.user_metadata?.company_address,
    email: organization?.email || user?.email,
    phone: organization?.phone || user?.user_metadata?.company_phone,
  });

  const getStatusLabel = (statut: string) => {
    const labels = {
      'brouillon': 'Brouillon',
      'en_attente': 'En attente',
      'validee': 'Validée',
      'livree': 'Livrée',
      'annulee': 'Annulée'
    };
    return labels[statut as keyof typeof labels] || statut;
  };

  const createTempBonCommande = (): BonCommandeFournisseur => {
    const totaux = calculerTotaux();
    return {
      id: bonCommande?.id || 'temp',
      numero: formData.numero,
      fournisseurId: formData.fournisseurId,
      fournisseurNom: fournisseurs.find(f => f.id === formData.fournisseurId)?.nom || '',
      dateCommande: selectedDate?.toISOString().split('T')[0] || '',
      statut: formData.statut,
      montantHT: totaux.totalHTApresRemise,
      montantTTC: totaux.totalTTC,
      remise: formData.remise,
      remarques: formData.remarques,
      lignes: lignes.map(({ notes, ...ligne }) => ligne),
      organisationId: bonCommande?.organisationId || 'org1',
      dateCreation: bonCommande?.dateCreation || new Date().toISOString()
    };
  };

  const handlePreview = () => {
    const tempBonCommande = createTempBonCommande();
    exportToPDF(tempBonCommande);
    toast({
      title: "Aperçu généré",
      description: "L'aperçu PDF du bon de commande a été ouvert.",
    });
  };

  const handleSave = () => {
    const totaux = calculerTotaux();
    const fournisseurSelectionne = fournisseurs.find(f => f.id === formData.fournisseurId);
    
    const bonCommandeData = {
      ...formData,
      fournisseurNom: fournisseurSelectionne?.nom || '',
      dateCommande: selectedDate?.toISOString().split('T')[0] || '',
      montantHT: totaux.totalHTApresRemise,
      montantTTC: totaux.totalTTC,
      lignes: lignes.map(({ notes, ...ligne }) => ligne),
    };

    onSave(bonCommandeData);
    toast({
      title: "Bon de commande sauvegardé",
      description: "Le bon de commande a été enregistré avec succès.",
    });
  };

  const handlePrint = () => {
    const tempBonCommande = createTempBonCommande();
    exportToPDF(tempBonCommande);
    setTimeout(() => {
      window.print();
    }, 1000);
    toast({
      title: "Impression lancée",
      description: "Le bon de commande va être imprimé.",
    });
  };

  const handleDownload = () => {
    const tempBonCommande = createTempBonCommande();
    exportToPDF(tempBonCommande);
    toast({
      title: "Téléchargement lancé",
      description: "Le PDF du bon de commande a été téléchargé.",
    });
  };

  const handleEmail = () => {
    setIsEmailModalOpen(true);
  };

  const handleEmailSent = (emailData: any) => {
    console.log('Email envoyé:', emailData);
    toast({
      title: "Email envoyé",
      description: "Le bon de commande a été envoyé par email avec succès.",
    });
  };

  const totaux = calculerTotaux();
  const company = getCompanyData();
  const selectedFournisseur = fournisseurs.find(f => f.id === formData.fournisseurId);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
          <DialogHeader className="border-b-2 border-[#6A9C89] pb-4 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-3xl font-bold text-[#6A9C89] mb-2">
                  BON DE COMMANDE
                </DialogTitle>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>N° {formData.numero}</div>
                  <div>Date: {selectedDate ? formatDate(selectedDate) : ''}</div>
                </div>
              </div>
              <div className="text-right">
                {company.logo && (
                  <img src={company.logo} alt="Logo" className="w-16 h-16 object-contain mb-2 ml-auto" />
                )}
                {company.name && (
                  <div className="font-bold text-lg text-gray-800">{company.name}</div>
                )}
                {company.email && (
                  <div className="text-sm text-gray-600">{company.email}</div>
                )}
                {company.address && (
                  <div className="text-sm text-gray-600">{company.address}</div>
                )}
                {company.phone && (
                  <div className="text-sm text-gray-600">{company.phone}</div>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Sections d'informations style PDF */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">
                  Informations de commande
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs font-bold text-gray-600 uppercase">Numéro:</Label>
                    <Input
                      value={formData.numero}
                      onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-bold text-gray-600 uppercase">Date:</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal mt-1",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label className="text-xs font-bold text-gray-600 uppercase">Statut:</Label>
                    <div className="mt-1">
                      <Select value={formData.statut} onValueChange={(value: 'brouillon' | 'en_attente' | 'validee' | 'livree' | 'annulee') => setFormData({ ...formData, statut: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="brouillon">Brouillon</SelectItem>
                          <SelectItem value="en_attente">En attente</SelectItem>
                          <SelectItem value="validee">Validée</SelectItem>
                          <SelectItem value="livree">Livrée</SelectItem>
                          <SelectItem value="annulee">Annulée</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">
                  Fournisseur
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs font-bold text-gray-600 uppercase">Nom:</Label>
                    <Select 
                      value={formData.fournisseurId} 
                      onValueChange={(value) => setFormData({ ...formData, fournisseurId: value })}
                      disabled={fournisseursLoading}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder={fournisseursLoading ? "Chargement..." : "Sélectionner un fournisseur"} />
                      </SelectTrigger>
                      <SelectContent>
                        {!fournisseursLoading && fournisseurs.map((fournisseur) => (
                          <SelectItem key={fournisseur.id} value={fournisseur.id}>
                            {fournisseur.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedFournisseur && (
                    <div className="text-sm text-gray-600 space-y-1">
                      {selectedFournisseur.email && (
                        <div>{selectedFournisseur.email}</div>
                      )}
                      {selectedFournisseur.telephone && (
                        <div>{selectedFournisseur.telephone}</div>
                      )}
                      {selectedFournisseur.adresse && (
                        <div>{selectedFournisseur.adresse.rue}, {selectedFournisseur.adresse.ville} {selectedFournisseur.adresse.codePostal}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section Articles commandés */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 border-b border-gray-300 pb-2">
                  Articles commandés
                </h3>
                <Button onClick={ajouterLigne} className="bg-[#6A9C89] hover:bg-[#5A8B7A]">
                  <Plus size={16} className="mr-2" />
                  Ajouter une ligne
                </Button>
              </div>

              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left p-3 border-r border-gray-300 font-bold text-gray-800 w-[35%]">
                        Désignation
                      </th>
                      <th className="text-left p-3 border-r border-gray-300 font-bold text-gray-800 w-[10%]">
                        Quantité
                      </th>
                      <th className="text-left p-3 border-r border-gray-300 font-bold text-gray-800 w-[12%]">
                        Prix unitaire HT
                      </th>
                      <th className="text-left p-3 border-r border-gray-300 font-bold text-gray-800 w-[8%]">
                        Remise (%)
                      </th>
                      <th className="text-left p-3 border-r border-gray-300 font-bold text-gray-800 w-[8%]">
                        TVA (%)
                      </th>
                      <th className="text-left p-3 border-r border-gray-300 font-bold text-gray-800 w-[12%]">
                        Total HT
                      </th>
                      <th className="text-left p-3 font-bold text-gray-800 w-[5%]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {lignes.map((ligne, index) => (
                      <tr key={ligne.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="p-3 border-r border-gray-200 border-b border-gray-200">
                          <Input
                            value={ligne.designation}
                            onChange={(e) => modifierLigne(ligne.id, 'designation', e.target.value)}
                            placeholder="Description de l'article"
                            className="font-medium mb-2"
                          />
                          <Textarea
                            value={ligne.notes || ''}
                            onChange={(e) => modifierLigne(ligne.id, 'notes', e.target.value)}
                            placeholder="Notes et spécifications..."
                            rows={2}
                            className="text-sm"
                          />
                        </td>
                        <td className="p-3 border-r border-gray-200 border-b border-gray-200">
                          <Input
                            type="number"
                            value={ligne.quantite}
                            onChange={(e) => modifierLigne(ligne.id, 'quantite', Number(e.target.value))}
                            min="1"
                            className="w-full"
                          />
                        </td>
                        <td className="p-3 border-r border-gray-200 border-b border-gray-200">
                          <Input
                            type="number"
                            value={ligne.prixUnitaireHT}
                            onChange={(e) => modifierLigne(ligne.id, 'prixUnitaireHT', Number(e.target.value))}
                            min="0"
                            step="0.01"
                            className="w-full"
                          />
                        </td>
                        <td className="p-3 border-r border-gray-200 border-b border-gray-200">
                          <Input
                            type="number"
                            value={ligne.remise || 0}
                            onChange={(e) => modifierLigne(ligne.id, 'remise', Number(e.target.value))}
                            min="0"
                            max="100"
                            className="w-full"
                          />
                        </td>
                        <td className="p-3 border-r border-gray-200 border-b border-gray-200">
                          <Input
                            type="number"
                            value={ligne.tva}
                            onChange={(e) => modifierLigne(ligne.id, 'tva', Number(e.target.value))}
                            min="0"
                            max="100"
                            className="w-full"
                          />
                        </td>
                        <td className="p-3 border-r border-gray-200 border-b border-gray-200 font-medium text-gray-800">
                          {formatCurrency(ligne.totalHT)}
                        </td>
                        <td className="p-3 border-b border-gray-200">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => supprimerLigne(ligne.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {lignes.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-gray-500 border-b border-gray-200">
                          Aucune ligne ajoutée. Cliquez sur "Ajouter une ligne" pour commencer.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section Totaux style PDF */}
            <div className="flex justify-end">
              <div className="w-80 space-y-3">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Total HT:</span>
                  <span className="font-medium">{formatCurrency(totaux.totalHT)}</span>
                </div>
                {formData.remise > 0 && (
                  <>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Remise ({formData.remise}%):</span>
                      <span className="font-medium">-{formatCurrency(totaux.remiseAmount)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Total HT après remise:</span>
                      <span className="font-medium">{formatCurrency(totaux.totalHTApresRemise)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Total TVA:</span>
                  <span className="font-medium">{formatCurrency(totaux.totalTVA)}</span>
                </div>
                <div className="flex justify-between py-3 border-t-2 border-[#6A9C89] font-bold text-lg text-[#6A9C89]">
                  <span>Total TTC:</span>
                  <span>{formatCurrency(totaux.totalTTC)}</span>
                </div>
              </div>
            </div>

            {/* Section Remise globale */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-xs font-bold text-gray-600 uppercase">Remise globale (%):</Label>
                <Input
                  type="number"
                  value={formData.remise}
                  onChange={(e) => setFormData({ ...formData, remise: Number(e.target.value) })}
                  min="0"
                  max="100"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Section Remarques */}
            {(formData.remarques || !bonCommande) && (
              <div>
                <h3 className="font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">
                  Remarques
                </h3>
                <Textarea
                  value={formData.remarques}
                  onChange={(e) => setFormData({ ...formData, remarques: e.target.value })}
                  placeholder="Conditions de livraison, remarques particulières..."
                  rows={3}
                />
              </div>
            )}

            {/* Boutons d'action */}
            <div className="flex flex-wrap justify-between gap-2 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  onClick={handlePreview}
                  className="flex items-center gap-2"
                >
                  <Eye size={16} />
                  Aperçu
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handlePrint}
                  className="flex items-center gap-2"
                >
                  <Printer size={16} />
                  Imprimer
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleDownload}
                  className="flex items-center gap-2"
                >
                  <Download size={16} />
                  Télécharger
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleEmail}
                  className="flex items-center gap-2"
                  disabled={!formData.fournisseurId}
                >
                  <Mail size={16} />
                  Envoyer
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Annuler
                </Button>
                <Button 
                  onClick={handleSave}
                  className="bg-[#6A9C89] hover:bg-[#5A8B7A] flex items-center gap-2"
                  disabled={!formData.fournisseurId || lignes.length === 0}
                >
                  <Save size={16} />
                  Enregistrer
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal d'envoi d'email */}
      <EmailModal
        open={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        document={{
          id: bonCommande?.id || 'temp',
          number: formData.numero,
          client: fournisseurs.find(f => f.id === formData.fournisseurId)?.nom || '',
          type: 'Bon de commande'
        }}
        onSend={handleEmailSent}
      />
    </>
  );
};
