
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import HomePage from "./pages/HomePage";
import FeaturesPage from "./pages/FeaturesPage";
import AboutPage from "./pages/AboutPage";
import PricingPage from "./pages/PricingPage";
import DemoPage from "./pages/DemoPage";
import AuthPage from "./pages/AuthPage";
import CheckoutPage from "./pages/CheckoutPage";
import EnAttenteValidationPage from "./pages/EnAttenteValidationPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import Reports from "./pages/Reports";
import InvoiceReportPage from "./pages/reports/InvoiceReportPage";
import ProductRevenueReportPage from "./pages/reports/ProductRevenueReportPage";
import MonthlyRevenueReportPage from "./pages/reports/MonthlyRevenueReportPage";
import YearComparisonReportPage from "./pages/reports/YearComparisonReportPage";
import ProductRankingReportPage from "./pages/reports/ProductRankingReportPage";
import ClientRevenueReportPage from "./pages/reports/ClientRevenueReportPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CurrencyProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/demo" element={<DemoPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/en-attente-validation" element={<EnAttenteValidationPage />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/app" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              } />
              <Route path="/reports/invoices" element={
                <ProtectedRoute>
                  <InvoiceReportPage />
                </ProtectedRoute>
              } />
              <Route path="/reports/product-revenue" element={
                <ProtectedRoute>
                  <ProductRevenueReportPage />
                </ProtectedRoute>
              } />
              <Route path="/reports/monthly-revenue" element={
                <ProtectedRoute>
                  <MonthlyRevenueReportPage />
                </ProtectedRoute>
              } />
              <Route path="/reports/year-comparison" element={
                <ProtectedRoute>
                  <YearComparisonReportPage />
                </ProtectedRoute>
              } />
              <Route path="/reports/product-ranking" element={
                <ProtectedRoute>
                  <ProductRankingReportPage />
                </ProtectedRoute>
              } />
              <Route path="/reports/client-revenue" element={
                <ProtectedRoute>
                  <ClientRevenueReportPage />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CurrencyProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
