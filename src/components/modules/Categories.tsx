
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Filter, Tag, Package, Wrench } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategoryModal } from '@/components/modals/CategoryModal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  nom: string;
  description: string;
  type: 'produit' | 'service';
  visible_public: boolean;
  usage_count: number;
  tenant_id: string;
  created_at: string;
  updated_at: string;
}

const mockCategories: Category[] = [
  {
    id: '1',
    nom: 'Services',
    description: 'Prestations de service générales',
    type: 'service',
    visible_public: true,
    usage_count: 3,
    tenant_id: 'tenant1',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    nom: 'Informatique',
    description: 'Matériel informatique et accessoires',
    type: 'produit',
    visible_public: true,
    usage_count: 2,
    tenant_id: 'tenant1',
    created_at: '2024-01-16T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z'
  },
  {
    id: '3',
    nom: 'Formation',
    description: 'Formations techniques et professionnelles',
    type: 'service',
    visible_public: false,
    usage_count: 1,
    tenant_id: 'tenant1',
    created_at: '2024-01-17T10:00:00Z',
    updated_at: '2024-01-17T10:00:00Z'
  },
  {
    id: '4',
    nom: 'Accessoires',
    description: 'Accessoires et petits équipements',
    type: 'produit',
    visible_public: true,
    usage_count: 1,
    tenant_id: 'tenant1',
    created_at: '2024-01-18T10:00:00Z',
    updated_at: '2024-01-18T10:00:00Z'
  }
];

export function Categories() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>(mockCategories);

  // Filtrage des catégories
  const filteredCategories = categories.filter(category => {
    const matchesSearch = 
      category.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || category.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  // Statistiques
  const stats = {
    total: categories.length,
    produits: categories.filter(c => c.type === 'produit').length,
    services: categories.filter(c => c.type === 'service').length,
    publiques: categories.filter(c => c.visible_public).length
  };

  const handleNewCategory = () => {
    setEditingCategory(null);
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const handleSaveCategory = (categoryData: any) => {
    if (editingCategory) {
      // Mode édition
      setCategories(prev => 
        prev.map(cat => 
          cat.id === editingCategory.id 
            ? { ...cat, ...categoryData, updated_at: new Date().toISOString() }
            : cat
        )
      );
      toast({
        title: "Catégorie modifiée",
        description: `La catégorie "${categoryData.nom}" a été modifiée avec succès.`,
      });
    } else {
      // Mode création
      const newCategory: Category = {
        id: Date.now().toString(),
        ...categoryData,
        usage_count: 0,
        tenant_id: 'tenant1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setCategories(prev => [...prev, newCategory]);
      toast({
        title: "Catégorie créée",
        description: `La catégorie "${categoryData.nom}" a été créée avec succès.`,
      });
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    if (category.usage_count > 0) {
      toast({
        title: "Suppression impossible",
        description: `Cette catégorie est utilisée par ${category.usage_count} élément(s). Veuillez d'abord modifier ces éléments.`,
        variant: "destructive",
      });
      return;
    }

    setCategories(prev => prev.filter(c => c.id !== categoryId));
    toast({
      title: "Catégorie supprimée",
      description: `La catégorie "${category.nom}" a été supprimée avec succès.`,
    });
  };

  return (
    <div className="p-6 space-y-6 bg-neutral-50 min-h-screen">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Gestion des catégories</h1>
          <p className="text-neutral-600 mt-1">Organisez vos produits et services par catégories</p>
        </div>

        <Button 
          onClick={handleNewCategory}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus size={16} className="mr-2" />
          Nouvelle catégorie
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
              </div>
              <Tag className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Produits</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.produits}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Services</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.services}</p>
              </div>
              <Wrench className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Publiques</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.publiques}</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">👁</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Recherche */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
              <Input
                placeholder="Rechercher une catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-neutral-200"
              />
            </div>

            {/* Filtre par type */}
            <div className="w-full sm:w-48">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-white border-neutral-200">
                  <SelectValue placeholder="Filtrer par type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="produit">Produits</SelectItem>
                  <SelectItem value="service">Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des catégories */}
      <Card>
        <CardHeader>
          <CardTitle>Catégories ({filteredCategories.length})</CardTitle>
          <CardDescription>
            Gérez les catégories de vos produits et services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Utilisation</TableHead>
                <TableHead>Visibilité</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id} className="hover:bg-neutral-50">
                  <TableCell>
                    <div className="font-medium text-neutral-900">{category.nom}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-neutral-500 max-w-xs truncate">
                      {category.description || 'Aucune description'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={category.type === 'produit' ? 'default' : 'secondary'}>
                      {category.type === 'produit' ? 'Produit' : 'Service'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium">{category.usage_count}</span>
                      <span className="text-xs text-neutral-500">élément(s)</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {category.visible_public ? (
                      <Badge variant="outline" className="text-green-700 border-green-200">
                        Publique
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-neutral-500">
                        Privée
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Edit size={16} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer la catégorie "{category.nom}" ?
                              {category.usage_count > 0 && (
                                <span className="text-destructive block mt-2">
                                  ⚠️ Cette catégorie est utilisée par {category.usage_count} élément(s). 
                                  La suppression sera bloquée.
                                </span>
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteCategory(category.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredCategories.length === 0 && (
            <div className="text-center py-8">
              <Tag className="mx-auto h-12 w-12 text-neutral-400" />
              <h3 className="mt-2 text-sm font-medium text-neutral-900">Aucune catégorie</h3>
              <p className="mt-1 text-sm text-neutral-500">
                {searchTerm || typeFilter !== 'all' 
                  ? 'Aucune catégorie ne correspond à vos critères de recherche.'
                  : 'Commencez par créer une nouvelle catégorie.'
                }
              </p>
              {(!searchTerm && typeFilter === 'all') && (
                <div className="mt-6">
                  <Button onClick={handleNewCategory}>
                    <Plus size={16} className="mr-2" />
                    Nouvelle catégorie
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de catégorie */}
      <CategoryModal 
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        category={editingCategory}
        onSave={handleSaveCategory}
        onDelete={handleDeleteCategory}
      />
    </div>
  );
}
