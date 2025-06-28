
import { useState, useEffect } from 'react';
import { Plus, Trash2, CalendarIcon, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { BonCommandeFournisseur, LigneBonCommande } from '@/types/bonCommande';
import { useBonCommandePDF } from '@/hooks/useBonCommandePDF';
import { useFournisseurs } from '@/hooks/useFournisseurs';
import { useCurrency } from '@/contexts/CurrencyContext';

interface BonCommandeModalProps {
  isOpen: boolean;
  onClose: () => void;
  bonCommande?: BonCommandeFournisseur | null;
  onSave: (data: any) => void;
}

export const BonCommandeModal = ({ isOpen, onClose, bonCommande, onSave }: BonCommandeModalProps) => {
  const { exportToPDF } = useBonCommandePDF();
  const { fournisseurs, loading: fournisseursLoading } = useFournisseurs();
  const { currency } = useCurrency();
  
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

  const [lignes, setLignes] = useState<LigneBonCommande[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

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
      setLignes(bonCommande.lignes);
      setSelectedDate(new Date(bonCommande.dateCommande));
    } else {
      // Réinitialiser pour nouveau bon de commande
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
    const nouvelleLigne: LigneBonCommande = {
      id: Date.now().toString(),
      designation: '',
      quantite: 1,
      prixUnitaireHT: 0,
      tva: 20,
      totalHT: 0,
    };
    setLignes([...lignes, nouvelleLigne]);
  };

  const supprimerLigne = (id: string) => {
    setLignes(lignes.filter(ligne => ligne.id !== id));
  };

  const modifierLigne = (id: string, champ: keyof LigneBonCommande, valeur: any) => {
    setLignes(lignes.map(ligne => {
      if (ligne.id === id) {
        const ligneMise = { ...ligne, [champ]: valeur };
        // Recalculer le total
        ligneMise.totalHT = ligneMise.quantite * ligneMise.prixUnitaireHT;
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

  const handleSubmit = () => {
    const totaux = calculerTotaux();
    const fournisseurSelectionne = fournisseurs.find(f => f.id === formData.fournisseurId);
    
    const bonCommandeData = {
      ...formData,
      fournisseurNom: fournisseurSelectionne?.name || '',
      dateCommande: selectedDate?.toISOString().split('T')[0] || '',
      montantHT: totaux.totalHTApresRemise,
      montantTTC: totaux.totalTTC,
      lignes,
    };

    console.log('Saving bon de commande:', bonCommandeData);
    onSave(bonCommandeData);
  };

  const handleExportPDF = () => {
    if (bonCommande) {
      exportToPDF(bonCommande);
    } else {
      // Créer un bon de commande temporaire pour l'aperçu
      const totaux = calculerTotaux();
      const tempBonCommande: BonCommandeFournisseur = {
        id: 'temp',
        numero: formData.numero,
        fournisseurId: formData.fournisseurId,
        fournisseurNom: fournisseurs.find(f => f.id === formData.fournisseurId)?.name || '',
        dateCommande: selectedDate?.toISOString().split('T')[0] || '',
        statut: formData.statut,
        montantHT: totaux.totalHTApresRemise,
        montantTTC: totaux.totalTTC,
        remise: formData.remise,
        remarques: formData.remarques,
        lignes,
        organisationId: 'org1',
        dateCreation: new Date().toISOString()
      };
      exportToPDF(tempBonCommande);
    }
  };

  const totaux = calculerTotaux();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {bonCommande ? 'Modifier le bon de commande' : 'Créer un bon de commande'}
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations du bon de commande fournisseur
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="numero">Numéro du bon de commande</Label>
              <Input
                id="numero"
                value={formData.numero}
                onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="fournisseur">Fournisseur</Label>
              <Select 
                value={formData.fournisseurId} 
                onValueChange={(value) => setFormData({ ...formData, fournisseurId: value })}
                disabled={fournisseursLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={fournisseursLoading ? "Chargement..." : "Sélectionner un fournisseur"} />
                </SelectTrigger>
                <SelectContent>
                  {!fournisseursLoading && fournisseurs.map((fournisseur) => (
                    <SelectItem key={fournisseur.id} value={fournisseur.id}>
                      {fournisseur.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Date de commande</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
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
              <Label htmlFor="statut">Statut</Label>
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

          {/* Tableau des lignes */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Articles à commander</h3>
              <Button onClick={ajouterLigne} className="bg-[#6A9C89] hover:bg-[#5A8B7A]">
                <Plus size={16} className="mr-2" />
                Ajouter une ligne
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Désignation</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Prix unitaire HT</TableHead>
                  <TableHead>TVA (%)</TableHead>
                  <TableHead>Total HT</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lignes.map((ligne) => (
                  <TableRow key={ligne.id}>
                    <TableCell>
                      <Input
                        value={ligne.designation}
                        onChange={(e) => modifierLigne(ligne.id, 'designation', e.target.value)}
                        placeholder="Description de l'article"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={ligne.quantite}
                        onChange={(e) => modifierLigne(ligne.id, 'quantite', Number(e.target.value))}
                        min="1"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={ligne.prixUnitaireHT}
                        onChange={(e) => modifierLigne(ligne.id, 'prixUnitaireHT', Number(e.target.value))}
                        min="0"
                        step="0.01"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={ligne.tva}
                        onChange={(e) => modifierLigne(ligne.id, 'tva', Number(e.target.value))}
                        min="0"
                        max="100"
                      />
                    </TableCell>
                    <TableCell>
                      {formatCurrency(ligne.totalHT)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => supprimerLigne(ligne.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {lignes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Aucune ligne ajoutée. Cliquez sur "Ajouter une ligne" pour commencer.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Remise et totaux */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="remise">Remise globale (%)</Label>
              <Input
                id="remise"
                type="number"
                value={formData.remise}
                onChange={(e) => setFormData({ ...formData, remise: Number(e.target.value) })}
                min="0"
                max="100"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Récapitulatif</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Total HT:</span>
                  <span>{formatCurrency(totaux.totalHT)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Remise ({formData.remise}%):</span>
                  <span>-{formatCurrency(totaux.remiseAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total HT après remise:</span>
                  <span>{formatCurrency(totaux.totalHTApresRemise)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total TVA:</span>
                  <span>{formatCurrency(totaux.totalTVA)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-1">
                  <span>Total TTC:</span>
                  <span>{formatCurrency(totaux.totalTTC)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Remarques */}
          <div>
            <Label htmlFor="remarques">Remarques ou conditions</Label>
            <Textarea
              id="remarques"
              value={formData.remarques}
              onChange={(e) => setFormData({ ...formData, remarques: e.target.value })}
              placeholder="Conditions de livraison, remarques particulières..."
              rows={3}
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleExportPDF}
              className="flex items-center gap-2"
            >
              <FileText size={16} />
              Aperçu PDF
            </Button>
            
            <div className="flex gap-4">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button 
                onClick={handleSubmit}
                className="bg-[#6A9C89] hover:bg-[#5A8B7A]"
                disabled={!formData.fournisseurId || lignes.length === 0}
              >
                {bonCommande ? 'Modifier' : 'Créer'} le bon de commande
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
