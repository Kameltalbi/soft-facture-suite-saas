import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
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
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import Avoirs from './Avoirs';

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
      case 'credits':
        return <Avoirs />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <CurrencyProvider>
      <div className="flex h-screen bg-neutral-50">
        <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header activeModule={activeModule} />
          <main className="flex-1 overflow-y-auto">
            {renderModule()}
          </main>
        </div>
      </div>
    </CurrencyProvider>
  );
};

export default Index;
