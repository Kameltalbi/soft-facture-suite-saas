
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, TrendingUp, TrendingDown, Settings, History, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StockEntryModal } from '@/components/modals/StockEntryModal';
import { StockExitModal } from '@/components/modals/StockExitModal';
import { StockHistoryModal } from '@/components/modals/StockHistoryModal';
import { useToast } from '@/hooks/use-toast';

interface StockProduct {
  id: string;
  nom: string;
  description: string;
  categorie: string;
  stock_actuel: number;
  stock_minimum: number;
  unite: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
}

const mockStockProducts: StockProduct[] = [
  {
    id: '1',
    nom: 'MacBook Pro 16"',
    description: 'Ordinateur portable Apple',
    categorie: 'Informatique',
    stock_actuel: 3,
    stock_minimum: 5,
    unite: 'unité',
    tenant_id: 'tenant1',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    nom: 'Souris sans fil',
    description: 'Souris ergonomique sans fil',
    categorie: 'Accessoires',
    stock_actuel: 12,
    stock_minimum: 8,
    unite: 'unité',
    tenant_id: 'tenant1',
    created_at: '2024-01-16T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z'
  },
  {
    id: '3',
    nom: 'Écran 27"',
    description: 'Écran LED 27 pouces',
    categorie: 'Informatique',
    stock_actuel: 0,
    stock_minimum: 2,
    unite: 'unité',
    tenant_id: 'tenant1',
    created_at: '2024-01-17T10:00:00Z',
    updated_at: '2024-01-17T10:00:00Z'
  },
  {
    id: '4',
    nom: 'Clavier mécanique',
    description: 'Clavier gaming mécanique',
    categorie: 'Accessoires',
    stock_actuel: 7,
    stock_minimum: 5,
    unite: 'unité',
    tenant_id: 'tenant1',
    created_at: '2024-01-18T10:00:00Z',
    updated_at: '2024-01-18T10:00:00Z'
  }
];

