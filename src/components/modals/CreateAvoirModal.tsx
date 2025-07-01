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
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
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
  date: string;
  total: number;
  items: LineItem[];
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
  const [number, setNumber] = useState(`AV-2024-${String(Date.now()).slice(-3)}`);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [customItems, setCustomItems] = useState<LineItem[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<string[]>([]);
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
          clients(name),
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
        .select('name')
        .eq('organization_id', profile.organization_id)
        .eq('status', 'active')
        .order('name');

      if (clientsError) {
        console.error('Erreur lors du chargement des clients:', clientsError);
      } else if (clientsData) {
        setClients(clientsData.map(client => client.name));
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
      setLineItems([...invoice.items]);
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

  const calculateTotals = () => {
    const items = type === 'facture_liee' ? lineItems : customItems;
    const subtotalHT = items.reduce((sum, item) => sum + item.total, 0);
    const totalVAT = items.reduce((sum, item) => {
      return sum + (item.total * item.vatRate / 100);
    }, 0);
    const totalTTC = subtotalHT + totalVAT;

    return { subtotalHT, totalVAT, totalTTC };
  };

  const handleSubmit = (status: 'brouillon' | 'valide') => {
    if (type === 'facture_liee' && !selectedInvoice) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une facture.",
        variant: "destructive",
      });
      return;
    }

    if (type === 'economique' && !selectedClient) {
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
      invoiceNumber: selectedInvoice?.number,
      amount: -Math.abs(total), // Toujours négatif pour un avoir
      status,
      items: type === 'facture_liee' ? lineItems : customItems
    };

    onSave(avoirData);
    toast({
      title: "Avoir créé",
      description: `L'avoir ${number} a été ${status === 'brouillon' ? 'sauvegardé' : 'validé'} avec succès.`,
    });
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-FR', { 
      style: 'currency', 
      currency: currency.code 
    });
  };

  const { subtotalHT, totalVAT, totalTTC } = calculateTotals();

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
    <div className="max-w-4xl mx-auto bg-white">
      {/* Header - Style PDF avec rouge */}
      <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-red-600">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-red-600 mb-4">AVOIR</h1>
          <div className="space-y-1 text-sm text-gray-600">
            <p className="font-semibold">Soft Facture</p>
            <p>456 Avenue de la République, 69000 Lyon</p>
            <p>contact@softfacture.fr</p>
            <p>04 72 00 00 00</p>
          </div>
        </div>
      </div>

      {/* Document Info - Style PDF */}
      <div className="flex justify-between mb-8 bg-gray-50 p-6 rounded-lg">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-red-600 mb-3 uppercase">AVOIR ÉMIS POUR :</h3>
          <div className="space-y-2">
            <div className="space-y-2">
              <Label>Type d'avoir</Label>
              <Tabs value={type} onValueChange={(value) => setType(value as 'facture_liee' | 'economique')} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="facture_liee">Facture liée</TabsTrigger>
                  <TabsTrigger value="economique">Économique</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {type === 'facture_liee' ? (
              <div className="space-y-2">
                <Label>Facture à créditer</Label>
                {invoices.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    <p>Aucune facture payée trouvée</p>
                  </div>
                ) : (
                  <Select onValueChange={handleInvoiceSelection}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une facture" />
                    </SelectTrigger>
                    <SelectContent>
                      {invoices.map((invoice) => (
                        <SelectItem key={invoice.id} value={invoice.id}>
                          {invoice.number} - {invoice.clientName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Client</Label>
                {clients.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    <p>Aucun client trouvé</p>
                  </div>
                ) : (
                  <Select onValueChange={setSelectedClient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client} value={client}>
                          {client}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            {selectedClient && (
              <div className="mt-4 p-3 bg-white border rounded">
                <p className="font-medium">{selectedClient}</p>
                <p className="text-sm text-gray-600">123 Rue de l'Exemple, 75001 Paris</p>
                <p className="text-sm text-gray-600">contact@example.com</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded border border-gray-200 min-w-[200px]">
          <div className="space-y-2 text-sm">
            <div>
              <Label htmlFor="number" className="text-xs">Avoir N°</Label>
              <Input
                id="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="date" className="text-xs">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <p className="text-xs font-medium">Type : {type === 'facture_liee' ? 'Facture liée' : 'Économique'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Facture de référence */}
      {type === 'facture_liee' && selectedInvoice && (
        <div className="mb-6 p-4 bg-gray-100 border-l-4 border-gray-600 rounded">
          <p className="font-bold text-sm mb-2">Facture de référence :</p>
          <p className="text-sm">Facture N° {selectedInvoice.number}</p>
        </div>
      )}

      {/* Table des articles - Style PDF */}
      <div className="mb-6">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-red-600 text-white p-3">
            <div className="grid grid-cols-12 gap-4 font-bold text-sm">
              <div className="col-span-6">Description</div>
              <div className="col-span-1 text-center">Qté</div>
              <div className="col-span-2 text-right">Prix unit.</div>
              <div className="col-span-1 text-center">TVA</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {type === 'facture_liee' && lineItems.length > 0 && (
              <>
                {lineItems.map((item) => {
                  const originalItem = selectedInvoice?.items.find(i => i.id === item.id);
                  return (
                    <div key={item.id} className="p-3 hover:bg-gray-50">
                      <div className="grid grid-cols-12 gap-4 items-center text-sm">
                        <div className="col-span-6">
                          <p className="font-medium">{item.description}</p>
                          {originalItem && (
                            <p className="text-xs text-gray-500">
                              Qté orig.: <Badge variant="outline">{originalItem.quantity}</Badge>
                            </p>
                          )}
                        </div>
                        <div className="col-span-1 text-center">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateLineItemQuantity(item.id, parseInt(e.target.value) || 0)}
                            min="0"
                            max={originalItem?.quantity || 0}
                            className="w-16 text-center"
                          />
                        </div>
                        <div className="col-span-2 text-right">
                          -{formatCurrency(item.unitPrice)}
                        </div>
                        <div className="col-span-1 text-center">
                          {item.vatRate}%
                        </div>
                        <div className="col-span-2 text-right font-medium">
                          -{formatCurrency(item.total)}
                        </div>
                      </div>
                      <div className="mt-2 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLineItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {type === 'economique' && (
              <>
                {customItems.map((item) => (
                  <div key={item.id} className="p-3">
                    <div className="grid grid-cols-12 gap-4 items-center text-sm">
                      <div className="col-span-6">
                        <Input
                          value={item.description}
                          onChange={(e) => updateCustomItem(item.id, 'description', e.target.value)}
                          placeholder="Description de l'avoir..."
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateCustomItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          min="1"
                          className="w-16 text-center"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateCustomItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          step="0.01"
                          min="0"
                          className="text-right"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        <Select
                          value={item.vatRate.toString()}
                          onValueChange={(value) => updateCustomItem(item.id, 'vatRate', parseInt(value))}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">0%</SelectItem>
                            <SelectItem value="5.5">5.5%</SelectItem>
                            <SelectItem value="10">10%</SelectItem>
                            <SelectItem value="20">20%</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 text-right font-medium">
                        -{formatCurrency(item.total)}
                      </div>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="p-3 border-t bg-gray-50">
                  <Button onClick={addCustomItem} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une ligne
                  </Button>
                </div>
              </>
            )}

            {((type === 'facture_liee' && lineItems.length === 0) || (type === 'economique' && customItems.length === 0)) && (
              <div className="p-8 text-center text-gray-500">
                <p>Aucune ligne ajoutée</p>
                <p className="text-sm">
                  {type === 'facture_liee' 
                    ? 'Sélectionnez une facture pour voir les lignes'
                    : 'Cliquez sur "Ajouter une ligne" pour commencer'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Totaux - Style PDF */}
      <div className="flex justify-end mb-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 min-w-[300px]">
          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-sm">Sous-total HT :</span>
              <span className="text-sm font-medium">-{formatCurrency(subtotalHT)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-sm">TVA :</span>
              <span className="text-sm font-medium">-{formatCurrency(totalVAT)}</span>
            </div>
            <div className="flex justify-between py-2 border-t-2 border-red-600 bg-red-600 text-white px-3 rounded">
              <span className="font-bold">TOTAL AVOIR TTC :</span>
              <span className="font-bold">-{formatCurrency(totalTTC)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes - Style PDF */}
      <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 rounded">
        <div className="space-y-2">
          <Label className="font-bold text-red-800">Motif de l'avoir :</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Motif de l'avoir, explications..."
            rows={3}
            className="bg-white"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button variant="outline" onClick={() => handleSubmit('brouillon')}>
          Enregistrer brouillon
        </Button>
        <Button onClick={() => handleSubmit('valide')} className="bg-red-600 hover:bg-red-700">
          Valider l'avoir
        </Button>
      </div>
    </div>
  );
}
