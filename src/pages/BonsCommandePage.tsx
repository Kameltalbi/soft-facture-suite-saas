
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
import { usePurchaseOrders } from '@/hooks/usePurchaseOrders';
import { BonCommandeFournisseur, LigneBonCommande } from '@/types/bonCommande';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useSettings } from '@/hooks/useSettings';
import { useAuth } from '@/hooks/useAuth';

const BonsCommandePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBonCommande, setSelectedBonCommande] = useState<BonCommandeFournisseur | null>(null);

  const { purchaseOrders, loading, createPurchaseOrder } = usePurchaseOrders();
  const { currency } = useCurrency();
  const { globalSettings } = useSettings();
  const { organization } = useAuth();

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

  const handleStatusChange = (bonCommande: BonCommandeFournisseur, newStatus: string) => {
    console.log('Changing status for bon de commande:', bonCommande.numero, 'to:', newStatus);
  };

  const handleSaveBonCommande = async (data: any) => {
    console.log('Saving bon de commande:', data);
    setIsModalOpen(false);
  };

  const getStatutBadge = (statut: string) => {
    const variants = {
      'draft': 'secondary' as const,
      'pending': 'default' as const,
      'confirmed': 'default' as const,
      'delivered': 'default' as const,
      'cancelled': 'destructive' as const
    };

    const labels = {
      'draft': 'Brouillon',
      'pending': 'En attente',
      'confirmed': 'Confirmé',
      'delivered': 'Livré',
      'cancelled': 'Annulé'
    };

    return (
      <Badge variant={variants[statut as keyof typeof variants] || 'secondary'}>
        {labels[statut as keyof typeof labels] || statut}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} ${currency.symbol}`;
  };

  const filteredBonsCommande = purchaseOrders.filter(bonCommande =>
    bonCommande.purchase_order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bonCommande.suppliers?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Convert purchase orders to the expected format with proper ligne mapping
  const convertedBonsCommande: BonCommandeFournisseur[] = filteredBonsCommande.map(po => ({
    id: po.id,
    numero: po.purchase_order_number,
    fournisseurId: po.supplier_id,
    fournisseurNom: po.suppliers?.name || '',
    dateCommande: po.date,
    dateCreation: po.created_at,
    statut: (() => {
      const statusMap: { [key: string]: BonCommandeFournisseur['statut'] } = {
        'draft': 'brouillon',
        'pending': 'en_attente',
        'confirmed': 'validee',
        'delivered': 'livree',
        'cancelled': 'annulee'
      };
      return statusMap[po.status || 'draft'] || 'brouillon';
    })(),
    montantHT: po.subtotal,
    montantTTC: po.total_amount,
    remarques: po.notes || '',
    lignes: (po.purchase_order_items || []).map(item => ({
      id: item.id,
      designation: item.description,
      quantite: Number(item.quantity),
      prixUnitaireHT: Number(item.unit_price),
      tva: Number(item.tax_rate),
      totalHT: Number(item.total_price)
    } as LigneBonCommande)),
    organisationId: po.organization_id,
    remise: po.discount || 0
  }));

  // Fonction pour obtenir les données PDF avec les paramètres de template
  const getBonCommandePDFData = (bonCommande: BonCommandeFournisseur) => {
    const companyData = {
      name: organization?.name || 'Soft Facture',
      address: organization?.address || '456 Avenue de la République, 69000 Lyon',
      email: organization?.email || 'contact@softfacture.fr',
      phone: organization?.phone || '04 72 00 00 00',
      logo: organization?.logo_url
    };

    const settings = {
      showVat: true,
      showDiscount: false,
      currency: currency.code,
      amountInWords: true,
      purchase_order_template: globalSettings?.quote_template || 'classic', // Utilise le même template que les devis
      unified_template: globalSettings?.unified_template || 'classic',
      use_unified_template: globalSettings?.use_unified_template || false
    };

    return {
      bonCommande,
      company: companyData,
      settings
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F9FA] p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement des bons de commande...</div>
        </div>
      </div>
    );
  }

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
              {convertedBonsCommande.length} bon(s) de commande trouvé(s)
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
                {convertedBonsCommande.map((bonCommande) => (
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
                        pdfData={getBonCommandePDFData(bonCommande)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {convertedBonsCommande.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-neutral-500">
                      {purchaseOrders.length === 0 ? 'Aucun bon de commande trouvé. Créez votre premier bon de commande !' : 'Aucun bon de commande ne correspond à votre recherche'}
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
          onSave={handleSaveBonCommande}
        />
      </div>
    </div>
  );
};

export default BonsCommandePage;