const Stock = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<StockProduct | null>(null);
  const [products, setProducts] = useState<StockProduct[]>(mockStockProducts);

  // Fonction pour déterminer l'état du stock
  const getStockStatus = (product: StockProduct) => {
    if (product.stock_actuel === 0) return 'rupture';
    if (product.stock_actuel <= product.stock_minimum) return 'faible';
    return 'normal';
  };

  // Filtrage des produits
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.categorie === categoryFilter;
    
    const status = getStockStatus(product);
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Statistiques
  const stats = {
    total: products.length,
    enStock: products.filter(p => getStockStatus(p) === 'normal').length,
    stockFaible: products.filter(p => getStockStatus(p) === 'faible').length,
    rupture: products.filter(p => getStockStatus(p) === 'rupture').length
  };

  // Catégories uniques
  const categories = [...new Set(products.map(p => p.categorie))];

  const handleStockEntry = (productId: string, quantity: number, comment: string) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, stock_actuel: product.stock_actuel + quantity, updated_at: new Date().toISOString() }
          : product
      )
    );
    toast({
      title: "Entrée de stock enregistrée",
      description: `${quantity} unité(s) ajoutée(s) au stock.`,
    });
  };

  const handleStockExit = (productId: string, quantity: number, reason: string, comment: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (quantity > product.stock_actuel) {
      toast({
        title: "Quantité insuffisante",
        description: "La quantité demandée dépasse le stock disponible.",
        variant: "destructive",
      });
      return;
    }

    setProducts(prev => 
      prev.map(p => 
        p.id === productId 
          ? { ...p, stock_actuel: p.stock_actuel - quantity, updated_at: new Date().toISOString() }
          : p
      )
    );
    toast({
      title: "Sortie de stock enregistrée",
      description: `${quantity} unité(s) sortie(s) du stock.`,
    });
  };

  const renderStockBadge = (product: StockProduct) => {
    const status = getStockStatus(product);
    
    switch (status) {
      case 'rupture':
        return <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle size={12} />Rupture</Badge>;
      case 'faible':
        return <Badge variant="outline" className="text-orange-600 border-orange-200 flex items-center gap-1"><AlertTriangle size={12} />Stock faible</Badge>;
      default:
        return <Badge variant="outline" className="text-green-700 border-green-200 flex items-center gap-1"><CheckCircle size={12} />En stock</Badge>;
    }
  };

  const handleShowHistory = (product: StockProduct) => {
    setSelectedProduct(product);
    setShowHistoryModal(true);
  };

  return (
    <div className="p-6 space-y-6 bg-neutral-50 min-h-screen">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Gestion des stocks</h1>
          <p className="text-neutral-600 mt-1">Suivez et gérez vos stocks de produits physiques</p>
        </div>

        <div className="flex space-x-2">
          <Button 
            onClick={() => setShowEntryModal(true)}
            variant="outline"
            className="border-green-200 text-green-700 hover:bg-green-50"
          >
            <TrendingUp size={16} className="mr-2" />
            Entrée de stock
          </Button>
          <Button 
            onClick={() => setShowExitModal(true)}
            variant="outline"
            className="border-red-200 text-red-700 hover:bg-red-50"
          >
            <TrendingDown size={16} className="mr-2" />
            Sortie de stock
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total produits</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">En stock</p>
                <p className="text-2xl font-bold text-green-600">{stats.enStock}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Stock faible</p>
                <p className="text-2xl font-bold text-orange-600">{stats.stockFaible}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Ruptures</p>
                <p className="text-2xl font-bold text-red-600">{stats.rupture}</p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">!</span>
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
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-neutral-200"
              />
            </div>

            {/* Filtre par catégorie */}
            <div className="w-full sm:w-48">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-white border-neutral-200">
                  <SelectValue placeholder="Toutes catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtre par état */}
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white border-neutral-200">
                  <SelectValue placeholder="Tous états" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous états</SelectItem>
                  <SelectItem value="normal">En stock</SelectItem>
                  <SelectItem value="faible">Stock faible</SelectItem>
                  <SelectItem value="rupture">Rupture</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des produits */}
      <Card>
        <CardHeader>
          <CardTitle>Produits suivis en stock ({filteredProducts.length})</CardTitle>
          <CardDescription>
            Vue d'ensemble de vos stocks de produits physiques
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Stock actuel</TableHead>
                <TableHead>Stock minimum</TableHead>
                <TableHead>État</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-neutral-50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-neutral-900">{product.nom}</div>
                      <div className="text-sm text-neutral-500">{product.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.categorie}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <span className={`font-medium ${
                        getStockStatus(product) === 'rupture' ? 'text-red-600' :
                        getStockStatus(product) === 'faible' ? 'text-orange-600' : 'text-neutral-900'
                      }`}>
                        {product.stock_actuel}
                      </span>
                      <span className="text-xs text-neutral-500">{product.unite}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-neutral-600">{product.stock_minimum}</span>
                      <span className="text-xs text-neutral-500">{product.unite}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {renderStockBadge(product)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShowHistory(product)}
                        title="Voir l'historique"
                      >
                        <History size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Modifier le produit"
                      >
                        <Settings size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-neutral-400" />
              <h3 className="mt-2 text-sm font-medium text-neutral-900">Aucun produit trouvé</h3>
              <p className="mt-1 text-sm text-neutral-500">
                {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                  ? 'Aucun produit ne correspond à vos critères de recherche.'
                  : 'Aucun produit avec suivi de stock configuré.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <StockEntryModal 
        isOpen={showEntryModal}
        onClose={() => setShowEntryModal(false)}
        products={products}
        onSave={handleStockEntry}
      />

      <StockExitModal 
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        products={products}
        onSave={handleStockExit}
      />

      <StockHistoryModal 
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default Stock;
