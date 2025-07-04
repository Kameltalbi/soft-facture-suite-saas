import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Upload, Download } from 'lucide-react';

interface ProductsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddProduct: () => void;
  onImportProducts: () => void;
  onExportProducts: () => void;
}

export function ProductsHeader({ 
  searchTerm, 
  onSearchChange, 
  onAddProduct, 
  onImportProducts, 
  onExportProducts 
}: ProductsHeaderProps) {
  return (
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
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white border-neutral-200"
          />
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={onImportProducts}
            className="text-muted-foreground"
          >
            <Upload size={14} className="mr-1" />
            Importer
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
            onClick={onExportProducts}
            className="text-muted-foreground"
          >
            <Download size={14} className="mr-1" />
            Exporter
          </Button>
          
          <Button 
            onClick={onAddProduct}
            className="bg-[#6A9C89] hover:bg-[#5a8473]"
          >
            <Plus size={16} className="mr-2" />
            Ajouter un produit
          </Button>
        </div>
      </div>
    </div>
  );
}