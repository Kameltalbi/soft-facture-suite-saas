
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

const BonsCommandePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBonCommande, setSelectedBonCommande] = useState(null);

  const { purchaseOrders, loading, createPurchaseOrder } = usePurchaseOrders();

  const handleCreateBonCommande = () => {
    setSelectedBonCommande(null);
    setIsModalOpen(true);
  };

  const handleViewBonCommande = (bonCommande) => {
    console.log('Viewing bon de commande:', bonCommande.purchase_order_number);
  };

  const handleEditBonCommande = (bonCommande) => {
    setSelectedBonCommande(bonCommande);
    setIsModalOpen(true);
  };

  const handleDuplicateBonCommande = (bonCommande) => {
    console.log('Duplicating bon de commande:', bonCommande.purchase_order_number);
  };

  const handleConvertToDelivery = (bonCommande) => {
    console.log('Converting bon de commande to delivery:', bonCommande.purchase_order_number);
  };

  const handleDeleteBonCommande = (bonCommande) => {
    console.log('Deleting bon de commande:', bonCommande.purchase_order_number);
  };

  const handleEmailSent = (emailData) => {
    console.log('Sending email:', emailData);
  };

  const handleStatusChange = (bonCommande, newStatus) => {
    console.log('Changing status for bon de commande:', bonCommande.purchase_order_number, 'to:', newStatus);
  };

  const handleSaveBonCommande = async (data) => {
    console.log('Saving bon de commande:', data);
    setIsModalOpen(false);
  };

  const getStatutBadge = (statut) => {
    const variants = {
      'draft': 'secondary',
      'pending': 'default',
      'confirmed': 'default',
      'delivered': 'default',
      'cancelled': 'destructive'
    };

    const labels = {
      'draft': 'Brouillon',
      'pending': 'En attente',
      'confirmed': 'Confirmé',
      'delivered': 'Livré',
      'cancelled': 'Annulé'
    };

    return (
      <Badge variant={variants[statut] || 'secondary'}>
        {labels[statut] || statut}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatCurrency = (amount) => {
    return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`;
  };

  const filteredBonsCommande = purchaseOrders.filter(bonCommande =>
    bonCommande.purchase_order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bonCommande.suppliers?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Convert purchase orders to the expected format
  const convertedBonsCommande = filteredBonsCommande.map(po => ({
    id: po.id,
    numero: po.purchase_order_number,
    fournisseurId: po.supplier_id,
    fournisseurNom: po.suppliers?.name,
    dateCommande: po.date,
    dateCreation: po.created_at,
    statut: po.status as 'brouillon' | 'en_attente' | 'validee' | 'livree' | 'annulee',
    montantHT: po.subtotal,
    montantTTC: po.total_amount,
    remarques: po.notes,
    lignes: po.purchase_order_items || [],
    organisationId: po.organization_id,
    remise: po.discount || 0
  }));

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
