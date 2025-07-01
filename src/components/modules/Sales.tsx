
import { useState } from 'react';
import { InvoiceModal } from '@/components/modals/InvoiceModal';
import { InvoicePDF } from '@/components/pdf/InvoicePDF';
import { usePDFGeneration } from '@/hooks/usePDFGeneration';
import { SalesHeader } from './sales/SalesHeader';
import { SalesFilters } from './sales/SalesFilters';
import { SalesStats } from './sales/SalesStats';
import { SalesTable } from './sales/SalesTable';

interface Document {
  id: string;
  type: 'invoice' | 'quote' | 'delivery' | 'credit';
  number: string;
  date: string;
  client: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

const mockDocuments: Document[] = [
  {
    id: '1',
    type: 'invoice',
    number: 'FAC-2024-001',
    date: '2024-01-15',
    client: 'Entreprise ABC',
    amount: 1250.00,
    status: 'paid'
  },
  {
    id: '2',
    type: 'quote',
    number: 'DEV-2024-001',
    date: '2024-01-12',
    client: 'Société XYZ',
    amount: 850.00,
    status: 'sent'
  },
  {
    id: '3',
    type: 'delivery',
    number: 'BL-2024-001',
    date: '2024-01-10',
    client: 'Client Premium',
    amount: 2100.00,
    status: 'sent'
  },
  {
    id: '4',
    type: 'credit',
    number: 'AV-2024-001',
    date: '2024-01-08',
    client: 'Entreprise ABC',
    amount: -150.00,
    status: 'sent'
  }
];

export function Sales() {
  const { generateInvoicePDF } = usePDFGeneration();
  const [searchTerm, setSearchTerm] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [currentDocumentType, setCurrentDocumentType] = useState<'invoice' | 'quote' | 'delivery'>('invoice');
  
  // Date filters
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  
  // Generate available years (5 years back to 2 years forward)
  const availableYears = Array.from({ length: 8 }, (_, i) => currentDate.getFullYear() - 5 + i);
  
  const months = [
    { value: 1, label: 'Janvier' },
    { value: 2, label: 'Février' },
    { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' },
    { value: 8, label: 'Août' },
    { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' },
    { value: 11, label: 'Novembre' },
    { value: 12, label: 'Décembre' },
  ];

  const filteredDocuments = mockDocuments.filter(doc => {
    const docDate = new Date(doc.date);
    const matchesSearch = doc.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = docDate.getFullYear() === selectedYear;
    const matchesMonth = docDate.getMonth() + 1 === selectedMonth;
    
    return matchesSearch && matchesYear && matchesMonth;
  });

  const handleNewDocument = (type: 'invoice' | 'quote' | 'delivery' | 'credit') => {
    setEditingDocument(null);
    if (type !== 'credit') {
      setCurrentDocumentType(type);
    }
    setShowInvoiceModal(true);
  };

  const handleEditDocument = (document: Document) => {
    setEditingDocument(document);
    if (document.type !== 'credit') {
      setCurrentDocumentType(document.type);
    }
    setShowInvoiceModal(true);
  };

  const handleViewDocument = (document: Document) => {
    console.log('Viewing document:', document.number);
  };

  const handleDuplicateDocument = (document: Document) => {
    const duplicatedDocument = {
      ...document,
      id: Date.now().toString(),
      number: `${document.type.toUpperCase()}-2024-${String(mockDocuments.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      status: 'draft' as const
    };
    console.log('Duplicating document:', duplicatedDocument);
  };

  const handleMarkAsSent = (document: Document) => {
    console.log('Marking as sent:', document.number);
  };

  const handleMarkAsValidated = (document: Document) => {
    console.log('Marking as validated:', document.number);
  };

  const handleDeleteDocument = (document: Document) => {
    console.log('Deleting document:', document.number);
  };

  const handlePaymentRecorded = (paymentData: any) => {
    console.log('Recording payment:', paymentData);
  };

  const handleEmailSent = (emailData: any) => {
    console.log('Sending email:', emailData);
  };

  const getPDFData = (document: Document) => {
    const mockLineItems = [
      {
        id: '1',
        description: 'Service de consultation',
        quantity: 1,
        unitPrice: document.amount,
        vatRate: 20,
        discount: 0,
        total: document.amount
      }
    ];

    const mockSettings = {
      showVat: true,
      showDiscount: false,
      showAdvance: false,
      currency: 'EUR',
      amountInWords: true
    };

    return generateInvoicePDF(
      {
        number: document.number,
        date: document.date,
        clientId: '1',
        subject: `Facture pour ${document.client}`,
        notes: 'Merci pour votre confiance.'
      },
      mockLineItems,
      mockSettings
    );
  };

  return (
    <div className="p-6 space-y-6 bg-neutral-50 min-h-screen">
      <SalesHeader
        onNewQuote={() => handleNewDocument('quote')}
        onNewInvoice={() => handleNewDocument('invoice')}
      />

      <SalesFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        availableYears={availableYears}
        months={months}
      />

      <SalesStats
        documents={filteredDocuments}
        selectedMonth={selectedMonth}
        months={months}
      />

      <SalesTable
        documents={filteredDocuments}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        months={months}
        onViewDocument={handleViewDocument}
        onEditDocument={handleEditDocument}
        onDuplicateDocument={handleDuplicateDocument}
        onMarkAsSent={handleMarkAsSent}
        onMarkAsValidated={handleMarkAsValidated}
        onDeleteDocument={handleDeleteDocument}
        onPaymentRecorded={handlePaymentRecorded}
        onEmailSent={handleEmailSent}
        getPDFData={getPDFData}
      />

      <InvoiceModal
        open={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        invoice={editingDocument}
        onSave={(data) => {
          console.log('Saving document:', data);
          setShowInvoiceModal(false);
        }}
      />
    </div>
  );
}
