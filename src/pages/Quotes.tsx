import { useState } from 'react';
import { Plus, Search, FileText } from 'lucide-react';
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
import { QuoteActionsMenu } from '@/components/quote/QuoteActionsMenu';
import { TemplatedInvoicePDF } from '@/components/pdf/TemplatedInvoicePDF';
import { Quote } from '@/types/quote';
import { useAuth } from '@/hooks/useAuth';

const QuotesPage = () => {
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  // Enhanced mock data with more realistic entries
  const [quotes] = useState<Quote[]>([
    {
      id: '1',
      numero: 'Devis-2025-0001',
      clientNom: 'Client ABC',
      dateCreation: '2025-01-15',
      dateValidite: '2025-02-15',
      statut: 'en_attente',
      montantHT: 1200.00,
      montantTTC: 1440.00,
      objet: 'Proposition de services informatiques',
      remarques: 'Merci de valider ce devis avant la date de validité.',
      lignes: [
        {
          id: '1',
          designation: 'Prestation de conseil',
          quantite: 20,
          prixUnitaireHT: 60.00,
          tva: 20,
          totalHT: 1200.00
        }
      ],
      organisationId: 'org1',
      dateCreationTimestamp: 1737000000
    },
    {
      id: '2',
      numero: 'Devis-2025-0002',
      clientNom: 'Client XYZ',
      dateCreation: '2025-01-14',
      dateValidite: '2025-02-14',
      statut: 'validee',
      montantHT: 850.00,
      montantTTC: 1020.00,
      objet: 'Fourniture de matériel de bureau',
      remarques: 'Conditions de paiement : 30 jours net.',
      lignes: [
        {
          id: '2',
          designation: 'Papier A4 ramette',
          quantite: 10,
          prixUnitaireHT: 85.00,
          tva: 20,
          totalHT: 850.00
        }
      ],
      organisationId: 'org1',
      dateCreationTimestamp: 1736913600
    },
    {
      id: '3',
      numero: 'Devis-2025-0003',
      clientNom: 'Client PQR',
      dateCreation: '2025-01-13',
      dateValidite: '2025-02-13',
      statut: 'acceptee',
      montantHT: 2500.00,
      montantTTC: 3000.00,
      objet: 'Installation de système de sécurité',
      remarques: 'Garantie de 1 an sur l\'installation.',
      lignes: [
        {
          id: '3',
          designation: 'Caméra de surveillance HD',
          quantite: 5,
          prixUnitaireHT: 500.00,
          tva: 20,
          totalHT: 2500.00
        }
      ],
      organisationId: 'org1',
      dateCreationTimestamp: 1736828400
    },
    {
      id: '4',
      numero: 'Devis-2025-0004',
      clientNom: 'Client LMN',
      dateCreation: '2025-01-12',
      dateValidite: '2025-02-12',
      statut: 'brouillon',
      montantHT: 450.00,
      montantTTC: 540.00,
      objet: 'Maintenance de parc informatique',
      remarques: 'Contrat de maintenance trimestriel.',
      lignes: [
        {
          id: '4',
          designation: 'Heures de maintenance',
          quantite: 3,
          prixUnitaireHT: 150.00,
          tva: 20,
          totalHT: 450.00
        }
      ],
      organisationId: 'org1',
      dateCreationTimestamp: 1736748000
    }
  ]);

  const handleCreateQuote = () => {
    setSelectedQuote(null);
    setIsModalOpen(true);
  };

  const handleViewQuote = (quote: Quote) => {
    console.log('Viewing quote:', quote.numero);
  };

  const handleEditQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsModalOpen(true);
  };

  const handleConvertToInvoice = (quote: Quote) => {
    console.log('Converting quote to invoice:', quote.numero);
  };

  const handleDuplicateQuote = (quote: Quote) => {
    console.log('Duplicating quote:', quote.numero);
  };

  const handleDeleteQuote = (quote: Quote) => {
    console.log('Deleting quote:', quote.numero);
  };

  const handleEmailSent = (emailData: any) => {
    console.log('Sending email:', emailData);
  };

  const getStatutBadge = (statut: Quote['statut']) => {
    const variants = {
      'brouillon': 'secondary',
      'en_attente': 'default',
      'validee': 'default',
      'acceptee': 'success',
      'refusee': 'destructive',
      'annulee': 'destructive'
    } as const;

    const labels = {
      'brouillon': 'Brouillon',
      'en_attente': 'En attente',
      'validee': 'Validée',
      'acceptee': 'Acceptée',
      'refusee': 'Refusée',
      'annulee': 'Annulée'
    };

    return (
      <Badge variant={variants[statut] || 'secondary'}>
        {labels[statut]}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`;
  };

  const filteredQuotes = quotes.filter(quote =>
    quote.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.clientNom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Informations de l'entreprise pour le PDF
  const company = {
    name: user?.user_metadata?.company_name || 'Mon Entreprise',
    logo: user?.user_metadata?.avatar_url,
    address: user?.user_metadata?.company_address,
    email: user?.email,
    phone: user?.user_metadata?.company_phone,
  };

  return (
    <div className="min-h-screen bg-[#F7F9FA] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Devis</h1>
            <p className="text-neutral-600">Gérez vos devis</p>
          </div>
          <Button 
            onClick={handleCreateQuote}
            className="bg-[#6A9C89] hover:bg-[#5A8B7A] text-white"
          >
            <Plus size={20} className="mr-2" />
            Créer un devis
          </Button>
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
                  <TableHead>Date Création</TableHead>
                  <TableHead>Date Validité</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Montant HT</TableHead>
                  <TableHead>Montant TTC</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote) => (
                  <TableRow key={quote.id} className="hover:bg-neutral-50">
                    <TableCell>
                      <div className="flex items-center">
                        <FileText size={16} className="mr-2 text-[#6A9C89]" />
                        <span className="font-medium">{quote.numero}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{quote.clientNom}</span>
                    </TableCell>
                    <TableCell>
                      {formatDate(quote.dateCreation)}
                    </TableCell>
                    <TableCell>
                      {formatDate(quote.dateValidite)}
                    </TableCell>
                    <TableCell>
                      {getStatutBadge(quote.statut)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(quote.montantHT)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(quote.montantTTC)}
                    </TableCell>
                    {/* Actions pour chaque devis */}
                    <TableCell className="text-right">
                      <QuoteActionsMenu
                        quote={quote}
                        pdfComponent={<TemplatedInvoicePDF 
                          invoiceData={{
                            number: quote.numero,
                            date: quote.dateCreation,
                            dueDate: quote.dateValidite,
                            subject: quote.objet,
                            notes: quote.remarques
                          }}
                          lineItems={quote.lignes.map(ligne => ({
                            id: ligne.id,
                            description: ligne.designation,
                            quantity: ligne.quantite,
                            unitPrice: ligne.prixUnitaireHT,
                            vatRate: ligne.tva,
                            discount: 0,
                            total: ligne.totalHT
                          }))}
                          client={{
                            name: quote.clientNom,
                            company: quote.clientNom,
                            address: '',
                            email: ''
                          }}
                          company={company}
                          settings={{
                            currency: '€',
                            showVat: true,
                            amountInWords: false
                          }}
                          documentType="DEVIS"
                        />}
                        onView={() => handleViewQuote(quote)}
                        onEdit={() => handleEditQuote(quote)}
                        onConvert={() => handleConvertToInvoice(quote)}
                        onDuplicate={() => handleDuplicateQuote(quote)}
                        onDelete={() => handleDeleteQuote(quote)}
                        onEmailSent={handleEmailSent}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {filteredQuotes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-neutral-500">
                      Aucun devis trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modal */}
        <QuoteModal
          isOpen={isModalOpen}
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

export default QuotesPage;
