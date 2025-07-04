import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PaymentModal } from '@/components/modals/PaymentModal';
import { usePayments } from '@/hooks/usePayments';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Calendar, CreditCard, Download, History, Plus } from 'lucide-react';

const Recouvrement = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const { invoices, loading, fetchInvoicesWithPayments, createPayment } = usePayments();
  const { currency } = useCurrency();

  const months = [
    { value: '1', label: 'Janvier' },
    { value: '2', label: 'Février' },
    { value: '3', label: 'Mars' },
    { value: '4', label: 'Avril' },
    { value: '5', label: 'Mai' },
    { value: '6', label: 'Juin' },
    { value: '7', label: 'Juillet' },
    { value: '8', label: 'Août' },
    { value: '9', label: 'Septembre' },
    { value: '10', label: 'Octobre' },
    { value: '11', label: 'Novembre' },
    { value: '12', label: 'Décembre' }
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) + ' ' + currency.symbol;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusBadge = (status: string, remainingBalance: number) => {
    if (remainingBalance <= 0) {
      return <Badge className="bg-success text-success-foreground">Payée</Badge>;
    } else if (status === 'partially_paid') {
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Partiel</Badge>;
    } else {
      return <Badge variant="destructive">Non payée</Badge>;
    }
  };

  const handleFilterChange = () => {
    fetchInvoicesWithPayments(selectedMonth, selectedYear);
  };

  const handleAddPayment = async (paymentData: any) => {
    const success = await createPayment(paymentData);
    if (success) {
      setShowPaymentModal(false);
      setSelectedInvoice(null);
    }
  };

  const handleExport = () => {
    if (invoices.length === 0) return;

    const csvData = [
      ['Numéro facture', 'Client', 'Date', 'Montant total', 'Montant payé', 'Solde restant', 'Statut'],
      ...invoices.map(invoice => [
        invoice.invoice_number,
        invoice.client_name,
        formatDate(invoice.date),
        invoice.total_amount.toFixed(2),
        invoice.amount_paid.toFixed(2),
        invoice.remaining_balance.toFixed(2),
        invoice.remaining_balance <= 0 ? 'Payée' : invoice.status === 'partially_paid' ? 'Partiel' : 'Non payée'
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recouvrement_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Calculer les statistiques
  const stats = {
    totalInvoices: invoices.length,
    totalOutstanding: invoices.reduce((sum, inv) => sum + inv.remaining_balance, 0),
    totalPaid: invoices.reduce((sum, inv) => sum + inv.amount_paid, 0),
    fullyPaid: invoices.filter(inv => inv.remaining_balance <= 0).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement du recouvrement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Recouvrement</h1>
            <p className="text-muted-foreground">Gérez les paiements de vos factures</p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline">
              <Download size={16} className="mr-2" />
              Exporter
            </Button>
            
            <Button 
              onClick={() => setShowPaymentModal(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus size={16} className="mr-2" />
              Ajouter un paiement
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Factures</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalInvoices}</p>
                </div>
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">À recouvrer</p>
                  <p className="text-2xl font-bold text-destructive">{formatCurrency(stats.totalOutstanding)}</p>
                </div>
                <Calendar className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Encaissé</p>
                  <p className="text-2xl font-bold text-success">{formatCurrency(stats.totalPaid)}</p>
                </div>
                <CreditCard className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Réglées</p>
                  <p className="text-2xl font-bold text-success">{stats.fullyPaid}</p>
                </div>
                <Calendar className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="grid grid-cols-2 gap-4 flex-1">
                <div>
                  <label className="text-sm font-medium mb-2 block">Mois d'émission</label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les mois" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les mois</SelectItem>
                      {months.map(month => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Année</label>
                  <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={handleFilterChange}>
                Filtrer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des factures */}
        <Card>
          <CardHeader>
            <CardTitle>Factures à recouvrer</CardTitle>
            <CardDescription>
              {invoices.length} facture(s) trouvée(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Montant total</TableHead>
                  <TableHead>Montant payé</TableHead>
                  <TableHead>Solde restant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-muted/50">
                    <TableCell>
                      <span className="font-medium">{invoice.invoice_number}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{invoice.client_name}</span>
                    </TableCell>
                    <TableCell>
                      {formatDate(invoice.date)}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{formatCurrency(invoice.total_amount)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{formatCurrency(invoice.amount_paid)}</span>
                          <span className="text-xs text-muted-foreground">{invoice.payment_progress.toFixed(0)}%</span>
                        </div>
                        <Progress value={invoice.payment_progress} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${invoice.remaining_balance > 0 ? 'text-destructive' : 'text-success'}`}>
                        {formatCurrency(invoice.remaining_balance)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(invoice.status, invoice.remaining_balance)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setShowPaymentModal(true);
                          }}
                          disabled={invoice.remaining_balance <= 0}
                        >
                          <Plus size={16} className="mr-1" />
                          Paiement
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          <History size={16} className="mr-1" />
                          Historique
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {invoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Aucune facture à recouvrer trouvée
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modal de paiement */}
        <PaymentModal
          open={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedInvoice(null);
          }}
          invoice={selectedInvoice ? {
            id: selectedInvoice.id,
            number: selectedInvoice.invoice_number,
            amount: selectedInvoice.total_amount,
            paidAmount: selectedInvoice.amount_paid
          } : undefined}
          onSave={handleAddPayment}
        />
      </div>
    </div>
  );
};

export default Recouvrement;