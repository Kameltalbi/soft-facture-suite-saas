
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Search, Download, Mail, CreditCard, CheckCircle, Clock } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/layout/Header';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { RelanceModal } from '@/components/modals/RelanceModal';
import { PaymentModal } from '@/components/modals/PaymentModal';

interface RecouvrementData {
  id: string;
  invoice_number: string;
  client_id: string;
  client_name: string;
  date: string;
  amount_total: number;
  amount_paid: number;
  status: string;
  days_late: number;
}

const RecouvrementPage = () => {
  const { toast } = useToast();
  const [activeModule, setActiveModule] = useState('recouvrement');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [showRelanceModal, setShowRelanceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<RecouvrementData | null>(null);

  const { data: recouvrementData, isLoading, refetch } = useQuery({
    queryKey: ['recouvrement-data', selectedYear, selectedMonth],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_recouvrement_data', {
        sel_year: selectedYear,
        sel_month: selectedMonth
      });

      if (error) {
        console.error('Error fetching recouvrement data:', error);
        throw error;
      }

      return data as RecouvrementData[];
    },
  });

  const filteredData = recouvrementData?.filter(item => {
    const matchesSearch = item.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const totalUnpaid = filteredData.reduce((sum, item) => sum + (item.amount_total - item.amount_paid), 0);

  const getStatusColor = (status: string, daysLate: number) => {
    if (status === 'payée') return 'bg-green-100 text-green-800';
    if (daysLate <= 0) return 'bg-blue-100 text-blue-800';
    if (daysLate <= 30) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusLabel = (status: string, daysLate: number) => {
    if (status === 'payée') return 'Payée';
    if (daysLate <= 0) return 'À échoir';
    if (daysLate <= 30) return `Retard ${daysLate}j`;
    return `Retard ${daysLate}j`;
  };

  const handleRelance = (invoice: RecouvrementData) => {
    setSelectedInvoice(invoice);
    setShowRelanceModal(true);
  };

  const handleAddPayment = (invoice: RecouvrementData) => {
    setSelectedInvoice(invoice);
    setShowPaymentModal(true);
  };

  const handleMarkAsPaid = async (invoice: RecouvrementData) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ 
          amount_paid: invoice.amount_total,
          status: 'paid'
        })
        .eq('id', invoice.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La facture a été marquée comme payée",
      });

      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de marquer la facture comme payée",
        variant: "destructive",
      });
    }
  };

  const months = [
    { value: null, label: 'Toute l\'année' },
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

  const availableYears = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50">
        <AppSidebar activeModule={activeModule} onModuleChange={setActiveModule} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b border-gray-200 bg-white px-6">
            <Header activeModule={activeModule} />
          </div>
          
          <main className="flex-1 overflow-auto p-6">
            <div className="space-y-6">
              {/* En-tête avec total des impayés */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Recouvrement</h1>
                  <p className="text-gray-600">Suivi des paiements et relances</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total des impayés</p>
                    <p className="text-2xl font-bold text-red-600">
                      {totalUnpaid.toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </p>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Exporter
                  </Button>
                </div>
              </div>

              {/* Filtres */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <Input
                        placeholder="Rechercher par client ou numéro de facture..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrer par statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="non payée">Non payée</SelectItem>
                        <SelectItem value="partiellement payée">Partiellement payée</SelectItem>
                        <SelectItem value="payée">Payée</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedYear.toString()}
                      onValueChange={(value) => setSelectedYear(parseInt(value))}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableYears.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedMonth?.toString() || 'all'}
                      onValueChange={(value) => setSelectedMonth(value === 'all' ? null : parseInt(value))}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month.value || 'all'} value={month.value?.toString() || 'all'}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Tableau des factures */}
              <Card>
                <CardHeader>
                  <CardTitle>Factures impayées</CardTitle>
                  <CardDescription>
                    {filteredData.length} facture(s) trouvée(s)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Facture</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Montant total</TableHead>
                          <TableHead>Montant payé</TableHead>
                          <TableHead>Solde restant</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredData.map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell className="font-mono text-sm">
                              {invoice.invoice_number}
                            </TableCell>
                            <TableCell className="font-medium">
                              {invoice.client_name}
                            </TableCell>
                            <TableCell>
                              {invoice.amount_total.toLocaleString('fr-FR', {
                                style: 'currency',
                                currency: 'EUR'
                              })}
                            </TableCell>
                            <TableCell>
                              {invoice.amount_paid.toLocaleString('fr-FR', {
                                style: 'currency',
                                currency: 'EUR'
                              })}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {(invoice.amount_total - invoice.amount_paid).toLocaleString('fr-FR', {
                                style: 'currency',
                                currency: 'EUR'
                              })}
                            </TableCell>
                            <TableCell>
                              {new Date(invoice.date).toLocaleDateString('fr-FR')}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(invoice.status, invoice.days_late || 0)}>
                                {getStatusLabel(invoice.status, invoice.days_late || 0)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                {invoice.status !== 'payée' && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleRelance(invoice)}
                                      className="gap-1"
                                    >
                                      <Mail className="h-3 w-3" />
                                      Relancer
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleAddPayment(invoice)}
                                      className="gap-1"
                                    >
                                      <CreditCard className="h-3 w-3" />
                                      Paiement
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleMarkAsPaid(invoice)}
                                      className="gap-1"
                                    >
                                      <CheckCircle className="h-3 w-3" />
                                      Marquer payé
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>

      {/* Modals */}
      <RelanceModal
        open={showRelanceModal}
        onClose={() => setShowRelanceModal(false)}
        invoice={selectedInvoice}
        onSent={() => {
          setShowRelanceModal(false);
          toast({
            title: "Relance envoyée",
            description: "La relance a été envoyée avec succès",
          });
        }}
      />

      <PaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        invoice={selectedInvoice}
        onPaymentRecorded={() => {
          setShowPaymentModal(false);
          refetch();
          toast({
            title: "Paiement enregistré",
            description: "Le paiement a été enregistré avec succès",
          });
        }}
      />
    </SidebarProvider>
  );
};

export default RecouvrementPage;
