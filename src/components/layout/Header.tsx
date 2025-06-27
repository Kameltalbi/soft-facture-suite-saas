
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User, Building } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  activeModule: string;
}

const moduleNames: Record<string, string> = {
  dashboard: 'Tableau de bord',
  invoices: 'Factures',
  quotes: 'Devis',
  'delivery-notes': 'Bons de livraison',
  'bons-commande': 'Bons de commande',
  products: 'Produits',
  categories: 'Catégories',
  stock: 'Stock',
  clients: 'Clients',
  fournisseurs: 'Fournisseurs',
  credits: 'Avoirs',
  reports: 'Rapports',
  settings: 'Paramètres',
};

export function Header({ activeModule }: HeaderProps) {
  const { user, profile, organization, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {moduleNames[activeModule] || 'Soft Facture'}
        </h1>
        {organization && (
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <Building className="h-4 w-4" />
            {organization.name}
          </p>
        )}
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">
              {profile?.first_name && profile?.last_name 
                ? `${profile.first_name} ${profile.last_name}`
                : user?.email
              }
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
            <User className="mr-2 h-4 w-4" />
            <span>{user?.email}</span>
          </DropdownMenuItem>
          {profile?.role && (
            <DropdownMenuItem disabled>
              <span className="mr-2 text-xs bg-gray-100 px-2 py-1 rounded">
                {profile.role}
              </span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Déconnexion</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
