import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Package, AlertTriangle, TrendingUp, Boxes } from 'lucide-react';
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
import { ProductModal } from '@/components/modals/ProductModal';
import { useProducts } from '@/hooks/useProducts';
import { useCurrency } from '@/contexts/CurrencyContext';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { products, loading, createProduct, updateProduct, deleteProduct } = useProducts();
  const { currency } = useCurrency();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleSaveProduct = async (data) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, data);
    } else {
      await createProduct(data);
    }
    setShowModal(false);
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      const result = await deleteProduct(id);
      if (result.error) {
        console.error('Error deleting product:', result.error);
      } else {
        console.log('Product deleted successfully');
      }
    }
  };

  const handleViewProduct = (product) => {
    console.log('Viewing product:', product);
  };

  const formatCurrency = (amount) => {
    return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} ${currency.symbol}`;
  };

  const stats = {
    totalProducts: products.length,
    lowStock: products.filter(p => p.track_stock && (p.stock_quantity || 0) < 10).length,
    outOfStock: products.filter(p => p.track_stock && (p.stock_quantity || 0) === 0).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * (p.track_stock ? (p.stock_quantity || 0) : 0)), 0)
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement des produits...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-[#F7F9FA] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produits & Services</h1>
          <p className="text-muted-foreground">
            Gérez votre catalogue de produits et services
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
            <Input
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-neutral-200"
            />
          </div>

          <Button 
            onClick={handleAddProduct}
            className="bg-[#6A9C89] hover:bg-[#5a8473]"
          >
            <Plus size={16} className="mr-2" />
            Ajouter un produit
          </Button>
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
              <Boxes className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Valeur stock</p>
                <p className="text-2xl font-bold text-success">{formatCurrency(stats.totalValue)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des produits */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Unité</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-neutral-50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-neutral-900">{product.name}</div>
                      {product.description && (
                        <div className="text-sm text-neutral-500 truncate max-w-xs">
                          {product.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono">{product.sku || 'N/A'}</span>
                  </TableCell>
                  <TableCell>
                    {product.category ? (
                      <Badge variant="outline">{product.category}</Badge>
                    ) : (
                      <span className="text-neutral-400">Non catégorisé</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{formatCurrency(product.price)}</span>
                  </TableCell>
                  <TableCell>
                    {product.track_stock ? (
                      <div className="flex items-center">
                        <span className={`font-medium ${
                          (product.stock_quantity || 0) === 0 ? 'text-red-600' :
                          (product.stock_quantity || 0) < 10 ? 'text-orange-600' :
                          'text-success'
                        }`}>
                          {product.stock_quantity || 0}
                        </span>
                        {(product.stock_quantity || 0) === 0 && (
                          <AlertTriangle size={16} className="ml-2 text-red-600" />
                        )}
                        {(product.stock_quantity || 0) > 0 && (product.stock_quantity || 0) < 10 && (
                          <AlertTriangle size={16} className="ml-2 text-orange-600" />
                        )}
                      </div>
                    ) : (
                      <span className="text-neutral-400 text-sm">Non suivi</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{product.unit || 'pièce'}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewProduct(product)}>
                          <Eye size={16} className="mr-2" />
                          Voir les détails
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                          <Edit size={16} className="mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteProduct(product.id)}
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
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-neutral-500">
                    {products.length === 0 ? 'Aucun produit trouvé. Ajoutez votre premier produit !' : 'Aucun produit ne correspond à votre recherche'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal */}
      <ProductModal
        open={showModal}
        onClose={() => setShowModal(false)}
        product={editingProduct}
      />
    </div>
  );
};

export default Products;
