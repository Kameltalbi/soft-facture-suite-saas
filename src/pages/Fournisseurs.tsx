
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Users, Building, UserCheck, Calendar } from 'lucide-react';
import { FournisseursTable } from '@/components/fournisseurs/FournisseursTable';
import { FournisseurModal } from '@/components/modals/FournisseurModal';
import { useFournisseurs } from '@/hooks/useFournisseurs';
import { CreateFournisseurData, Fournisseur } from '@/types/fournisseur';

const Fournisseurs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFournisseur, setEditingFournisseur] = useState<Fournisseur | null>(null);
  const { fournisseurs, loading, createFournisseur, updateFournisseur, deleteFournisseur } = useFournisseurs();

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
    if (confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
      await deleteFournisseur(id);
    }
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
    return <div className="p-6">Chargement...</div>;
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

          <Button 
            onClick={handleAddFournisseur}
            className="bg-[#6A9C89] hover:bg-[#5a8473]"
          >
            <Plus size={16} className="mr-2" />
            Ajouter un fournisseur
          </Button>
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
    </div>
  );
};

export default Fournisseurs;
