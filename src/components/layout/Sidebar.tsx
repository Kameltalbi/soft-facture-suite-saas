
import { Home, FileText, Users, Package, TrendingUp, Settings, FileSpreadsheet, Truck, CreditCard, Building2, Receipt, DollarSign } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: Home },
  { name: 'Factures', href: '/invoices', icon: FileText },
  { name: 'Devis', href: '/quotes', icon: FileSpreadsheet },
  { name: 'Bons de livraison', href: '/delivery-notes', icon: Truck },
  { name: 'Avoirs', href: '/avoirs', icon: CreditCard },
  { name: 'Bons de commande', href: '/bons-commande', icon: Receipt },
  { name: 'Recouvrement', href: '/recouvrement', icon: DollarSign },
  { name: 'Clients', href: '/dashboard?tab=clients', icon: Users },
  { name: 'Produits', href: '/dashboard?tab=products', icon: Package },
  { name: 'Fournisseurs', href: '/fournisseurs', icon: Building2 },
  { name: 'Stock', href: '/stock', icon: Package },
  { name: 'Rapports', href: '/reports', icon: TrendingUp },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();
  const { profile } = useAuth();

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard' && location.pathname === '/dashboard' && !location.search) {
      return true;
    }
    if (href.includes('?tab=') && location.pathname + location.search === href) {
      return true;
    }
    if (!href.includes('?tab=') && location.pathname === href) {
      return true;
    }
    return false;
  };

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex flex-1 flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-xl font-bold text-gray-900">Soft Facture</h1>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = isActiveRoute(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors'
                )}
              >
                <item.icon
                  className={cn(
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500',
                    'mr-3 h-5 w-5 transition-colors'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        {profile && (
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {profile.first_name} {profile.last_name}
                  </p>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                    {profile.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
