
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Suspense, lazy } from "react";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const HomePage = lazy(() => import("./pages/HomePage"));
const FeaturesPage = lazy(() => import("./pages/FeaturesPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const DemoPage = lazy(() => import("./pages/DemoPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const EnAttenteValidationPage = lazy(() => import("./pages/EnAttenteValidationPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const MentionsLegalesPage = lazy(() => import("./pages/MentionsLegalesPage"));
const CGUPage = lazy(() => import("./pages/CGUPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Reports = lazy(() => import("./pages/Reports"));
const InvoiceReportPage = lazy(() => import("./pages/reports/InvoiceReportPage"));
const ProductRevenueReportPage = lazy(() => import("./pages/reports/ProductRevenueReportPage"));
const MonthlyRevenueReportPage = lazy(() => import("./pages/reports/MonthlyRevenueReportPage"));
const YearComparisonReportPage = lazy(() => import("./pages/reports/YearComparisonReportPage"));
const ProductRankingReportPage = lazy(() => import("./pages/reports/ProductRankingReportPage"));
const ClientRevenueReportPage = lazy(() => import("./pages/reports/ClientRevenueReportPage"));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CurrencyProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/demo" element={<DemoPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
                <Route path="/cgu" element={<CGUPage />} />
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
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </CurrencyProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
