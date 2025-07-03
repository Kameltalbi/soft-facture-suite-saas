import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Trash2, FileText, User, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { QuotePDF } from '@/components/pdf/quotes/QuotePDF';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useCurrency } from '@/contexts/CurrencyContext';

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  discount: number;
  total: number;
  productId?: string;
}

interface Client {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  unit: string | null;
  tax_rate?: number;
}

interface QuoteModalProps {
  open: boolean;
  onClose: () => void;
  quote?: any;
  onSave: (data: any) => void;
}

export function QuoteModal({ open, onClose, quote, onSave }: QuoteModalProps) {
  const { organization, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currency } = useCurrency();
  
  // State for clients and products
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form state - Générer un numéro unique basé sur timestamp
  const [quoteNumber, setQuoteNumber] = useState(quote?.number || `DEVIS-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`);
  const [quoteDate, setQuoteDate] = useState(quote?.date || new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState(quote?.validUntil || '');
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(quote?.client || null);
  const [subject, setSubject] = useState(quote?.subject || '');
  const [notes, setNotes] = useState(quote?.notes || '');
  const [conditions, setConditions] = useState(quote?.conditions || '');
  
  // Quote items
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>(quote?.items || [
    { id: '1', description: '', quantity: 1, unitPrice: 0, vatRate: 20, discount: 0, total: 0 }
  ]);
  
  // Product search inline
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Générer un numéro de devis unique
  const generateUniqueQuoteNumber = async () => {
    if (!organization?.id) return `DEVIS-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      const timestamp = Date.now() + attempts;
      const newNumber = `DEVIS-${new Date().getFullYear()}-${timestamp.toString().slice(-6)}`;
      
      // Vérifier si ce numéro existe déjà
      const { data: existingQuote } = await supabase
        .from('quotes')
        .select('id')
        .eq('organization_id', organization.id)
        .eq('quote_number', newNumber)
        .single();
      
      if (!existingQuote) {
        return newNumber;
      }
      
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 10)); // Petite pause
    }
    
    // Fallback avec timestamp complet
    return `DEVIS-${new Date().getFullYear()}-${Date.now()}`;
  };

  // Fetch clients from Supabase
  const fetchClients = async () => {
    if (!organization?.id) return;

    try {
      setClientsLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('organization_id', organization.id)
        .order('name');

      if (error) throw error;
      setClients(data || []);
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setClientsLoading(false);
    }
  };

  // Fetch products from Supabase
  const fetchProducts = async () => {
    if (!organization?.id) return;

    try {
      setProductsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, price, unit, tax_rate')
        .eq('organization_id', organization.id)
        .eq('active', true)
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setProductsLoading(false);
    }
  };

  // Load data when modal opens
  useEffect(() => {
    if (open && organization?.id) {
      fetchClients();
      fetchProducts();
      
      // Si c'est un nouveau devis, générer un numéro unique
      if (!quote) {
        generateUniqueQuoteNumber().then(newNumber => {
          setQuoteNumber(newNumber);
        });
      }
    }
  }, [open, organization?.id, quote]);
  
  
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(clientSearch.toLowerCase()))
  );

  // Fonction de nettoyage des timeouts
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Debug: afficher les produits chargés
  useEffect(() => {
    if (products.length > 0) {
      console.log('Produits chargés:', products.length, products);
    }
  }, [products]);
  
  const addQuoteItem = () => {
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: 20,
      discount: 0,
      total: 0
    };
    setQuoteItems([...quoteItems, newItem]);
  };
  
  const updateQuoteItem = (id: string, field: keyof QuoteItem, value: any) => {
    setQuoteItems(quoteItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice' || field === 'discount') {
          const subtotal = updated.quantity * updated.unitPrice;
          const discountAmount = subtotal * (updated.discount / 100);
          updated.total = subtotal - discountAmount;
        }
        return updated;
      }
      return item;
    }));
  };

  // Fonction de recherche de produits avec debounce améliorée
  const handleProductSearch = (itemId: string, searchTerm: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    setActiveItemId(itemId);
    
    if (searchTerm.length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        const filtered = products.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        console.log('Recherche produits:', searchTerm, 'Résultats:', filtered);
        setSearchSuggestions(filtered.slice(0, 5));
        setShowSuggestions(true);
      }, 300);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Sélectionner un produit depuis les suggestions
  const selectProduct = (itemId: string, product: Product) => {
    // Utiliser la TVA exacte du produit (même si c'est 0)
    const taxRate = product.tax_rate || 0;
    // Les prix sont stockés en unité de devise, pas de conversion
    const unitPrice = product.price;
    
    setQuoteItems(quoteItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          description: product.name,
          unitPrice: unitPrice,
          vatRate: taxRate,
          total: unitPrice,
          productId: product.id
        };
      }
      return item;
    }));
    setShowSuggestions(false);
    setActiveItemId(null);
    setSearchSuggestions([]);
  };
  
  const removeQuoteItem = (id: string) => {
    setQuoteItems(quoteItems.filter(item => item.id !== id));
  };
  
  const calculateTotals = () => {
    const subtotalHT = quoteItems.reduce((sum, item) => sum + item.total, 0);
    const totalDiscount = quoteItems.reduce((sum, item) => {
      const subtotal = item.quantity * item.unitPrice;
      return sum + (subtotal * item.discount / 100);
    }, 0);
    const totalVAT = quoteItems.reduce((sum, item) => sum + (item.total * item.vatRate / 100), 0);
    const totalTTC = subtotalHT + totalVAT;
    
    return { subtotalHT, totalDiscount, totalVAT, totalTTC };
  };
  
  const { subtotalHT, totalDiscount, totalVAT, totalTTC } = calculateTotals();
  
  // Set default validity (30 days from now)
  React.useEffect(() => {
    if (!validUntil) {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 30);
      setValidUntil(defaultDate.toISOString().split('T')[0]);
    }
  }, [validUntil]);
  
  const handleSave = async () => {
    if (!organization?.id || !selectedClient) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un client",
        variant: "destructive"
      });
      return;
    }

    if (quoteItems.length === 0 || quoteItems.every(item => !item.description.trim())) {
      toast({
        title: "Erreur",
        description: "Veuillez ajouter au moins un service",
        variant: "destructive"
      });
      return;
    }

    try {
      setSaving(true);

      // Si c'est un nouveau devis, s'assurer d'avoir un numéro unique
      let finalQuoteNumber = quoteNumber;
      if (!quote) {
        finalQuoteNumber = await generateUniqueQuoteNumber();
        setQuoteNumber(finalQuoteNumber);
      }

      console.log('Saving quote with number:', finalQuoteNumber);

      // Save quote to database
      const { data: savedQuote, error: quoteError } = await supabase
        .from('quotes')
        .insert({
          quote_number: finalQuoteNumber,
          date: quoteDate,
          valid_until: validUntil,
          client_id: selectedClient.id,
          organization_id: organization.id,
          status: 'draft',
          notes,
          subtotal: subtotalHT,
          tax_amount: totalVAT,
          total_amount: totalTTC
        })
        .select()
        .single();

      if (quoteError) {
        console.error('Quote save error:', quoteError);
        throw quoteError;
      }

      // Save quote items
      const quoteItemsToSave = quoteItems
        .filter(item => item.description.trim())
        .map(item => ({
          quote_id: savedQuote.id,
          organization_id: organization.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          tax_rate: item.vatRate,
          total_price: item.total
        }));

      if (quoteItemsToSave.length > 0) {
        const { error: itemsError } = await supabase
          .from('quote_items')
          .insert(quoteItemsToSave);

        if (itemsError) {
          console.error('Quote items save error:', itemsError);
          throw itemsError;
        }
      }

      // Refresh quotes list
      queryClient.invalidateQueries({ queryKey: ['quotes'] });

      toast({
        title: "Succès",
        description: "Le devis a été créé avec succès"
      });

      const quoteData = {
        number: finalQuoteNumber,
        date: quoteDate,
        validUntil,
        client: selectedClient,
        subject,
        items: quoteItems,
        notes,
        conditions,
        totals: { subtotalHT, totalDiscount, totalVAT, totalTTC }
      };
      
      onSave(quoteData);
      onClose();
    } catch (error) {
      console.error('Error saving quote:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création du devis",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  

  // Prepare PDF data
  const pdfData = {
    number: quoteNumber,
    date: quoteDate,
    validUntil,
    notes,
    conditions
  };

  const companyData = {
    name: organization?.name || user?.user_metadata?.company_name || 'Mon Entreprise',
    address: organization?.address || user?.user_metadata?.company_address,
    email: organization?.email || user?.email,
    phone: organization?.phone || user?.user_metadata?.company_phone,
    logo_url: organization?.logo_url
  };

  const filteredItems = quoteItems.filter(item => item.description.trim());

  const formatCurrency = (amount: number) => {
    // Afficher toujours sans décimales comme demandé
    return amount.toLocaleString('fr-FR', { 
      style: 'currency', 
      currency: currency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-600">
            {quote ? 'Modifier le devis' : 'Nouveau devis'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header avec logo et infos organisation */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  {organization?.logo_url && (
                    <img src={organization.logo_url} alt="Logo" className="h-16 w-16 object-contain" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{organization?.name || user?.user_metadata?.company_name || 'Mon Entreprise'}</h3>
                    <p className="text-sm text-gray-600">{organization?.address || user?.user_metadata?.company_address}</p>
                    <p className="text-sm text-gray-600">{organization?.email || user?.email}</p>
                    <p className="text-sm text-gray-600">{organization?.phone || user?.user_metadata?.company_phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold text-purple-600">DEVIS</h2>
                  <div className="space-y-2 mt-2">
                    <div>
                      <Label htmlFor="quoteNumber">Numéro</Label>
                      <Input
                        id="quoteNumber"
                        value={quoteNumber}
                        onChange={(e) => setQuoteNumber(e.target.value)}
                        className="w-40"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quoteDate">Date</Label>
                      <Input
                        id="quoteDate"
                        type="date"
                        value={quoteDate}
                        onChange={(e) => setQuoteDate(e.target.value)}
                        className="w-40"
                      />
                    </div>
                    <div>
                      <Label htmlFor="validUntil">Valide jusqu'au</Label>
                      <Input
                        id="validUntil"
                        type="date"
                        value={validUntil}
                        onChange={(e) => setValidUntil(e.target.value)}
                        className="w-40"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Section Client */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Devis pour
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un client..."
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    className="pl-10"
                    disabled={clientsLoading}
                  />
                  {clientsLoading && <p className="text-sm text-gray-500 mt-2">Chargement des clients...</p>}
                </div>
                
                {clientSearch && !selectedClient && (
                  <div className="border rounded-lg max-h-48 overflow-y-auto">
                    {filteredClients.map((client) => (
                      <div
                        key={client.id}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                        onClick={() => {
                          setSelectedClient(client);
                          setClientSearch('');
                        }}
                      >
                        <div className="font-medium">{client.company || client.name}</div>
                        <div className="text-sm text-gray-600">{client.name}</div>
                        <div className="text-sm text-gray-500">{client.address}, {client.city}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                {selectedClient && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{selectedClient.company || selectedClient.name}</h4>
                        <p className="text-sm text-gray-600">{selectedClient.name}</p>
                        <p className="text-sm text-gray-600">{selectedClient.address}</p>
                        <p className="text-sm text-gray-600">{selectedClient.city} {selectedClient.postal_code}</p>
                        <p className="text-sm text-gray-600">{selectedClient.email}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedClient(null)}
                      >
                        Changer
                      </Button>
                    </div>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="subject">Objet du devis</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Objet du devis..."
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Table des services */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Services / Prestations
                </CardTitle>
                <Button onClick={addQuoteItem} size="sm" className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter une ligne
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[35%]">Description</TableHead>
                    <TableHead className="w-[12%] text-center">Quantité</TableHead>
                    <TableHead className="w-[12%] text-right">Prix unitaire HT</TableHead>
                    <TableHead className="w-[10%] text-center">Remise %</TableHead>
                    <TableHead className="w-[10%] text-center">TVA</TableHead>
                    <TableHead className="w-[12%] text-right">Total HT</TableHead>
                    <TableHead className="w-[5%]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quoteItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="relative">
                        <Input
                          value={item.description}
                          onChange={(e) => {
                            updateQuoteItem(item.id, 'description', e.target.value);
                            handleProductSearch(item.id, e.target.value);
                          }}
                          placeholder="Tapez pour rechercher un produit..."
                          onFocus={() => {
                            setActiveItemId(item.id);
                            if (item.description.length >= 2) {
                              handleProductSearch(item.id, item.description);
                            }
                          }}
                          onBlur={(e) => {
                            // Délai pour permettre le clic sur une suggestion
                            setTimeout(() => {
                              const currentTarget = e.currentTarget;
                              const activeElement = document.activeElement;
                              if (!currentTarget || !activeElement || !currentTarget.contains(activeElement)) {
                                setShowSuggestions(false);
                                setActiveItemId(null);
                              }
                            }, 200);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                              setShowSuggestions(false);
                              setActiveItemId(null);
                            }
                          }}
                        />
                        
                        {/* Suggestions dropdown */}
                        {showSuggestions && activeItemId === item.id && searchSuggestions.length > 0 && (
                          <div 
                            className="fixed bg-white border border-gray-300 rounded-md shadow-xl max-h-48 overflow-y-auto min-w-[400px]"
                            style={{
                              zIndex: 9999,
                              top: `${(document.activeElement as HTMLElement)?.getBoundingClientRect().bottom + window.scrollY + 4}px`,
                              left: `${(document.activeElement as HTMLElement)?.getBoundingClientRect().left + window.scrollX}px`,
                              width: `${(document.activeElement as HTMLElement)?.getBoundingClientRect().width}px`
                            }}
                          >
                            {searchSuggestions.map((product) => (
                              <div
                                key={product.id}
                                className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 flex justify-between items-start transition-colors"
                                onMouseDown={(e) => {
                                  e.preventDefault(); // Empêche le blur de l'input
                                  selectProduct(item.id, product);
                                }}
                              >
                                <div className="flex-1">
                                  <div className="font-medium text-sm text-gray-900">{product.name}</div>
                                  {product.description && (
                                    <div className="text-xs text-gray-500 mt-1">{product.description}</div>
                                  )}
                                  <div className="text-xs text-gray-400 mt-1">
                                    {product.unit && `Unité: ${product.unit}`}
                                  </div>
                                </div>
                                <div className="text-sm font-medium text-purple-600 ml-3">
                                  {formatCurrency(product.price)}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Message si aucun résultat */}
                        {showSuggestions && activeItemId === item.id && searchSuggestions.length === 0 && item.description.length >= 2 && (
                          <div className="absolute top-full left-0 right-0 z-[100] bg-white border border-gray-200 rounded-md shadow-lg p-3 text-center text-gray-500 text-sm mt-1">
                            Aucun produit trouvé pour "{item.description}"
                            <div className="mt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                  // Ici, vous pourriez ouvrir un modal de création de produit
                                  toast({
                                    title: "Créer un nouveau produit",
                                    description: "Fonctionnalité à venir",
                                  });
                                  setShowSuggestions(false);
                                }}
                              >
                                + Créer "{item.description}"
                              </Button>
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuoteItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="text-center"
                          min="0"
                          step="0.5"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateQuoteItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="text-right"
                          min="0"
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.discount}
                          onChange={(e) => updateQuoteItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                          className="text-center"
                          min="0"
                          max="100"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.vatRate}
                          onChange={(e) => updateQuoteItem(item.id, 'vatRate', parseFloat(e.target.value) || 0)}
                          className="text-center"
                          min="0"
                          max="100"
                        />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.total)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuoteItem(item.id)}
                          disabled={quoteItems.length === 1}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Section Totaux */}
          <div className="flex justify-end">
            <Card className="w-80">
              <CardHeader>
                <CardTitle>Totaux</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total HT:</span>
                    <span className="font-medium">{formatCurrency(subtotalHT + totalDiscount)}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Remise totale:</span>
                      <span className="font-medium">-{formatCurrency(totalDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Net HT:</span>
                    <span className="font-medium">{formatCurrency(subtotalHT)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVA:</span>
                    <span className="font-medium">{formatCurrency(totalVAT)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total TTC:</span>
                      <span className="text-purple-600">{formatCurrency(totalTTC)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Validité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Validité du devis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Ce devis est valable jusqu'au {validUntil ? new Date(validUntil).toLocaleDateString('fr-FR') : 'Non spécifiée'}</strong>
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Passé cette date, les prix et conditions pourront être révisés.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Conditions et Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Conditions particulières</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  placeholder="Conditions de réalisation, délais, modalités de paiement..."
                  className="w-full h-32 p-3 border rounded-md resize-none"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes additionnelles..."
                  className="w-full h-32 p-3 border rounded-md resize-none"
                />
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Annuler
            </Button>
            {selectedClient && filteredItems.length > 0 && (
              <PDFDownloadLink
                document={
                  <QuotePDF
                    quoteData={pdfData}
                    lineItems={filteredItems}
                    client={selectedClient}
                    company={companyData}
                    settings={{ showVat: true }}
                    currency={currency}
                  />
                }
                fileName={`${quoteNumber}.pdf`}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2"
              >
                {({ loading }) => (loading ? 'Génération...' : 'Télécharger PDF')}
              </PDFDownloadLink>
            )}
            <Button 
              onClick={handleSave} 
              className="bg-purple-600 hover:bg-purple-700"
              disabled={saving}
            >
              {saving ? 'Enregistrement...' : (quote ? 'Mettre à jour' : 'Créer le devis')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
