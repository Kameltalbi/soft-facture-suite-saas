import { useState } from 'react';
import { Plus, Search, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BonCommandeModal } from '@/components/modals/BonCommandeModal';
import { BonCommandeActionsMenu } from '@/components/bonCommande/BonCommandeActionsMenu';
import { BonCommandeFournisseur } from '@/types/bonCommande';

const BonsCommandePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBonCommande, setSelectedBonCommande] = useState<BonCommandeFournisseur | null>(null);

  // Enhanced mock data with more realistic entries
  const [bonsCommande] = useState<BonCommandeFournisseur[]>([
    {
      id: '1',
      numero: 'BC-2025-0001',
      fournisseurNom: 'Fournisseur Alpha',
      dateCommande: '2025-01-15',
      statut: 'en_attente',
      montantHT: 1500.00,
      montantTTC: 1800.00,
      remarques: 'Veuillez confirmer la réception de ce bon de commande.',
      lignes: [
        {
          id: '1',
          designation: 'Ordinateur portable',
          quantite: 2,
          prixUnitaireHT: 750.00,
          tva: 20,
          totalHT: 1500.00
        }
      ],
      organisationId: 'org1',
      dateCreationTimestamp: 1737000000,
      remise: 0
    },
    {
      id: '2',
      numero: 'BC-2025-0002',
      fournisseurNom: 'Fournisseur Beta',
      dateCommande: '2025-01-14',
      statut: 'validee',
      montantHT: 900.00,
      montantTTC: 1080.00,
      remarques: 'Livraison prévue sous 5 jours ouvrables.',
      lignes: [
        {
          id: '2',
          designation: 'Imprimante multifonction',
          quantite: 1,
          prixUnitaireHT: 900.00,
          tva: 20,
          totalHT: 900.00
        }
      ],
      organisationId: 'org1',
      dateCreationTimestamp: 1736913600,
      remise: 0
    },
    {
      id: '3',
      numero: 'BC-2025-0003',
      fournisseurNom: 'Fournisseur Gamma',
      dateCommande: '2025-01-13',
      statut: 'livree',
      montantHT: 3000.00,
      montantTTC: 3600.00,
      remarques: 'Facture à envoyer après la livraison.',
      lignes: [
        {
          id: '3',
          designation: 'Mobilier de bureau',
          quantite: 3,
          prixUnitaireHT: 1000.00,
          tva: 20,
          totalHT: 3000.00
        }
      ],
      organisationId: 'org1',
      dateCreationTimestamp: 1736828400,
      remise: 0
    },
    {
      id: '4',
      numero: 'BC-2025-0004',
      fournisseurNom: 'Fournisseur Delta',
      dateCommande: '2025-01-12',
      statut: 'brouillon',
      montantHT: 600.00,
      montantTTC: 720.00,
      remarques: 'Bon de commande en attente de validation.',
      lignes: [
        {
          id: '4',
          designation: 'Fournitures de bureau',
          quantite: 6,
          prixUnitaireHT: 100.00,
          tva: 20,
          totalHT: 600.00
        }
      ],
      organisationId: 'org1',
      dateCreationTimestamp: 1736748000,
      remise: 0
    }
  ]);

  const handleCreateBonCommande = () => {
    setSelectedBonCommande(null);
    setIsModalOpen(true);
  };

  const handleViewBonCommande = (bonCommande: BonCommandeFournisseur) => {
    console.log('Viewing bon de commande:', bonCommande.numero);
  };

  const handleEditBonCommande = (bonCommande: BonCommandeFournisseur) => {
    setSelectedBonCommande(bonCommande);
    setIsModalOpen(true);
  };

  const handleDuplicateBonCommande = (bonCommande: BonCommandeFournisseur) => {
    console.log('Duplicating bon de commande:', bonCommande.numero);
  };

  const handleConvertToDelivery = (bonCommande: BonCommandeFournisseur) => {
    console.log('Converting bon de commande to delivery:', bonCommande.numero);
  };

  const handleDeleteBonCommande = (bonCommande: BonCommandeFournisseur) => {
    console.log('Deleting bon de commande:', bonCommande.numero);
  };

  const handleEmailSent = (emailData: any) => {
    console.log('Sending email:', emailData);
  };

  const handleStatusChange = (bonCommande: BonCommandeFournisseur, newStatus: BonCommandeFournisseur['statut']) => {
    console.log('Changing status for bon de commande:', bonCommande.numero, 'to:', newStatus);
  };

  const getStatutBadge = (statut: BonCommandeFournisseur['statut']) => {
    const variants = {
      'brouillon': 'secondary',
      'en_attente': 'default',
      'validee': 'default',
      'livree': 'success',
      'annulee': 'destructive'
    } as const;

    const labels = {
      'brouillon': 'Brouillon',
      'en_attente': 'En attente',
      'validee': 'Validée',
      'livree': 'Livrée',
      'annulee': 'Annulée'
    };

    return (
      <Badge variant={variants[statut] || 'secondary'}>
        {labels[statut]}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`;
  };

  const filteredBonsCommande = bonsCommande.filter(bonCommande =>
    bonCommande.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bonCommande.fournisseurNom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F7F9FA] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Bons de Commande</h1>
            <p className="text-neutral-600">Gérez vos bons de commande</p>
          </div>
          <Button 
            onClick={handleCreateBonCommande}
            className="bg-[#6A9C89] hover:bg-[#5A8B7A] text-white"
          >
            <Plus size={20} className="mr-2" />
            Créer un bon de commande
          </Button>
        </div>

        {/* Filtres */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
                <Input
                  placeholder="Rechercher par numéro ou fournisseur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des bons de commande */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des bons de commande</CardTitle>
            <CardDescription>
              {filteredBonsCommande.length} bon(s) de commande trouvé(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Fournisseur</TableHead>
                  <TableHead>Date Commande</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Montant HT</TableHead>
                  <TableHead>Montant TTC</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBonsCommande.map((bonCommande) => (
                  <TableRow key={bonCommande.id} className="hover:bg-neutral-50">
                    <TableCell>
                      <div className="flex items-center">
                        <FileText size={16} className="mr-2 text-[#6A9C89]" />
                        <span className="font-medium">{bonCommande.numero}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{bonCommande.fournisseurNom}</span>
                    </TableCell>
                    <TableCell>
                      {formatDate(bonCommande.dateCommande)}
                    </TableCell>
                    <TableCell>
                      {getStatutBadge(bonCommande.statut)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(bonCommande.montantHT)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(bonCommande.montantTTC)}
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <BonCommandeActionsMenu
                        bonCommande={bonCommande}
                        onView={() => handleViewBonCommande(bonCommande)}
                        onEdit={() => handleEditBonCommande(bonCommande)}
                        onDuplicate={() => handleDuplicateBonCommande(bonCommande)}
                        onConvertToDelivery={() => handleConvertToDelivery(bonCommande)}
                        onStatusChange={(status) => handleStatusChange(bonCommande, status)}
                        onDelete={() => handleDeleteBonCommande(bonCommande)}
                        onEmailSent={handleEmailSent}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {filteredBonsCommande.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-neutral-500">
                      Aucun bon de commande trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modal */}
        <BonCommandeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          bonCommande={selectedBonCommande}
          onSave={(data) => {
            console.log('Sauvegarde du bon de commande:', data);
            setIsModalOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default BonsCommandePage;
