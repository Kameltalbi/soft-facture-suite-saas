import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/contexts/CurrencyContext';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  total: number;
}

interface Invoice {
  id: string;
  number: string;
  clientName: string;
  clientId: string;
  date: string;
  total: number;
  items: LineItem[];
}

interface Client {
  id: string;
  name: string;
}

interface CreateAvoirModalProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function CreateAvoirModal({ onSave, onCancel }: CreateAvoirModalProps) {
  const { profile } = useAuth();
  const { currency } = useCurrency();
  const [type, setType] = useState<'facture_liee' | 'economique'>('facture_liee');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [number, setNumber] = useState(`AV-2024-${String(Date.now()).slice(-3)}`);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [customItems, setCustomItems] = useState<LineItem[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.organization_id) {
      fetchInvoicesAndClients();
    }
  }, [profile?.organization_id]);

  const fetchInvoicesAndClients = async () => {
    if (!profile?.organization_id) return;

    setLoading(true);
    try {
      // Récupérer les factures avec leurs items et clients
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select(`
          id,
          invoice_number,
          date,
          total_amount,
          client_id,
          clients(id, name),
          invoice_items(
            id,
            description,
            quantity,
            unit_price,
            tax_rate,
            total_price
          )
        `)
        .eq('organization_id', profile.organization_id)
        .eq('status', 'paid')
        .order('date', { ascending: false });

      if (invoicesError) {
        console.error('Erreur lors du chargement des factures:', invoicesError);
        toast({
          title: "Erreur",
          description: "Impossible de charger les factures.",
          variant: "destructive",
        });
      } else if (invoicesData) {
        const formattedInvoices: Invoice[] = invoicesData.map(invoice => ({
          id: invoice.id,
          number: invoice.invoice_number,
          clientName: invoice.clients?.name || 'Client inconnu',
          clientId: invoice.client_id,
          date: invoice.date,
          total: invoice.total_amount || 0,
          items: invoice.invoice_items?.map(item => ({
            id: item.id,
            description: item.description,
            quantity: item.quantity || 0,
            unitPrice: item.unit_price || 0,
            vatRate: item.tax_rate || 0,
            total: item.total_price || 0
          })) || []
        }));
        setInvoices(formattedInvoices);
      }

      // Récupérer les clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('id, name')
        .eq('organization_id', profile.organization_id)
        .eq('status', 'active')
        .order('name');

      if (clientsError) {
        console.error('Erreur lors du chargement des clients:', clientsError);
      } else if (clientsData) {
        setClients(clientsData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement des données.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInvoiceSelection = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      setSelectedInvoice(invoice);
      setSelectedClient(invoice.clientName);
      setSelectedClientId(invoice.clientId);
      setLineItems([...invoice.items]);
    }
  };

  const handleClientSelection = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setSelectedClient(client.name);
      setSelectedClientId(clientId);
    }
  };

  const updateLineItemQuantity = (itemId: string, newQuantity: number) => {
    setLineItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity, total: newQuantity * item.unitPrice }
          : item
      )
    );
  };

  const removeLineItem = (itemId: string) => {
    setLineItems(items => items.filter(item => item.id !== itemId));
  };

  const addCustomItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: 20,
      total: 0
    };
    setCustomItems([...customItems, newItem]);
  };

  const updateCustomItem = (itemId: string, field: keyof LineItem, value: any) => {
    setCustomItems(items =>
      items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const removeCustomItem = (itemId: string) => {
    setCustomItems(items => items.filter(item => item.id !== itemId));
  };

  const calculateTotal = () => {
    const items = type === 'facture_liee' ? lineItems : customItems;
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSubmit = (status: 'draft' | 'sent') => {
    if (type === 'facture_liee' && !selectedInvoice) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une facture.",
        variant: "destructive",
      });
      return;
    }

    if (type === 'economique' && !selectedClientId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un client.",
        variant: "destructive",
      });
      return;
    }

    const total = calculateTotal();
    if (total === 0) {
      toast({
        title: "Erreur",
        description: "Le montant de l'avoir ne peut pas être nul.",
        variant: "destructive",
      });
      return;
    }

    const avoirData = {
      type,
      number,
      date,
      notes,
      clientName: selectedClient,
      clientId: selectedClientId,
      invoiceNumber: selectedInvoice?.number,
      invoiceId: selectedInvoice?.id,
      amount: total,
      status,
      items: type === 'facture_liee' ? lineItems : customItems
    };

    onSave(avoirData);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-FR', { 
      style: 'currency', 
      currency: currency.code 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Type Selection */}
      <div className="border-b pb-4">
        <Label className="text-base font-medium">Type d'avoir</Label>
        <Tabs value={type} onValueChange={(value) => setType(value as 'facture_liee' | 'economique')} className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="facture_liee">Avoir lié à une facture</TabsTrigger>
            <TabsTrigger value="economique">Avoir économique</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="number">Numéro d'avoir</Label>
          <Input
            id="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="AV-2024-001"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {/* Content based on type */}
      <Tabs value={type} className="space-y-6">
        <TabsContent value="facture_liee" className="space-y-4">
          <div className="space-y-2">
            <Label>Facture à créditer</Label>
            {invoices.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <p>Aucune facture payée trouvée</p>
                <p className="text-sm">Seules les factures payées peuvent faire l'objet d'un avoir</p>
              </div>
            ) : (
              <Select onValueChange={handleInvoiceSelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une facture" />
                </SelectTrigger>
                <SelectContent>
                  {invoices.map((invoice) => (
                    <SelectItem key={invoice.id} value={invoice.id}>
                      {invoice.number} - {invoice.clientName} - {invoice.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {selectedInvoice && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Facture {selectedInvoice.number}</CardTitle>
                <p className="text-sm text-gray-600">
                  Client: {selectedInvoice.clientName} • Date: {new Date(selectedInvoice.date).toLocaleDateString('fr-FR')}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label>Lignes à créditer (modifiez les quantités si nécessaire):</Label>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-24">Qté orig.</TableHead>
                        <TableHead className="w-24">Qté crédit</TableHead>
                        <TableHead className="w-24">Prix unit.</TableHead>
                        <TableHead className="w-24 text-right">Total</TableHead>
                        <TableHead className="w-16"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lineItems.map((item) => {
                        const originalItem = selectedInvoice.items.find(i => i.id === item.id);
                        return (
                          <TableRow key={item.id}>
                            <TableCell>{item.description}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline">{originalItem?.quantity || 0}</Badge>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateLineItemQuantity(item.id, parseInt(e.target.value) || 0)}
                                min="0"
                                max={originalItem?.quantity || 0}
                                className="w-full"
                              />
                            </TableCell>
                            <TableCell>
                              {formatCurrency(item.unitPrice)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(item.total)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeLineItem(item.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="economique" className="space-y-4">
          <div className="space-y-2">
            <Label>Client</Label>
            {clients.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <p>Aucun client trouvé</p>
                <p className="text-sm">Veuillez d'abord créer des clients</p>
              </div>
            ) : (
              <Select onValueChange={handleClientSelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Lignes de l'avoir</CardTitle>
                <Button onClick={addCustomItem} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une ligne
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {customItems.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-20">Qté</TableHead>
                      <TableHead className="w-32">Prix unit. HT</TableHead>
                      <TableHead className="w-20">TVA</TableHead>
                      <TableHead className="w-32 text-right">Total HT</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input
                            value={item.description}
                            onChange={(e) => updateCustomItem(item.id, 'description', e.target.value)}
                            placeholder="Description de l'avoir..."
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateCustomItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                            min="1"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateCustomItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            step="0.01"
                            min="0"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={item.vatRate.toString()}
                            onValueChange={(value) => updateCustomItem(item.id, 'vatRate', parseInt(value))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">0%</SelectItem>
                              <SelectItem value="5.5">5.5%</SelectItem>
                              <SelectItem value="10">10%</SelectItem>
                              <SelectItem value="20">20%</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.total)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCustomItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Aucune ligne ajoutée</p>
                  <p className="text-sm">Cliquez sur "Ajouter une ligne" pour commencer</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Commentaire / Justification</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Motif de l'avoir, explications..."
          rows={3}
        />
      </div>

      {/* Total */}
      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total de l'avoir:</span>
            <span className="text-red-600">
              -{formatCurrency(Math.abs(calculateTotal()))}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button variant="outline" onClick={() => handleSubmit('draft')}>
          Enregistrer brouillon
        </Button>
        <Button onClick={() => handleSubmit('sent')}>
          Valider l'avoir
        </Button>
      </div>
    </div>
  );
}
