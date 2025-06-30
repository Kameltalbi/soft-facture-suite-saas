
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';

interface DeliveryNotesHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddDeliveryNote: () => void;
}

export function DeliveryNotesHeader({ searchTerm, onSearchChange, onAddDeliveryNote }: DeliveryNotesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bons de livraison</h1>
        <p className="text-muted-foreground">
          Gérez vos bons de livraison et suivez les expéditions
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div className="relative flex-1 sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
          <Input
            placeholder="Rechercher un bon de livraison..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white border-neutral-200"
          />
        </div>

        <Button 
          onClick={onAddDeliveryNote}
          className="bg-[#6A9C89] hover:bg-[#5a8473]"
        >
          <Plus size={16} className="mr-2" />
          Nouveau bon de livraison
        </Button>
      </div>
    </div>
  );
}
