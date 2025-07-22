import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PaymentModal } from '@/components/modals/PaymentModal';
import { usePayments } from '@/hooks/usePayments';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Calendar, CreditCard, Download, History, Plus, Check, DollarSign } from 'lucide-react';

const Recouvrement = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const { invoices, loading, fetchInvoicesWithPayments, createPayment } = usePayments();
  const { currency, exchangeRates } = useCurrency();

  // Fonction pour convertir un montant vers la devise principale
  const convertToPrimaryCurrency = (amount: number, fromCurrencyCode: string): number => {
    if (fromCurrencyCode === currency.code) {
      return amount; // Déjà dans la devise principale
    }

    // Chercher le taux de change direct
    const directRate = exchangeRates.find(
      rate => rate.from_currency_code === fromCurrencyCode && rate.to_currency_code === currency.code
    );
    
    if (directRate) {
      return amount * directRate.rate;
    }

    // Chercher le taux inverse
    const inverseRate = exchangeRates.find(
      rate => rate.from_currency_code === currency.code && rate.to_currency_code === fromCurrencyCode
    );
    
    if (inverseRate) {
      return amount / inverseRate.rate;
    }

    // Si aucun taux trouvé, retourner le montant original
    console.warn(`Aucun taux de change trouvé pour ${fromCurrencyCode} -> ${currency.code}`);
    return amount;
  };

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

  const formatCurrency = (amount: number, invoiceCurrency?: { symbol: string; decimal_places: number }) => {
    const currencyToUse = invoiceCurrency || currency;
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: currencyToUse.decimal_places,
      maximumFractionDigits: currencyToUse.decimal_places,
    }).format(amount) + ' ' + currencyToUse.symbol;
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

  // Filtrage automatique lors du changement de sélection
  useEffect(() => {
    const monthToUse = selectedMonth === 'all' ? undefined : selectedMonth;
    fetchInvoicesWithPayments(monthToUse, selectedYear);
  }, [selectedMonth, selectedYear]);

  const handleAddPayment = async (paymentData: any) => {
    const success = await createPayment(paymentData);
    if (success) {
      setShowPaymentModal(false);
      setSelectedInvoice(null);
    }
  };

  const handleFullPayment = async (invoice: any, method: 'cheque' | 'virement') => {
    const paymentData = {
      invoice_id: invoice.id,
      amount: invoice.remaining_balance,
      payment_method: method,
      payment_date: new Date().toISOString().split('T')[0],
      notes: `Paiement total par ${method}`
    };
    
    await createPayment(paymentData);
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

  // Calculer les statistiques avec conversion de devise
  const stats = {
    totalInvoices: invoices.length,
    totalOutstanding: invoices.reduce((sum, inv) => {
      const convertedAmount = convertToPrimaryCurrency(inv.remaining_balance, inv.currency.code);
      return sum + convertedAmount;
    }, 0),
    totalPaid: invoices.reduce((sum, inv) => {
      const convertedAmount = convertToPrimaryCurrency(inv.amount_paid, inv.currency.code);
      return sum + convertedAmount;
    }, 0),
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
          
          <Button onClick={handleExport} variant="outline">
            <Download size={16} className="mr-2" />
            Exporter
          </Button>
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
                  <p className="text-sm text-muted-foreground">À recouvrer*</p>
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
                  <p className="text-sm text-muted-foreground">Encaissé*</p>
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
        
        {/* Note sur les devises */}
        <div className="text-xs text-muted-foreground text-center">
          * Les totaux sont exprimés en {currency.name} ({currency.symbol}). Les factures individuelles sont affichées dans leur devise d'origine.
        </div>

        {/* Filtres */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Mois d'émission</label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les mois" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les mois</SelectItem>
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
                      <span className="font-medium">{formatCurrency(invoice.total_amount, invoice.currency)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{formatCurrency(invoice.amount_paid, invoice.currency)}</span>
                          <span className="text-xs text-muted-foreground">{invoice.payment_progress.toFixed(0)}%</span>
                        </div>
                        <Progress value={invoice.payment_progress} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${invoice.remaining_balance > 0 ? 'text-destructive' : 'text-success'}`}>
                        {formatCurrency(invoice.remaining_balance, invoice.currency)}
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
                        
                        {invoice.remaining_balance > 0 && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                              onClick={() => handleFullPayment(invoice, 'cheque')}
                            >
                              <Check size={16} className="mr-1" />
                              Chèque
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                              onClick={() => handleFullPayment(invoice, 'virement')}
                            >
                              <DollarSign size={16} className="mr-1" />
                              Virement
                            </Button>
                          </>
                        )}
                        
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