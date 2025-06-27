
import { useState } from 'react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Header } from '@/components/layout/Header';
import { Dashboard } from '@/components/modules/Dashboard';
import { Products } from '@/components/modules/Products';
import { Categories } from '@/components/modules/Categories';
import { Clients } from '@/components/modules/Clients';
import Invoices from './Invoices';
import Quotes from './Quotes';
import DeliveryNotes from './DeliveryNotes';
import Stock from './Stock';
import Settings from './Settings';
import Reports from './Reports';
import Fournisseurs from './Fournisseurs';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import Avoirs from './Avoirs';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

const Index = () => {
  const [activeModule, setActiveModule] = useState('dashboard');

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

export default Index;
