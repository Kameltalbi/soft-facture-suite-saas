import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { InvoiceModal } from '@/components/modals/InvoiceModal';
import { InvoicePDF } from '@/components/pdf/invoices/InvoicePDF';
import { InvoiceActionsMenu } from '@/components/invoices/InvoiceActionsMenu';
import { usePDFGeneration } from '@/hooks/usePDFGeneration';
import { useCustomTaxes } from '@/hooks/useCustomTaxes';
import { calculateCustomTaxes } from '@/utils/customTaxCalculations';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/contexts/CurrencyContext';

type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'partially_paid';

interface Invoice {
  id: string;
  number: string;
  client: string;
  amount: number;
  status: InvoiceStatus;
}

const statusLabels = {
  draft: { label: 'Brouillon', variant: 'secondary' as const },
  sent: { label: 'Envoyé', variant: 'default' as const },
  paid: { label: 'Payé', variant: 'default' as const },
  overdue: { label: 'En retard', variant: 'destructive' as const },
  partially_paid: { label: 'Payé P.', variant: 'outline' as const }
};

export default function Invoices() {
  const { generateInvoicePDF } = usePDFGeneration();
  const { customTaxes } = useCustomTaxes();
  const { organization } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currency } = useCurrency();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  
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

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['invoices', organization?.id],
    queryFn: async () => {
      if (!organization?.id) return [];
      
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          clients (
            name,
            company,
            address,
            email,
            vat_number
          ),
          invoice_items (*)
        `)
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching invoices:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!organization?.id
  });

  const { data: globalSettings } = useQuery({
    queryKey: ['globalSettings', organization?.id],
    queryFn: async () => {
      if (!organization?.id) return null;
      
      const { data, error } = await supabase
        .from('global_settings')
        .select('*')
        .eq('organization_id', organization.id)
        .maybeSingle();

      if (error) {
        console.error('Erreur lors de la récupération des paramètres globaux:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!organization?.id
  });

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
    setEditingInvoice({
      id: invoice.id,
      number: invoice.invoice_number,
      client: invoice.clients?.name || '',
      amount: invoice.total_amount,
      status: invoice.status as InvoiceStatus
    });
    setShowInvoiceModal(true);
  };

  const handleSaveInvoice = async (invoiceData: any) => {
    try {
      if (!organization?.id) {
        toast({
          title: "Erreur",
          description: "Organisation non trouvée",
          variant: "destructive"
        });
        return;
      }

      console.log('Saving invoice:', invoiceData);

      if (editingInvoice) {
        // Mise à jour d'une facture existante
        const { error: updateError } = await supabase
          .from('invoices')
          .update({
            invoice_number: invoiceData.number,
            date: invoiceData.date,
            due_date: invoiceData.dueDate,
            client_id: invoiceData.client?.id,
            subtotal: invoiceData.totals.subtotalHT,
            tax_amount: invoiceData.totals.totalVAT,
            total_amount: invoiceData.totals.totalTTC,
            notes: invoiceData.notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingInvoice.id);

        if (updateError) throw updateError;

        // Supprimer les anciens éléments et en créer de nouveaux
        await supabase.from('invoice_items').delete().eq('invoice_id', editingInvoice.id);
        
        if (invoiceData.items && invoiceData.items.length > 0) {
          const newItems = invoiceData.items.map((item: any) => ({
            invoice_id: editingInvoice.id,
            organization_id: organization.id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            tax_rate: item.vatRate,
            total_price: item.total
          }));

          const { error: itemsError } = await supabase.from('invoice_items').insert(newItems);
          if (itemsError) throw itemsError;
        }

        toast({
          title: "Succès",
          description: "La facture a été mise à jour avec succès",
        });
      } else {
        // Création d'une nouvelle facture
        const { data: newInvoice, error: invoiceError } = await supabase
          .from('invoices')
          .insert({
            invoice_number: invoiceData.number,
            date: invoiceData.date,
            due_date: invoiceData.dueDate,
            client_id: invoiceData.client?.id,
            organization_id: organization.id,
            status: 'draft',
            subtotal: invoiceData.totals.subtotalHT,
            tax_amount: invoiceData.totals.totalVAT,
            total_amount: invoiceData.totals.totalTTC,
            notes: invoiceData.notes
          })
          .select()
          .single();

        if (invoiceError) throw invoiceError;

        // Créer les éléments de facture
        if (invoiceData.items && invoiceData.items.length > 0) {
          const newItems = invoiceData.items.map((item: any) => ({
            invoice_id: newInvoice.id,
            organization_id: organization.id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            tax_rate: item.vatRate,
            total_price: item.total
          }));

          const { error: itemsError } = await supabase.from('invoice_items').insert(newItems);
          if (itemsError) throw itemsError;
        }

        toast({
          title: "Succès",
          description: "La facture a été créée avec succès",
        });
      }

      // Rafraîchir la liste des factures
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      setShowInvoiceModal(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde de la facture",
        variant: "destructive"
      });
    }
  };

  const handleViewInvoice = (invoice: any) => {
    console.log('Viewing invoice:', invoice.invoice_number);
  };

  const handleDuplicateInvoice = async (invoice: any) => {
    try {
      // Générer un nouveau numéro de facture
      const invoiceNumber = `FAC-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;
      
      // Créer la nouvelle facture
      const { data: newInvoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoiceNumber,
          client_id: invoice.client_id,
          organization_id: organization.id,
          date: new Date().toISOString().split('T')[0],
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'draft',
          subtotal: invoice.subtotal,
          tax_amount: invoice.tax_amount,
          total_amount: invoice.total_amount,
          notes: invoice.notes
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Dupliquer les éléments de facture
      if (invoice.invoice_items && invoice.invoice_items.length > 0) {
        const newItems = invoice.invoice_items.map(item => ({
          invoice_id: newInvoice.id,
          organization_id: organization.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          tax_rate: item.tax_rate,
          total_price: item.total_price,
          product_id: item.product_id
        }));

        const { error: itemsError } = await supabase
          .from('invoice_items')
          .insert(newItems);

        if (itemsError) throw itemsError;
      }

      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Succès",
        description: `La facture ${invoice.invoice_number} a été dupliquée en ${invoiceNumber}`,
      });
    } catch (error) {
      console.error('Erreur lors de la duplication:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la duplication de la facture",
        variant: "destructive"
      });
    }
  };

  const handleMarkAsSent = async (invoice: any) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ 
          status: 'sent',
          updated_at: new Date().toISOString()
        })
        .eq('id', invoice.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Succès",
        description: `La facture ${invoice.invoice_number} a été marquée comme envoyée`,
      });
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du changement de statut",
        variant: "destructive"
      });
    }
  };

  const handleDeleteInvoice = async (invoice: any) => {
    try {
      // Supprimer d'abord les éléments de facture
      const { error: itemsError } = await supabase
        .from('invoice_items')
        .delete()
        .eq('invoice_id', invoice.id);

      if (itemsError) throw itemsError;

      // Supprimer la facture
      const { error: invoiceError } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoice.id);

      if (invoiceError) throw invoiceError;

      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Succès",
        description: `La facture ${invoice.invoice_number} a été supprimée`,
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de la facture",
        variant: "destructive"
      });
    }
  };

  const handlePaymentRecorded = async (paymentData: any) => {
    try {
      // Récupérer la facture actuelle pour connaître son montant total
      const { data: currentInvoice, error: fetchError } = await supabase
        .from('invoices')
        .select('total_amount, amount_paid')
        .eq('id', paymentData.invoiceId)
        .single();

      if (fetchError) throw fetchError;

      // Calculer le nouveau montant payé
      const newAmountPaid = (currentInvoice.amount_paid || 0) + paymentData.amount;
      
      // Déterminer le nouveau statut
      let newStatus = 'partially_paid';
      if (newAmountPaid >= currentInvoice.total_amount) {
        newStatus = 'paid';
      }

      const { error } = await supabase
        .from('invoices')
        .update({ 
          amount_paid: newAmountPaid,
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentData.invoiceId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Succès",
        description: newStatus === 'paid' ? "Le paiement a été enregistré - Facture marquée comme payée" : "Le paiement partiel a été enregistré",
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du paiement:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'enregistrement du paiement",
        variant: "destructive"
      });
    }
  };

  const handleEmailSent = (emailData: any) => {
    toast({
      title: "Email envoyé",
      description: `La facture a été envoyée à ${emailData.to}`,
    });
  };

  const formatCurrency = (amount) => {
    return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} ${currency.symbol}`;
  };

  const getPDFData = (invoice: any) => {
    const mockLineItems = invoice.invoice_items?.map(item => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      vatRate: item.tax_rate,
      discount: 0,
      total: item.total_price
    })) || [];

    const company = {
      name: organization?.name || 'Mon Entreprise',
      address: organization?.address || 'Adresse de l\'entreprise',
      email: organization?.email || 'contact@monentreprise.fr',
      phone: organization?.phone || 'Téléphone',
      logo_url: organization?.logo_url
    };

    const client = {
      name: invoice.clients?.name || '',
      company: invoice.clients?.company || '',
      address: invoice.clients?.address || '',
      email: invoice.clients?.email || '',
      vat_number: invoice.clients?.vat_number || ''
    };

    // Calcul des taxes personnalisées
    const subtotal = mockLineItems.reduce((sum, item) => sum + (item.total || 0), 0);
    const customTaxCalculations = calculateCustomTaxes(subtotal, customTaxes, 'invoice');

    return {
      invoiceData: {
        number: invoice.invoice_number,
        date: invoice.date,
        dueDate: invoice.due_date,
        subject: `Facture pour ${invoice.clients?.name || ''}`,
        notes: invoice.notes || 'Merci pour votre confiance.'
      },
      lineItems: mockLineItems,
      client,
      company,
      settings: {
        showVat: true,
        footer_content: globalSettings?.footer_content || '',
        footer_display: globalSettings?.footer_display || 'all'
      },
      currency: currency,
      customTaxes: customTaxCalculations
    };
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Factures</h1>
          <p className="text-neutral-600">Gérez vos factures clients</p>
        </div>
        <Button onClick={handleNewInvoice} className="bg-primary hover:bg-primary/90">
          <Plus size={16} className="mr-2" />
          Nouvelle Facture
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
              <Input
                placeholder="Rechercher par client ou numéro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-neutral-200"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Année :</label>
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
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Mois :</label>
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(parseInt(value))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total factures</p>
                <p className="text-2xl font-bold text-neutral-900">{filteredInvoices.length}</p>
              </div>
              <div className="w-3 h-3 bg-primary rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Payées</p>
                <p className="text-2xl font-bold text-success">{filteredInvoices.filter(i => i.status === 'paid').length}</p>
              </div>
              <div className="w-3 h-3 bg-success rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Payées P.</p>
                <p className="text-2xl font-bold text-orange-500">{filteredInvoices.filter(i => i.status === 'partially_paid').length}</p>
              </div>
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Envoyées</p>
                <p className="text-2xl font-bold text-secondary">{filteredInvoices.filter(i => i.status === 'sent').length}</p>
              </div>
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">En retard</p>
                <p className="text-2xl font-bold text-destructive">{filteredInvoices.filter(i => i.status === 'overdue').length}</p>
              </div>
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des factures</CardTitle>
          <CardDescription>
            Consultez et gérez toutes vos factures pour {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-neutral-50">
                  <TableCell className="font-mono">{invoice.invoice_number}</TableCell>
                  <TableCell>{new Date(invoice.date).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">{invoice.clients?.name}</span>
                      {invoice.clients?.company && (
                        <div className="text-sm text-neutral-500">{invoice.clients.company}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatCurrency(invoice.total_amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusLabels[invoice.status as InvoiceStatus]?.variant || 'secondary'}>
                      {statusLabels[invoice.status as InvoiceStatus]?.label || invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <InvoiceActionsMenu
                      invoice={{
                        id: invoice.id,
                        number: invoice.invoice_number,
                        client: invoice.clients?.name || '',
                        amount: invoice.total_amount,
                        paidAmount: invoice.amount_paid || 0,
                        status: invoice.status as InvoiceStatus
                      }}
                      pdfComponent={<InvoicePDF {...getPDFData(invoice)} />}
                      onView={() => handleViewInvoice(invoice)}
                      onEdit={() => handleEditInvoice(invoice)}
                      onDuplicate={() => handleDuplicateInvoice(invoice)}
                      onMarkAsSent={() => handleMarkAsSent(invoice)}
                      onDelete={() => handleDeleteInvoice(invoice)}
                      onPaymentRecorded={handlePaymentRecorded}
                      onEmailSent={handleEmailSent}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {filteredInvoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                    {invoices.length === 0 ? 'Aucune facture trouvée. Créez votre première facture !' : 'Aucune facture ne correspond à votre recherche'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal */}
      <InvoiceModal
        open={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        invoice={editingInvoice}
        onSave={handleSaveInvoice}
      />
    </div>
  );
}
