import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface InvoicesHeaderProps {
  onNewInvoice: () => void;
}

export function InvoicesHeader({ onNewInvoice }: InvoicesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Factures</h1>
        <p className="text-neutral-600">Gérez vos factures clients</p>
      </div>
      <Button onClick={onNewInvoice} className="bg-primary hover:bg-primary/90">
        <Plus size={16} className="mr-2" />
        Nouvelle Facture
      </Button>
    </div>
  );
}