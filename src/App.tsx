import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { Toaster } from '@/components/ui/sonner';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PrivateRouteSuperadmin } from '@/components/auth/PrivateRouteSuperadmin';
import AuthPage from '@/pages/AuthPage';
import HomePage from '@/pages/HomePage';
import Index from '@/pages/Index';
import Invoices from '@/pages/Invoices';
import Quotes from '@/pages/Quotes';
import DeliveryNotes from '@/pages/DeliveryNotes';
import Avoirs from '@/pages/Avoirs';
import BonsCommandePage from '@/pages/BonsCommandePage';
import Fournisseurs from '@/pages/Fournisseurs';
import Stock from '@/pages/Stock';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import OrganisationsAdminPage from '@/pages/OrganisationsAdminPage';
import Recouvrement from '@/pages/Recouvrement';
// Import statements for report pages
import ClientRevenueReportPage from '@/pages/reports/ClientRevenueReportPage';
import InvoiceReportPage from '@/pages/reports/InvoiceReportPage';
import MonthlyRevenueReportPage from '@/pages/reports/MonthlyRevenueReportPage';
import ProductRankingReportPage from '@/pages/reports/ProductRankingReportPage';
import ProductRevenueReportPage from '@/pages/reports/ProductRevenueReportPage';
import YearComparisonReportPage from '@/pages/reports/YearComparisonReportPage';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CurrencyProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/invoices"
                element={
                  <ProtectedRoute>
                    <Invoices />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quotes"
                element={
                  <ProtectedRoute>
                    <Quotes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/delivery-notes"
                element={
                  <ProtectedRoute>
                    <DeliveryNotes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/avoirs"
                element={
                  <ProtectedRoute>
                    <Avoirs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bons-commande"
                element={
                  <ProtectedRoute>
                    <BonsCommandePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/fournisseurs"
                element={
                  <ProtectedRoute>
                    <Fournisseurs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stock"
                element={
                  <ProtectedRoute>
                    <Stock />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recouvrement"
                element={
                  <ProtectedRoute>
                    <Recouvrement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/reports/client-revenue"
                element={
                  <ProtectedRoute>
                    <ClientRevenueReportPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports/invoice"
                element={
                  <ProtectedRoute>
                    <InvoiceReportPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports/monthly-revenue"
                element={
                  <ProtectedRoute>
                    <MonthlyRevenueReportPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports/product-ranking"
                element={
                  <ProtectedRoute>
                    <ProductRankingReportPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports/product-revenue"
                element={
                  <ProtectedRoute>
                    <ProductRevenueReportPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports/year-comparison"
                element={
                  <ProtectedRoute>
                    <YearComparisonReportPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organisations-admin"
                element={
                  <PrivateRouteSuperadmin>
                    <OrganisationsAdminPage />
                  </PrivateRouteSuperadmin>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Router>
        </CurrencyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
