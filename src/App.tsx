
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import InvoiceReportPage from "./pages/reports/InvoiceReportPage";
import ProductRevenueReportPage from "./pages/reports/ProductRevenueReportPage";
import MonthlyRevenueReportPage from "./pages/reports/MonthlyRevenueReportPage";
import YearComparisonReportPage from "./pages/reports/YearComparisonReportPage";
import ProductRankingReportPage from "./pages/reports/ProductRankingReportPage";
import ClientRevenueReportPage from "./pages/reports/ClientRevenueReportPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
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
  </QueryClientProvider>
);

export default App;
