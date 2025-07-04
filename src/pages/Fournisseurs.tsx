
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Search, Users, Building, UserCheck, Calendar, Upload, Download } from 'lucide-react';
import { FournisseursTable } from '@/components/fournisseurs/FournisseursTable';
import { FournisseurModal } from '@/components/modals/FournisseurModal';
import { ImportFournisseursModal } from '@/components/modals/ImportFournisseursModal';
import { useFournisseurs } from '@/hooks/useFournisseurs';
import { useToast } from '@/hooks/use-toast';
import { CreateFournisseurData, Fournisseur } from '@/types/fournisseur';

const Fournisseurs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingFournisseur, setEditingFournisseur] = useState<Fournisseur | null>(null);
  const [fournisseurToDelete, setFournisseurToDelete] = useState<Fournisseur | null>(null);
  const { fournisseurs, loading, createFournisseur, updateFournisseur, deleteFournisseur, fetchFournisseurs } = useFournisseurs();
  const { toast } = useToast();

  const filteredFournisseurs = fournisseurs.filter(fournisseur =>
    fournisseur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fournisseur.contactPrincipal.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fournisseur.secteurActivite.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFournisseur = () => {
    setEditingFournisseur(null);
    setShowModal(true);
  };

  const handleEditFournisseur = (fournisseur: Fournisseur) => {
    setEditingFournisseur(fournisseur);
    setShowModal(true);
  };

  const handleSaveFournisseur = async (data: CreateFournisseurData) => {
    if (editingFournisseur) {
      await updateFournisseur(editingFournisseur.id, data);
    } else {
      await createFournisseur(data);
    }
    setShowModal(false);
  };

  const handleDeleteFournisseur = async (id: string) => {
    const fournisseur = fournisseurs.find(f => f.id === id);
    if (fournisseur) {
      setFournisseurToDelete(fournisseur);
    }
  };

  const confirmDeleteFournisseur = async () => {
    if (!fournisseurToDelete) return;
    
    const result = await deleteFournisseur(fournisseurToDelete.id);
    if (!result.error) {
      toast({
        title: "Succès",
        description: `Le fournisseur "${fournisseurToDelete.nom}" a été supprimé avec succès`
      });
    } else {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du fournisseur",
        variant: "destructive"
      });
    }
    setFournisseurToDelete(null);
  };

  const handleImportFournisseurs = () => {
    setShowImportModal(true);
  };

  const handleExportFournisseurs = () => {
    if (fournisseurs.length === 0) {
      toast({
        title: "Aucun fournisseur à exporter",
        description: "Vous n'avez aucun fournisseur dans votre liste",
        variant: "destructive"
      });
      return;
    }

    // Créer le CSV
    const headers = ['name', 'contact_name', 'email', 'phone', 'address', 'city', 'postal_code', 'country', 'vat_number', 'business_sector', 'status', 'internal_notes'];
    const csvContent = [
      headers.join(','),
      ...fournisseurs.map(fournisseur => [
        `"${fournisseur.nom || ''}"`,
        `"${fournisseur.contactPrincipal.nom || ''}"`,
        `"${fournisseur.contactPrincipal.email || ''}"`,
        `"${fournisseur.contactPrincipal.telephone || ''}"`,
        `"${fournisseur.adresse.rue || ''}"`,
        `"${fournisseur.adresse.ville || ''}"`,
        `"${fournisseur.adresse.codePostal || ''}"`,
        `"${fournisseur.adresse.pays || 'France'}"`,
        `"${fournisseur.matriculeFiscal || ''}"`,
        `"${fournisseur.secteurActivite || ''}"`,
        `"${fournisseur.statut === 'actif' ? 'active' : 'inactive'}"`,
        `"${fournisseur.notesInternes || ''}"`
      ].join(','))
    ].join('\n');

    // Télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fournisseurs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export réussi",
      description: `${fournisseurs.length} fournisseur(s) exporté(s) avec succès`
    });
  };

  const handleImportComplete = () => {
    fetchFournisseurs();
  };

  const handleViewFournisseur = (fournisseur: Fournisseur) => {
    console.log('Voir les détails du fournisseur:', fournisseur);
    // Logique pour afficher les détails
  };

  const stats = {
    totalFournisseurs: fournisseurs.length,
    fournisseursActifs: fournisseurs.filter(f => f.statut === 'actif').length,
    secteurs: new Set(fournisseurs.map(f => f.secteurActivite).filter(Boolean)).size,
    nouveauxCeMois: fournisseurs.filter(f => {
      const dateAjout = new Date(f.dateAjout);
      const maintenant = new Date();
      return dateAjout.getMonth() === maintenant.getMonth() && 
             dateAjout.getFullYear() === maintenant.getFullYear();
    }).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F9FA] p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement des fournisseurs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-[#F7F9FA] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fournisseurs</h1>
          <p className="text-muted-foreground">
            Gérez vos fournisseurs et partenaires commerciaux
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
            <Input
              placeholder="Rechercher un fournisseur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-neutral-200"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleExportFournisseurs}
              variant="outline"
              className="border-neutral-200"
            >
              <Download size={16} className="mr-2" />
              Exporter
            </Button>
            
            <Button 
              onClick={handleImportFournisseurs}
              variant="outline"
              className="border-neutral-200"
            >
              <Upload size={16} className="mr-2" />
              Importer
            </Button>

            <Button 
              onClick={handleAddFournisseur}
              className="bg-[#6A9C89] hover:bg-[#5a8473]"
            >
              <Plus size={16} className="mr-2" />
              Ajouter un fournisseur
            </Button>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total fournisseurs</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.totalFournisseurs}</p>
              </div>
              <Users className="h-8 w-8 text-[#6A9C89]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Fournisseurs actifs</p>
                <p className="text-2xl font-bold text-success">{stats.fournisseursActifs}</p>
              </div>
              <UserCheck className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Secteurs couverts</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.secteurs}</p>
              </div>
              <Building className="h-8 w-8 text-[#6A9C89]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Nouveaux ce mois</p>
                <p className="text-2xl font-bold text-blue-600">{stats.nouveauxCeMois}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des fournisseurs */}
      <FournisseursTable 
        fournisseurs={filteredFournisseurs}
        onEdit={handleEditFournisseur}
        onDelete={handleDeleteFournisseur}
        onView={handleViewFournisseur}
      />

      {/* Modal */}
      <FournisseurModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveFournisseur}
        fournisseur={editingFournisseur}
      />

      {/* Import Modal */}
      <ImportFournisseursModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportComplete={handleImportComplete}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!fournisseurToDelete} onOpenChange={() => setFournisseurToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le fournisseur <strong>"{fournisseurToDelete?.nom}"</strong> ? 
              Cette action est irréversible et pourrait affecter les bons de commande associés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteFournisseur}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Fournisseurs;
