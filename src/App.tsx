
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import InvoiceReportPage from "./pages/reports/InvoiceReportPage";
import ProductRevenueReportPage from "./pages/reports/ProductRevenueReportPage";
import MonthlyRevenueReportPage from "./pages/reports/MonthlyRevenueReportPage";
import YearComparisonReportPage from "./pages/reports/YearComparisonReportPage";
import ProductRankingReportPage from "./pages/reports/ProductRankingReportPage";
import ClientRevenueReportPage from "./pages/reports/ClientRevenueReportPage";
import { CurrencyProvider } from "./contexts/CurrencyContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CurrencyProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/app" element={<Index />} />
            <Route path="/reports/invoices" element={<InvoiceReportPage />} />
            <Route path="/reports/product-revenue" element={<ProductRevenueReportPage />} />
            <Route path="/reports/monthly-revenue" element={<MonthlyRevenueReportPage />} />
            <Route path="/reports/year-comparison" element={<YearComparisonReportPage />} />
            <Route path="/reports/product-ranking" element={<ProductRankingReportPage />} />
            <Route path="/reports/client-revenue" element={<ClientRevenueReportPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CurrencyProvider>
  </QueryClientProvider>
);

export default App;
