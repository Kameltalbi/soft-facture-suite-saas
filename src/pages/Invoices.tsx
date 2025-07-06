import { useState } from 'react';
import { InvoiceModal } from '@/components/modals/InvoiceModal';
import { InvoicesHeader } from '@/components/invoices/InvoicesHeader';
import { InvoicesFilters } from '@/components/invoices/InvoicesFilters';
import { InvoicesStats } from '@/components/invoices/InvoicesStats';
import { InvoicesTable } from '@/components/invoices/InvoicesTable';
import { useInvoicesData } from '@/hooks/useInvoicesData';
import { useInvoicesActions } from '@/hooks/useInvoicesActions';
import { useCustomTaxes } from '@/hooks/useCustomTaxes';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Invoice } from '@/types/invoice';

export default function Invoices() {
  const { customTaxes } = useCustomTaxes();
  const { organization } = useAuth();
  const { currency } = useCurrency();
  const { invoices, globalSettings, isLoading } = useInvoicesData();
  const {
    handleSaveInvoice,
    handleDuplicateInvoice,
    handleDeleteInvoice,
    handleValidateInvoice,
    handleSignInvoice,
    handlePaymentRecorded,
    handleEmailSent
  } = useInvoicesActions();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  
  // Date filters
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  
  // Generate available years (5 years back to 2 years forward)
  const availableYears = Array.from({ length: 8 }, (_, i) => currentDate.getFullYear() - 5 + i);

  const filteredInvoices = invoices.filter(invoice => {
    const invoiceDate = new Date(invoice.date);
    const matchesSearch = (invoice.clients?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = invoiceDate.getFullYear() === selectedYear;
    const matchesMonth = invoiceDate.getMonth() + 1 === selectedMonth;
    
    return matchesSearch && matchesYear && matchesMonth;
  });

  const handleNewInvoice = () => {
    setEditingInvoice(null);
    setShowInvoiceModal(true);
  };

  const handleEditInvoice = (invoice: any) => {
    // Mapper les données de la facture pour correspondre à ce que le modal attend
    const mappedInvoice = {
      ...invoice,
      number: invoice.invoice_number,
      client: invoice.clients,
      items: invoice.invoice_items?.map((item: any) => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        vatRate: item.tax_rate,
        discount: 0,
        total: item.total_price,
        productId: item.product_id
      })) || [],
      dueDate: invoice.due_date,
      invoiceSettings: {
        useVat: invoice.use_vat ?? true,
        customTaxesUsed: invoice.custom_taxes_used || [],
        hasAdvance: invoice.has_advance ?? false,
        advanceAmount: invoice.advance_amount || 0,
        currencyId: invoice.currency_id,
        useDiscount: true,
        salesChannel: invoice.sales_channel || 'local'
      }
    };
    
    setEditingInvoice(mappedInvoice);
    setShowInvoiceModal(true);
  };

  const handleInvoiceSave = async (invoiceData: any) => {
    await handleSaveInvoice(invoiceData, editingInvoice);
    setShowInvoiceModal(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F9FA] p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement des factures...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-neutral-50 min-h-screen">
      <InvoicesHeader onNewInvoice={handleNewInvoice} />
      
      <InvoicesFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        availableYears={availableYears}
      />

      <InvoicesStats invoices={filteredInvoices} />

      <InvoicesTable
        invoices={filteredInvoices}
        customTaxes={customTaxes}
        organization={organization}
        globalSettings={globalSettings}
        currency={currency}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onEditInvoice={handleEditInvoice}
        onDuplicateInvoice={handleDuplicateInvoice}
        onDeleteInvoice={handleDeleteInvoice}
        onValidateInvoice={handleValidateInvoice}
        onSignInvoice={handleSignInvoice}
        onPaymentRecorded={handlePaymentRecorded}
        onEmailSent={handleEmailSent}
      />

      <InvoiceModal
        open={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        invoice={editingInvoice}
        onSave={handleInvoiceSave}
      />
    </div>
  );
}