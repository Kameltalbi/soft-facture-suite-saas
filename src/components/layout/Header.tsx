
import { Bell, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  activeModule: string;
}

const moduleLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  sales: 'Ventes',
  products: 'Produits & Services',
  categories: 'Catégories',
  clients: 'Clients',
  credits: 'Avoirs',
  settings: 'Paramètres',
};

export function Header({ activeModule }: HeaderProps) {
  return (
    <header className="bg-white border-b border-neutral-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {moduleLabels[activeModule] || 'Soft Facture'}
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Gérez vos factures et devis en toute simplicité
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
            <Input
              placeholder="Rechercher..."
              className="pl-10 w-64 bg-neutral-50 border-neutral-200 focus:bg-white"
            />
          </div>
          
          <Button variant="ghost" size="sm" className="relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </Button>
          
          <Button variant="ghost" size="sm">
            <User size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
}
