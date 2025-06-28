
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
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import InvoiceReportPage from '@/pages/reports/InvoiceReportPage';
import ProductRevenueReportPage from '@/pages/reports/ProductRevenueReportPage';
import MonthlyRevenueReportPage from '@/pages/reports/MonthlyRevenueReportPage';
import YearComparisonReportPage from '@/pages/reports/YearComparisonReportPage';
import ProductRankingReportPage from '@/pages/reports/ProductRankingReportPage';
import ClientRevenueReportPage from '@/pages/reports/ClientRevenueReportPage';
import VatReportPage from '@/pages/reports/VatReportPage';
import StockMovementsReportPage from '@/pages/reports/StockMovementsReportPage';

export const DashboardSelector = () => {
  const { profile } = useAuth();
  const [activeModule, setActiveModule] = useState('dashboard');
  const location = useLocation();

  // Si l'utilisateur est superadmin, afficher la page de gestion des organisations
  if (profile?.role === 'superadmin') {
    return <OrganisationsAdminPage />;
  }

  // Déterminer le module actif basé sur l'URL
  const getActiveModuleFromPath = () => {
    const path = location.pathname;
    if (path.includes('/reports')) return 'reports';
    if (path.includes('/invoices')) return 'invoices';
    if (path.includes('/quotes')) return 'quotes';
    if (path.includes('/delivery-notes')) return 'delivery-notes';
    if (path.includes('/bons-commande')) return 'bons-commande';
    if (path.includes('/products')) return 'products';
    if (path.includes('/categories')) return 'categories';
    if (path.includes('/stock')) return 'stock';
    if (path.includes('/clients')) return 'clients';
    if (path.includes('/fournisseurs')) return 'fournisseurs';
    if (path.includes('/credits')) return 'credits';
    if (path.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const currentModule = getActiveModuleFromPath();

  return (
    <CurrencyProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar activeModule={currentModule} onModuleChange={setActiveModule} />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <div className="flex-1">
                <Header activeModule={currentModule} />
              </div>
            </header>
            <main className="flex-1 overflow-y-auto p-4">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/quotes" element={<Quotes />} />
                <Route path="/delivery-notes" element={<DeliveryNotes />} />
                <Route path="/bons-commande" element={<BonsCommandePage />} />
                <Route path="/products" element={<Products />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/stock" element={<Stock />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/fournisseurs" element={<Fournisseurs />} />
                <Route path="/credits" element={<Avoirs />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/reports/invoices" element={<InvoiceReportPage />} />
                <Route path="/reports/product-revenue" element={<ProductRevenueReportPage />} />
                <Route path="/reports/monthly-revenue" element={<MonthlyRevenueReportPage />} />
                <Route path="/reports/year-comparison" element={<YearComparisonReportPage />} />
                <Route path="/reports/product-ranking" element={<ProductRankingReportPage />} />
                <Route path="/reports/client-revenue" element={<ClientRevenueReportPage />} />
                <Route path="/reports/vat-report" element={<VatReportPage />} />
                <Route path="/reports/stock-movements" element={<StockMovementsReportPage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </CurrencyProvider>
  );
};
