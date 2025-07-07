import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Filter, Eye, Edit, Trash2, Download, Send, FileText } from 'lucide-react';
import { CreateAvoirModal } from '@/components/modals/CreateAvoirModal';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { AvoirPDF } from '@/components/pdf/AvoirPDF';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/contexts/CurrencyContext';

interface Avoir {
  id: string;
  number: string;
  type: 'facture_liee' | 'economique';
  invoiceNumber?: string;
  clientName: string;
  amount: number;
  date: string;
  status: 'brouillon' | 'valide' | 'envoye';
  notes?: string;
}

const mockAvoirs: Avoir[] = [
  {
    id: '1',
    number: 'AV-2024-001',
    type: 'facture_liee',
    invoiceNumber: 'F-2024-045',
    clientName: 'Entreprise ABC',
    amount: -1250.50,
    date: '2024-03-15',
    status: 'valide',
    notes: 'Retour produit défaillant'
  },
  {
    id: '2',
    number: 'AV-2024-002',
    type: 'economique',
    clientName: 'Société XYZ',
    amount: -300.00,
    date: '2024-03-14',
    status: 'envoye',
    notes: 'Geste commercial'
  },
  {
    id: '3',
    number: 'AV-2024-003',
    type: 'facture_liee',
    invoiceNumber: 'F-2024-038',
    clientName: 'Cabinet Conseil',
    amount: -850.75,
    date: '2024-03-13',
    status: 'brouillon',
    notes: 'Erreur de facturation'
  }
];

export default function Avoirs() {
  const { organization } = useAuth();
  const { currency } = useCurrency();
  const [avoirs, setAvoirs] = useState<Avoir[]>(mockAvoirs);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
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

  const filteredAvoirs = avoirs.filter(avoir => {
    const avoirDate = new Date(avoir.date);
    const matchesSearch = 
      avoir.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      avoir.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (avoir.invoiceNumber && avoir.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || avoir.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || avoir.status === statusFilter;
    const matchesYear = avoirDate.getFullYear() === selectedYear;
    const matchesMonth = avoirDate.getMonth() + 1 === selectedMonth;
    
    return matchesSearch && matchesType && matchesStatus && matchesYear && matchesMonth;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      brouillon: 'secondary',
      valide: 'default',
      envoye: 'destructive'
    } as const;

    const labels = {
      brouillon: 'Brouillon',
      valide: 'Validé',
      envoye: 'Envoyé'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    return type === 'facture_liee' ? (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        Facture liée
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        Économique
      </Badge>
    );
  };

  const handleCreateAvoir = (avoirData: any) => {
    const newAvoir: Avoir = {
      id: Date.now().toString(),
      number: `AV-2024-${String(avoirs.length + 1).padStart(3, '0')}`,
      type: avoirData.type,
      invoiceNumber: avoirData.invoiceNumber,
      clientName: avoirData.clientName,
      amount: avoirData.amount,
      date: avoirData.date,
      status: 'brouillon',
      notes: avoirData.notes
    };

    setAvoirs([...avoirs, newAvoir]);
    setIsCreateModalOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-FR', { 
      style: 'currency', 
      currency: currency.code 
    });
  };

  const stats = {
    total: filteredAvoirs.length,
    brouillon: filteredAvoirs.filter(a => a.status === 'brouillon').length,
    valide: filteredAvoirs.filter(a => a.status === 'valide').length,
    envoye: filteredAvoirs.filter(a => a.status === 'envoye').length,
    totalAmount: filteredAvoirs.reduce((sum, avoir) => sum + avoir.amount, 0)
  };

  const getPDFData = (avoir: Avoir) => {
    const mockClient = {
      name: avoir.clientName,
      company: avoir.clientName,
      address: '123 Rue de l\'Exemple, 75001 Paris',
      email: 'contact@example.com'
    };

    const companyData = {
      name: organization?.name || 'Soft Facture',
      address: organization?.address || '456 Avenue de la République, 69000 Lyon',
      email: organization?.email || 'contact@softfacture.fr',
      phone: organization?.phone || '04 72 00 00 00',
      logo: organization?.logo_url
    };

    const settings = {
      showVat: true,
      showDiscount: true,
      currency: 'EUR',
      amountInWords: true
    };

    return {
      avoirData: avoir,
      client: mockClient,
      company: companyData,
      settings
    };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Avoirs</h1>
          <p className="text-gray-600 mt-1">Gestion des avoirs et notes de crédit</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nouvel avoir
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un nouvel avoir</DialogTitle>
            </DialogHeader>
            <CreateAvoirModal onSave={handleCreateAvoir} onCancel={() => setIsCreateModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Brouillons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.brouillon}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Validés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.valide}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Envoyés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.envoye}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Montant total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(stats.totalAmount)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par numéro, client ou facture..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
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
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Type d'avoir" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="facture_liee">Facture liée</SelectItem>
                <SelectItem value="economique">Économique</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="brouillon">Brouillon</SelectItem>
                <SelectItem value="valide">Validé</SelectItem>
                <SelectItem value="envoye">Envoyé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des avoirs</CardTitle>
          <p className="text-sm text-gray-600">
            Avoirs pour {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° d'avoir</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Facture liée</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">Montant TTC</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAvoirs.map((avoir) => (
                <TableRow key={avoir.id}>
                  <TableCell className="font-medium">{avoir.number}</TableCell>
                  <TableCell>{getTypeBadge(avoir.type)}</TableCell>
                  <TableCell>
                    {avoir.invoiceNumber ? (
                      <span className="text-blue-600 hover:underline cursor-pointer">
                        {avoir.invoiceNumber}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>{avoir.clientName}</TableCell>
                  <TableCell className="text-right font-medium text-red-600">
                    {formatCurrency(avoir.amount)}
                  </TableCell>
                  <TableCell>
                    {new Date(avoir.date).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>{getStatusBadge(avoir.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <PDFDownloadLink
                        document={<AvoirPDF {...getPDFData(avoir)} />}
                        fileName={`${avoir.number}.pdf`}
                      >
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </PDFDownloadLink>
                      <Button variant="ghost" size="sm">
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Empty state */}
      {filteredAvoirs.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun avoir trouvé</h3>
          <p className="text-gray-600 mb-4">
            Aucun avoir ne correspond à vos critères pour {months.find(m => m.value === selectedMonth)?.label} {selectedYear}.
          </p>
        </div>
      )}
    </div>
  );
}
