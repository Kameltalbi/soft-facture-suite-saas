import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Package, AlertTriangle, TrendingUp, TrendingDown, History } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { StockEntryModal } from '@/components/modals/StockEntryModal';
import { StockExitModal } from '@/components/modals/StockExitModal';
import { StockHistoryModal } from '@/components/modals/StockHistoryModal';
import { useProducts } from '@/hooks/useProducts';
import { useStockMovements } from '@/hooks/useStockMovements';

const Stock = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { products, loading: productsLoading } = useProducts();
  const { movements, loading: movementsLoading } = useStockMovements();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStockEntry = (product) => {
    setSelectedProduct(product);
    setShowEntryModal(true);
  };

  const handleStockExit = (product) => {
    setSelectedProduct(product);
    setShowExitModal(true);
  };

  const handleViewHistory = (product) => {
    setSelectedProduct(product);
    setShowHistoryModal(true);
  };

  const formatCurrency = (amount) => {
    return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { status: 'Rupture', variant: 'destructive' as const, color: 'text-red-600' };
    if (quantity < 10) return { status: 'Stock faible', variant: 'secondary' as const, color: 'text-orange-600' };
    return { status: 'En stock', variant: 'default' as const, color: 'text-success' };
  };

  const stats = {
    totalProducts: products.length,
    lowStock: products.filter(p => (p.stock_quantity || 0) > 0 && (p.stock_quantity || 0) < 10).length,
    outOfStock: products.filter(p => (p.stock_quantity || 0) === 0).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * (p.stock_quantity || 0)), 0)
  };

  const recentMovements = movements.slice(0, 10);

  // Convert products to the format expected by the modals
  const productsForModals = products.map(product => ({
    id: product.id,
    nom: product.name,
    unite: product.unit || 'pièces',
    stock_actuel: product.stock_quantity || 0
  }));

  const handleStockEntry = (productId: string, quantity: number, comment: string) => {
    console.log('Stock entry:', productId, quantity, comment);
    setShowEntryModal(false);
  };

  const handleStockExit = (productId: string, quantity: number, reason: string, comment: string) => {
    console.log('Stock exit:', productId, quantity, reason, comment);
    setShowExitModal(false);
  };

  if (productsLoading || movementsLoading) {
    return (
      <div className="min-h-screen bg-[#F7F9FA] p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement de la gestion de stock...</div>
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
            <h1 className="text-2xl font-bold text-neutral-900">Gestion de Stock</h1>
            <p className="text-neutral-600">Gérez vos stocks et mouvements de produits</p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Total produits</p>
                  <p className="text-2xl font-bold text-neutral-900">{stats.totalProducts}</p>
                </div>
                <Package className="h-8 w-8 text-[#6A9C89]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Stock faible</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.lowStock}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Rupture de stock</p>
                  <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Valeur totale</p>
                  <p className="text-2xl font-bold text-success">{formatCurrency(stats.totalValue)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Produits en stock</TabsTrigger>
            <TabsTrigger value="movements">Mouvements de stock</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            {/* Recherche */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rechercher un produit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
                  <Input
                    placeholder="Rechercher par nom ou SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tableau des produits */}
            <Card>
              <CardHeader>
                <CardTitle>Stock des produits</CardTitle>
                <CardDescription>
                  {filteredProducts.length} produit(s) trouvé(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produit</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Stock actuel</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Prix unitaire</TableHead>
                      <TableHead>Valeur stock</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => {
                      const stockStatus = getStockStatus(product.stock_quantity || 0);
                      return (
                        <TableRow key={product.id} className="hover:bg-neutral-50">
                          <TableCell>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              {product.description && (
                                <div className="text-sm text-neutral-500 truncate max-w-xs">
                                  {product.description}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-sm">{product.sku || 'N/A'}</span>
                          </TableCell>
                          <TableCell>
                            <span className={`font-medium ${stockStatus.color}`}>
                              {product.stock_quantity || 0} {product.unit || 'pièces'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={stockStatus.variant}>
                              {stockStatus.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {formatCurrency(product.price)}
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {formatCurrency(product.price * (product.stock_quantity || 0))}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStockEntry(product)}
                              >
                                <Plus size={16} className="mr-1" />
                                Entrée
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStockExit(product)}
                                disabled={(product.stock_quantity || 0) === 0}
                              >
                                <TrendingDown size={16} className="mr-1" />
                                Sortie
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewHistory(product)}
                              >
                                <History size={16} className="mr-1" />
                                Historique
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filteredProducts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-neutral-500">
                          {products.length === 0 ? 'Aucun produit trouvé. Ajoutez des produits d\'abord !' : 'Aucun produit ne correspond à votre recherche'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="movements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mouvements de stock récents</CardTitle>
                <CardDescription>
                  Historique des derniers mouvements de stock
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Produit</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Raison</TableHead>
                      <TableHead>Coût unitaire</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentMovements.map((movement) => (
                      <TableRow key={movement.id} className="hover:bg-neutral-50">
                        <TableCell>
                          <span className="text-sm">{formatDate(movement.created_at)}</span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{movement.products?.name}</div>
                            {movement.products?.sku && (
                              <div className="text-sm text-neutral-500">{movement.products.sku}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={movement.movement_type === 'in' ? 'default' : 'secondary'}>
                            {movement.movement_type === 'in' ? 'Entrée' : 'Sortie'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            movement.movement_type === 'in' ? 'text-success' : 'text-orange-600'
                          }`}>
                            {movement.movement_type === 'in' ? '+' : '-'}{Math.abs(movement.quantity)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{movement.reason || 'N/A'}</span>
                        </TableCell>
                        <TableCell>
                          {movement.unit_cost ? formatCurrency(movement.unit_cost) : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                    {recentMovements.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                          Aucun mouvement de stock trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <StockEntryModal
          isOpen={showEntryModal}
          onClose={() => setShowEntryModal(false)}
          products={productsForModals}
          onSave={handleStockEntry}
        />

        <StockExitModal
          isOpen={showExitModal}
          onClose={() => setShowExitModal(false)}
          products={productsForModals}
          onSave={handleStockExit}
        />

        <StockHistoryModal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          product={selectedProduct}
        />
      </div>
    </div>
  );
};

export default Stock;
