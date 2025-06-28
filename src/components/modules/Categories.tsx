
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Tag, Palette, Hash, Calendar } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { CategoryModal } from '@/components/modals/CategoryModal';
import { useCategories } from '@/hooks/useCategories';
import { useToast } from '@/hooks/use-toast';

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const { categories, loading, createCategory, updateCategory, deleteCategory } = useCategories();
  const { toast } = useToast();

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleSaveCategory = async (data) => {
    try {
      if (editingCategory) {
        const result = await updateCategory(editingCategory.id, data);
        if (result.error) {
          throw new Error(result.error);
        }
        toast({
          title: "Catégorie modifiée",
          description: `La catégorie "${data.name}" a été modifiée avec succès.`,
        });
      } else {
        const result = await createCategory(data);
        if (result.error) {
          throw new Error(result.error);
        }
        toast({
          title: "Catégorie créée",
          description: `La catégorie "${data.name}" a été créée avec succès.`,
        });
      }
      setShowModal(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${name}" ?`)) {
      try {
        const result = await deleteCategory(id);
        if (result.error) {
          throw new Error(result.error);
        }
        toast({
          title: "Catégorie supprimée",
          description: `La catégorie "${name}" a été supprimée avec succès.`,
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: error.message || "Une erreur est survenue lors de la suppression.",
          variant: "destructive",
        });
      }
    }
  };

  const handleViewCategory = (category) => {
    console.log('Viewing category:', category);
    // TODO: Implémenter la vue détaillée de la catégorie
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const stats = {
    totalCategories: categories.length,
    activeCategories: categories.filter(c => c.active).length,
    colors: new Set(categories.map(c => c.color)).size,
    recentCategories: categories.filter(c => {
      const createdDate = new Date(c.created_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - createdDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }).length
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement des catégories...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-[#F7F9FA] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catégories</h1>
          <p className="text-muted-foreground">
            Organisez vos produits par catégories
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
            <Input
              placeholder="Rechercher une catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-neutral-200"
            />
          </div>

          <Button 
            onClick={handleAddCategory}
            className="bg-[#6A9C89] hover:bg-[#5a8473]"
          >
            <Plus size={16} className="mr-2" />
            Ajouter une catégorie
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total catégories</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.totalCategories}</p>
              </div>
              <Tag className="h-8 w-8 text-[#6A9C89]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Catégories actives</p>
                <p className="text-2xl font-bold text-success">{stats.activeCategories}</p>
              </div>
              <Hash className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Couleurs utilisées</p>
                <p className="text-2xl font-bold text-blue-600">{stats.colors}</p>
              </div>
              <Palette className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Nouvelles (7j)</p>
                <p className="text-2xl font-bold text-orange-600">{stats.recentCategories}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des catégories */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Couleur</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id} className="hover:bg-neutral-50">
                  <TableCell>
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium text-neutral-900">{category.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-neutral-600">
                      {category.description || 'Aucune description'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div 
                        className="w-6 h-6 rounded border mr-2"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm font-mono">{category.color}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={category.active ? 'default' : 'secondary'}>
                      {category.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-neutral-600">
                      {formatDate(category.created_at)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewCategory(category)}>
                          <Eye size={16} className="mr-2" />
                          Voir les détails
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                          <Edit size={16} className="mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteCategory(category.id, category.name)}
                          className="text-destructive"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCategories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                    {categories.length === 0 ? 'Aucune catégorie trouvée. Ajoutez votre première catégorie !' : 'Aucune catégorie ne correspond à votre recherche'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal */}
      <CategoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveCategory}
        category={editingCategory}
      />
    </div>
  );
};

export default Categories;
