
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Package, Wrench } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProductModal } from '@/components/modals/ProductModal';

interface Product {
  id: string;
  name: string;
  description: string;
  type: 'product' | 'service';
  price: number;
  unit: string;
  vatRate: number;
  category: string;
  stockTracking: boolean;
  stock?: number;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Consultation Web',
    description: 'Consultation pour développement web',
    type: 'service',
    price: 300,
    unit: 'heure',
    vatRate: 20,
    category: 'Services',
    stockTracking: false
  },
  {
    id: '2',
    name: 'MacBook Pro 16"',
    description: 'Ordinateur portable Apple MacBook Pro 16 pouces',
    type: 'product',
    price: 2499,
    unit: 'unité',
    vatRate: 20,
    category: 'Informatique',
    stockTracking: true,
    stock: 5
  },
  {
    id: '3',
    name: 'Formation React',
    description: 'Formation développement React.js',
    type: 'service',
    price: 300,
    unit: 'jour',
    vatRate: 20,
    category: 'Formation',
    stockTracking: false
  },
  {
    id: '4',
    name: 'Souris sans fil',
    description: 'Souris ergonomique sans fil',
    type: 'product',
    price: 45,
    unit: 'unité',
    vatRate: 20,
    category: 'Accessoires',
    stockTracking: true,
    stock: 12
  }
];

export function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewProduct = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const stats = {
    totalProducts: mockProducts.filter(p => p.type === 'product').length,
    totalServices: mockProducts.filter(p => p.type === 'service').length,
    lowStock: mockProducts.filter(p => p.stockTracking && p.stock && p.stock < 5).length,
    categories: [...new Set(mockProducts.map(p => p.category))].length
  };

  return (
    <div className="p-6 space-y-6 bg-neutral-50 min-h-screen">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
          <Input
            placeholder="Rechercher un produit ou service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-neutral-200"
          />
        </div>

        <Button 
          onClick={handleNewProduct}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus size={16} className="mr-2" />
          Nouveau Produit/Service
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Produits</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Services</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.totalServices}</p>
              </div>
              <Wrench className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Stock bas</p>
                <p className="text-2xl font-bold text-destructive">{stats.lowStock}</p>
              </div>
              <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center">
                <span className="text-destructive font-bold">!</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Catégories</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.categories}</p>
              </div>
              <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                <span className="text-success font-bold">#</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Produits et Services</CardTitle>
          <CardDescription>
            Gérez votre catalogue de produits et services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Prix unitaire</TableHead>
                <TableHead>Unité</TableHead>
                <TableHead>TVA</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-neutral-50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-neutral-900">{product.name}</div>
                      <div className="text-sm text-neutral-500">{product.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.type === 'product' ? 'default' : 'secondary'}>
                      {product.type === 'product' ? 'Produit' : 'Service'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {product.price.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    })}
                  </TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell>{product.vatRate}%</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {product.stockTracking ? (
                      <span className={
                        product.stock && product.stock < 5 
                          ? 'text-destructive font-medium' 
                          : 'text-neutral-900'
                      }>
                        {product.stock}
                      </span>
                    ) : (
                      <span className="text-neutral-400">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Product Modal */}
      <ProductModal
        open={showProductModal}
        onClose={() => setShowProductModal(false)}
        product={editingProduct}
      />
    </div>
  );
}
