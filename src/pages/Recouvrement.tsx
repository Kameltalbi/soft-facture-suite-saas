import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface RecouvrementData {
  id: string;
  invoice_number: string;
  client_id: string;
  client_name: string;
  date: string;
  amount_total: number;
  amount_paid: number;
  status: 'payée' | 'partiellement payée' | 'non payée';
  days_late: number | null;
}

const Recouvrement = () => {
  const { user } = useAuth();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState<number | null>(null);
  const [data, setData] = useState<RecouvrementData[]>([]);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date();
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

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data: invoices, error } = await supabase.rpc('get_recouvrement_data', {
        sel_year: year,
        sel_month: month
      });
      
      if (error) {
        console.error('Error fetching recouvrement data:', error);
      } else {
        const typedInvoices: RecouvrementData[] = (invoices || []).map(inv => ({
          ...inv,
          status: inv.status as 'payée' | 'partiellement payée' | 'non payée'
        }));
        setData(typedInvoices);
      }
    } catch (error) {
      console.error('Error fetching recouvrement data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [year, month, user]);

  const getStatusCounts = () => {
    const counts = { payee: 0, partielle: 0, non: 0 };
    data.forEach(inv => {
      if (inv.status === 'payée') counts.payee++;
      else if (inv.status === 'partiellement payée') counts.partielle++;
      else counts.non++;
    });
    return [
      { name: 'Payées', value: counts.payee, color: '#10b981' },
      { name: 'Partielles', value: counts.partielle, color: '#f59e0b' },
      { name: 'Non payées', value: counts.non, color: '#ef4444' },
    ];
  };

  const getLateAmounts = () => {
    return [30, 45, 60, 90].map(days => {
      const total = data
        .filter(inv => inv.days_late && inv.days_late > days && inv.status !== 'payée')
        .reduce((acc, inv) => acc + (inv.amount_total - inv.amount_paid), 0);
      return { name: `> ${days}j`, Montant: Math.round(total * 100) / 100 };
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'payée':
        return 'default' as const;
      case 'partiellement payée':
        return 'secondary' as const;
      case 'non payée':
        return 'destructive' as const;
      default:
        return 'secondary' as const;
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getTotalStats = () => {
    const totalAmount = data.reduce((acc, inv) => acc + inv.amount_total, 0);
    const totalPaid = data.reduce((acc, inv) => acc + inv.amount_paid, 0);
    const totalUnpaid = totalAmount - totalPaid;
    const overdueAmount = data
      .filter(inv => inv.days_late && inv.days_late > 0 && inv.status !== 'payée')
      .reduce((acc, inv) => acc + (inv.amount_total - inv.amount_paid), 0);

    return { totalAmount, totalPaid, totalUnpaid, overdueAmount };
  };

  const stats = getTotalStats();

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-neutral-600">Chargement des données de recouvrement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Recouvrement</h1>
          <p className="text-neutral-600">Suivi des paiements et créances clients</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Année :</label>
              <Select
                value={year.toString()}
                onValueChange={(value) => setYear(parseInt(value))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Mois :</label>
              <Select
                value={month?.toString() || 'all'}
                onValueChange={(value) => setMonth(value === 'all' ? null : parseInt(value))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toute l'année</SelectItem>
                  {months.map((m) => (
                    <SelectItem key={m.value} value={m.value.toString()}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total facturé</p>
                <p className="text-2xl font-bold text-neutral-900">{formatCurrency(stats.totalAmount)}</p>
              </div>
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total encaissé</p>
                <p className="text-2xl font-bold text-success">{formatCurrency(stats.totalPaid)}</p>
              </div>
              <div className="w-3 h-3 bg-success rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Reste à encaisser</p>
                <p className="text-2xl font-bold text-warning">{formatCurrency(stats.totalUnpaid)}</p>
              </div>
              <div className="w-3 h-3 bg-warning rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">En retard</p>
                <p className="text-2xl font-bold text-destructive">{formatCurrency(stats.overdueAmount)}</p>
              </div>
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Répartition des factures</CardTitle>
            <CardDescription>Nombre de factures par statut de paiement</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getStatusCounts()}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {getStatusCounts().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Montants impayés par ancienneté</CardTitle>
            <CardDescription>Montants en souffrance selon la durée de retard</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getLateAmounts()}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Montant']} />
                <Bar dataKey="Montant" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détail des factures</CardTitle>
          <CardDescription>
            Liste détaillée des factures pour {months.find(m => m.value === month)?.label || 'toute l\'année'} {year}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Montant TTC</TableHead>
                  <TableHead>Montant payé</TableHead>
                  <TableHead>Reste à payer</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Retard (jours)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-neutral-50">
                    <TableCell className="font-mono">{invoice.invoice_number}</TableCell>
                    <TableCell>{invoice.client_name}</TableCell>
                    <TableCell>{formatDate(invoice.date)}</TableCell>
                    <TableCell>{formatCurrency(invoice.amount_total)}</TableCell>
                    <TableCell>{formatCurrency(invoice.amount_paid)}</TableCell>
                    <TableCell>{formatCurrency(invoice.amount_total - invoice.amount_paid)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {invoice.days_late && invoice.status !== 'payée' ? (
                        <span className={invoice.days_late > 30 ? 'text-red-600 font-medium' : 'text-gray-600'}>
                          {invoice.days_late}
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {data.length === 0 && (
            <div className="text-center py-8 text-neutral-500">
              Aucune facture trouvée pour la période sélectionnée
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Recouvrement;
