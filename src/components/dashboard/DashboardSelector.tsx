
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Header } from '@/components/layout/Header';
import { Dashboard } from '@/components/modules/Dashboard';
import Products from '@/components/modules/Products';
import Categories from '@/components/modules/Categories';
import Clients from '@/components/modules/Clients';
import Invoices from '@/pages/Invoices';
import Quotes from '@/pages/Quotes';
import DeliveryNotes from '@/pages/DeliveryNotes';
import Stock from '@/pages/Stock';
import Settings from '@/pages/Settings';
import Reports from '@/pages/Reports';
import Fournisseurs from '@/pages/Fournisseurs';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import Avoirs from '@/pages/Avoirs';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import BonsCommandePage from '@/pages/BonsCommandePage';
import OrganisationsAdminPage from '@/pages/OrganisationsAdminPage';

export const DashboardSelector = () => {
  const { profile } = useAuth();
  const [activeModule, setActiveModule] = useState('dashboard');

  // Si l'utilisateur est superadmin, afficher la page de gestion des organisations
  if (profile?.role === 'superadmin') {
    return <OrganisationsAdminPage />;
  }

  // Pour les utilisateurs normaux, afficher le dashboard complet avec sidebar
  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'invoices':
        return <Invoices />;
      case 'quotes':
        return <Quotes />;
      case 'delivery-notes':
        return <DeliveryNotes />;
      case 'bons-commande':
        return <BonsCommandePage />;
      case 'products':
        return <Products />;
      case 'categories':
        return <Categories />;
      case 'stock':
        return <Stock />;
      case 'clients':
        return <Clients />;
      case 'fournisseurs':
        return <Fournisseurs />;
      case 'credits':
        return <Avoirs />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <CurrencyProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar activeModule={activeModule} onModuleChange={setActiveModule} />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <div className="flex-1">
                <Header activeModule={activeModule} />
              </div>
            </header>
            <main className="flex-1 overflow-y-auto p-4">
              {renderModule()}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </CurrencyProvider>
  );
};
