
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface SalesHeaderProps {
  onNewQuote: () => void;
  onNewInvoice: () => void;
}

export function SalesHeader({ onNewQuote, onNewInvoice }: SalesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Documents de vente</h1>
        <p className="text-neutral-600">Gérez tous vos documents commerciaux</p>
      </div>

      <div className="flex space-x-2">
        <Button 
          onClick={onNewQuote}
          variant="outline"
          className="border-secondary text-secondary hover:bg-secondary hover:text-white"
        >
          <Plus size={16} className="mr-2" />
          Nouveau Devis
        </Button>
        <Button 
          onClick={onNewInvoice}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus size={16} className="mr-2" />
          Nouvelle Facture
        </Button>
      </div>
    </div>
  );
}
