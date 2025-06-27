import { useState } from 'react';
import { Plus, Search, FileText, Calendar, Users, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { QuoteModal } from '@/components/modals/QuoteModal';
import { QuoteActionsMenu } from '@/components/quotes/QuoteActionsMenu';
import { QuotePDF } from '@/components/pdf/quotes/QuotePDF';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const Quotes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const { organization } = useAuth();

  // Fetch quotes from Supabase
  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ['quotes', organization?.id],
    queryFn: async () => {
      if (!organization?.id) return [];
      
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          clients (
            name,
            company,
            address,
            email
          ),
          quote_items (*)
        `)
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!organization?.id
  });

  const handleCreateQuote = () => {
    setSelectedQuote(null);
    setIsModalOpen(true);
  };

  const handleViewQuote = (quote) => {
    console.log('Viewing quote:', quote.quote_number);
  };

  const handleEditQuote = (quote) => {
    setSelectedQuote(quote);
    setIsModalOpen(true);
  };

  const handleDuplicateQuote = (quote) => {
    console.log('Duplicating quote:', quote.quote_number);
  };

  const handleConvertToInvoice = (quote) => {
    console.log('Converting quote to invoice:', quote.quote_number);
  };

  const handleDeleteQuote = (quote) => {
    console.log('Deleting quote:', quote.quote_number);
  };

  const handleEmailSent = (emailData) => {
    console.log('Sending email:', emailData);
  };

  const handleStatusChange = (quote, newStatus) => {
    console.log('Changing status for quote:', quote.quote_number, 'to:', newStatus);
  };

  const getStatutBadge = (statut) => {
    const variants = {
      'draft': 'secondary',
      'pending': 'default',
      'accepted': 'default',
      'rejected': 'destructive',
      'expired': 'secondary'
    };

    const labels = {
      'draft': 'Brouillon',
      'pending': 'En attente',
      'accepted': 'Accepté',
      'rejected': 'Refusé',
      'expired': 'Expiré'
    };

    return (
      <Badge variant={variants[statut] || 'secondary'}>
        {labels[statut] || statut}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatCurrency = (amount) => {
    return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`;
  };

  const filteredQuotes = quotes.filter(quote =>
    quote.quote_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.clients?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.clients?.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const stats = {
    total: quotes.length,
    pending: quotes.filter(q => q.status === 'pending').length,
    accepted: quotes.filter(q => q.status === 'accepted').length,
    totalValue: quotes.reduce((sum, q) => sum + (q.total_amount || 0), 0)
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F9FA] p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement des devis...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FA] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Devis</h1>
            <p className="text-neutral-600">Gérez vos devis et propositions commerciales</p>
          </div>
          <Button 
            onClick={handleCreateQuote}
            className="bg-[#6A9C89] hover:bg-[#5A8B7A] text-white"
          >
            <Plus size={20} className="mr-2" />
            Créer un devis
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Total devis</p>
                  <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-[#6A9C89]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">En attente</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Acceptés</p>
                  <p className="text-2xl font-bold text-success">{stats.accepted}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Valeur totale</p>
                  <p className="text-2xl font-bold text-neutral-900">{formatCurrency(stats.totalValue)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-[#6A9C89]" />
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
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
                <Input
                  placeholder="Rechercher par numéro ou client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des devis */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des devis</CardTitle>
            <CardDescription>
              {filteredQuotes.length} devis trouvé(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Validité</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Montant HT</TableHead>
                  <TableHead>Montant TTC</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote) => {
                  // Helper function to ensure proper status mapping
                  const getQuoteStatus = (dbStatus: string | null): 'accepted' | 'draft' | 'sent' | 'rejected' | 'expired' => {
                    if (!dbStatus) return 'draft';
                    
                    const statusMap: { [key: string]: 'accepted' | 'draft' | 'sent' | 'rejected' | 'expired' } = {
                      'accepted': 'accepted',
                      'draft': 'draft',
                      'pending': 'sent',
                      'rejected': 'rejected',
                      'expired': 'expired'
                    };
                    
                    return statusMap[dbStatus] || 'draft';
                  };

                  // Convert to expected format for the actions menu
                  const convertedQuote = {
                    number: quote.quote_number,
                    client: quote.clients?.name || '',
                    amount: quote.total_amount || 0,
                    validUntil: quote.valid_until || '',
                    status: getQuoteStatus(quote.status),
                    ...quote
                  };

                  // Prepare data for PDF
                  const pdfData = {
                    quoteData: {
                      number: quote.quote_number,
                      date: quote.date,
                      validUntil: quote.valid_until,
                      notes: quote.notes
                    },
                    lineItems: quote.quote_items || [],
                    client: {
                      name: quote.clients?.name || '',
                      company: quote.clients?.company || '',
                      address: quote.clients?.address || '',
                      email: quote.clients?.email || ''
                    },
                    company: {
                      name: organization?.name || 'Soft Facture',
                      address: organization?.address || '',
                      email: organization?.email || '',
                      phone: organization?.phone || ''
                    },
                    settings: {
                      showVat: true,
                      footer_content: 'Soft Facture - Merci pour votre confiance'
                    }
                  };

                  return (
                    <TableRow key={quote.id} className="hover:bg-neutral-50">
                      <TableCell>
                        <div className="flex items-center">
                          <FileText size={16} className="mr-2 text-[#6A9C89]" />
                          <span className="font-medium">{quote.quote_number}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="font-medium">{quote.clients?.name}</span>
                          {quote.clients?.company && (
                            <div className="text-sm text-neutral-500">{quote.clients.company}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatDate(quote.date)}
                      </TableCell>
                      <TableCell>
                        {quote.valid_until ? formatDate(quote.valid_until) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {getStatutBadge(quote.status)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(quote.subtotal || 0)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(quote.total_amount || 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        <QuoteActionsMenu
                          quote={convertedQuote}
                          pdfComponent={<QuotePDF {...pdfData} />}
                          onView={() => handleViewQuote(quote)}
                          onEdit={() => handleEditQuote(quote)}
                          onDuplicate={() => handleDuplicateQuote(quote)}
                          onConvertToInvoice={() => handleConvertToInvoice(quote)}
                          onStatusChange={(status) => handleStatusChange(quote, status)}
                          onDelete={() => handleDeleteQuote(quote)}
                          onEmailSent={handleEmailSent}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredQuotes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-neutral-500">
                      {quotes.length === 0 ? 'Aucun devis trouvé. Créez votre premier devis !' : 'Aucun devis ne correspond à votre recherche'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modal */}
        <QuoteModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          quote={selectedQuote}
          onSave={(data) => {
            console.log('Sauvegarde du devis:', data);
            setIsModalOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default Quotes;
