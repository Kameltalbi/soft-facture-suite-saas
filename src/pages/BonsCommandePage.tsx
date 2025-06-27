
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
import { BonCommandePDF } from '@/components/pdf/BonCommandePDF';
import { BonCommandeFournisseur } from '@/types/bonCommande';
import { useBonCommandePDF } from '@/hooks/useBonCommandePDF';
import { useAuth } from '@/hooks/useAuth';

const BonsCommandePage = () => {
  const { exportToPDF } = useBonCommandePDF();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBonCommande, setSelectedBonCommande] = useState<BonCommandeFournisseur | null>(null);

  // Enhanced mock data with more realistic entries
  const [bonsCommande] = useState<BonCommandeFournisseur[]>([
    {
      id: '1',
      numero: 'BC-2025-0001',
      fournisseurId: 'f1',
      fournisseurNom: 'Fournisseur ABC',
      dateCommande: '2025-01-15',
      statut: 'en_attente',
      montantHT: 1200.00,
      montantTTC: 1440.00,
      lignes: [
        {
          id: '1',
          designation: 'Matériel informatique',
          quantite: 2,
          prixUnitaireHT: 600.00,
          tva: 20,
          totalHT: 1200.00
        }
      ],
      organisationId: 'org1',
      dateCreation: '2025-01-15T10:00:00Z'
    },
    {
      id: '2',
      numero: 'BC-2025-0002',
      fournisseurId: 'f2',
      fournisseurNom: 'Fournisseur XYZ',
      dateCommande: '2025-01-14',
      statut: 'validee',
      montantHT: 850.00,
      montantTTC: 1020.00,
      lignes: [
        {
          id: '2',
          designation: 'Fournitures de bureau',
          quantite: 1,
          prixUnitaireHT: 850.00,
          tva: 20,
          totalHT: 850.00
        }
      ],
      organisationId: 'org1',
      dateCreation: '2025-01-14T14:30:00Z'
    },
    {
      id: '3',
      numero: 'BC-2025-0003',
      fournisseurId: 'f3',
      fournisseurNom: 'Équipements Pro',
      dateCommande: '2025-01-13',
      statut: 'livree',
      montantHT: 2500.00,
      montantTTC: 3000.00,
      lignes: [
        {
          id: '3',
          designation: 'Équipement industriel',
          quantite: 1,
          prixUnitaireHT: 2500.00,
          tva: 20,
          totalHT: 2500.00
        }
      ],
      organisationId: 'org1',
      dateCreation: '2025-01-13T09:15:00Z'
    },
    {
      id: '4',
      numero: 'BC-2025-0004',
      fournisseurId: 'f4',
      fournisseurNom: 'Services Techniques',
      dateCommande: '2025-01-12',
      statut: 'brouillon',
      montantHT: 450.00,
      montantTTC: 540.00,
      lignes: [
        {
          id: '4',
          designation: 'Prestations de service',
          quantite: 3,
          prixUnitaireHT: 150.00,
          tva: 20,
          totalHT: 450.00
        }
      ],
      organisationId: 'org1',
      dateCreation: '2025-01-12T16:45:00Z'
    }
  ]);

  const handleCreateBonCommande = () => {
    setSelectedBonCommande(null);
    setIsModalOpen(true);
  };

  const handleViewBonCommande = (bonCommande: BonCommandeFournisseur) => {
    console.log('Viewing purchase order:', bonCommande.numero);
  };

  const handleEditBonCommande = (bonCommande: BonCommandeFournisseur) => {
    setSelectedBonCommande(bonCommande);
    setIsModalOpen(true);
  };

  const handleDuplicateBonCommande = (bonCommande: BonCommandeFournisseur) => {
    console.log('Duplicating purchase order:', bonCommande.numero);
  };

  const handleMarkAsReceived = (bonCommande: BonCommandeFournisseur) => {
    console.log('Marking as received:', bonCommande.numero);
  };

  const handleDeleteBonCommande = (bonCommande: BonCommandeFournisseur) => {
    console.log('Deleting purchase order:', bonCommande.numero);
  };

  const handleEmailSent = (emailData: any) => {
    console.log('Sending email:', emailData);
  };

  const getStatutBadge = (statut: BonCommandeFournisseur['statut']) => {
    const variants = {
      'brouillon': 'secondary',
      'en_attente': 'default',
      'validee': 'default',
      'livree': 'default',
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

  const filteredBonsCommande = bonsCommande.filter(bc =>
    bc.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bc.fournisseurNom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Informations de l'entreprise pour le PDF
  const company = {
    name: user?.user_metadata?.company_name || 'Mon Entreprise',
    logo: user?.user_metadata?.avatar_url,
    address: user?.user_metadata?.company_address,
    email: user?.email,
    phone: user?.user_metadata?.company_phone,
  };

  return (
    <div className="min-h-screen bg-[#F7F9FA] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Bons de commande</h1>
            <p className="text-neutral-600">Gérez vos commandes fournisseurs</p>
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
                  <TableHead>Date</TableHead>
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
                        pdfComponent={<BonCommandePDF bonCommande={bonCommande} company={company} />}
                        onView={() => handleViewBonCommande(bonCommande)}
                        onEdit={() => handleEditBonCommande(bonCommande)}
                        onDuplicate={() => handleDuplicateBonCommande(bonCommande)}
                        onMarkAsReceived={() => handleMarkAsReceived(bonCommande)}
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
