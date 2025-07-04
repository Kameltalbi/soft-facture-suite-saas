
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Upload, Download } from 'lucide-react';

interface CategoriesHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddCategory: () => void;
  onImportCategories: () => void;
  onExportCategories: () => void;
}

export function CategoriesHeader({ searchTerm, onSearchChange, onAddCategory, onImportCategories, onExportCategories }: CategoriesHeaderProps) {
  return (
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
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white border-neutral-200"
          />
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={onExportCategories}
            variant="outline"
            className="border-neutral-200"
          >
            <Download size={16} className="mr-2" />
            Exporter
          </Button>
          
          <Button 
            onClick={onImportCategories}
            variant="outline"
            className="border-neutral-200"
          >
            <Upload size={16} className="mr-2" />
            Importer
          </Button>

          <Button 
            onClick={onAddCategory}
            className="bg-[#6A9C89] hover:bg-[#5a8473]"
          >
            <Plus size={16} className="mr-2" />
            Ajouter une catégorie
          </Button>
        </div>
      </div>
    </div>
  );
}
