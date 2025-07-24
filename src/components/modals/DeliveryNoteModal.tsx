
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Trash2, Package, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useClients } from '@/hooks/useClients';
import { useProducts } from '@/hooks/useProducts';
import { useCurrency } from '@/contexts/CurrencyContext';
import { numberToWords } from '@/utils/numberToWords';

interface DeliveryItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  discount: number;
  total: number;
  productId?: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  unit: string | null;
  tax_rate?: number;
}

interface DeliveryNoteModalProps {
  open: boolean;
  onClose: () => void;
  deliveryNote?: any;
  onSave: (data: any) => void;
}

export function DeliveryNoteModal({ open, onClose, deliveryNote, onSave }: DeliveryNoteModalProps) {
  const { organization, user } = useAuth();
  const { clients, loading: clientsLoading } = useClients();
  const { products, loading: productsLoading } = useProducts();
  const { currency } = useCurrency();
  
  // Form state
  const [deliveryNumber, setDeliveryNumber] = useState(deliveryNote?.number || 'BL-2025-001');
  const [deliveryDate, setDeliveryDate] = useState(deliveryNote?.date || new Date().toISOString().split('T')[0]);
  
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState(deliveryNote?.client || null);
  const [notes, setNotes] = useState(deliveryNote?.notes || '');
  const [deliveryAddress, setDeliveryAddress] = useState(deliveryNote?.deliveryAddress || '');
  
  // Delivery items
  const [deliveryItems, setDeliveryItems] = useState<DeliveryItem[]>(deliveryNote?.items || [
    { id: '1', description: '', quantity: 1, unitPrice: 0, vatRate: 20, discount: 0, total: 0 }
  ]);
  
  // Product search inline
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fonction de nettoyage des timeouts
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);
  
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(clientSearch.toLowerCase()))
  );

  // Fonction de recherche de produits avec debounce
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
    setDeliveryItems(deliveryItems.map(item => {
      if (item.id === itemId) {
        const updated = {
          ...item,
          description: product.name,
          productId: product.id,
          unitPrice: product.price,
          vatRate: product.tax_rate || 20
        };
        updated.total = calculateItemTotal(updated);
        return updated;
      }
      return item;
    }));
    setShowSuggestions(false);
    setActiveItemId(null);
    setSearchSuggestions([]);
  };

  const formatAddress = (client: any) => {
    const parts = [];
    if (client.address) parts.push(client.address);
    if (client.postal_code && client.city) {
      parts.push(`${client.postal_code} ${client.city}`);
    } else if (client.city) {
      parts.push(client.city);
    }
    if (client.country && client.country !== 'France') parts.push(client.country);
    return parts.join('\n');
  };
  
  const addDeliveryItem = () => {
    const newItem: DeliveryItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: 20,
      discount: 0,
      total: 0
    };
    setDeliveryItems([...deliveryItems, newItem]);
  };
  
  const updateDeliveryItem = (id: string, field: keyof DeliveryItem, value: any) => {
    setDeliveryItems(deliveryItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        updated.total = calculateItemTotal(updated);
        return updated;
      }
      return item;
    }));
  };
  
  const removeDeliveryItem = (id: string) => {
    setDeliveryItems(deliveryItems.filter(item => item.id !== id));
  };
  
  const handleClientSelect = (client: any) => {
    setSelectedClient(client);
    setClientSearch('');
    // Automatically populate delivery address with client's formatted address
    const formattedAddress = formatAddress(client);
    setDeliveryAddress(formattedAddress);
  };
  
  // Calculations
  const calculateItemTotal = (item: DeliveryItem) => {
    const subtotal = item.quantity * item.unitPrice;
    const discountAmount = subtotal * (item.discount / 100);
    return subtotal - discountAmount;
  };

  const totalHT = deliveryItems.reduce((sum, item) => sum + item.total, 0);
  const totalVAT = deliveryItems.reduce((sum, item) => {
    const vatAmount = item.total * (item.vatRate / 100);
    return sum + vatAmount;
  }, 0);
  const totalTTC = totalHT + totalVAT;
  
  // Handle save as draft action
  const handleSaveAsDraft = () => {
    const deliveryData = {
      number: deliveryNumber,
      date: deliveryDate,
      client: selectedClient,
      deliveryAddress,
      items: deliveryItems,
      notes,
      status: 'pending'
    };
    onSave(deliveryData);
    onClose();
  };

  // Handle validate action (finalize delivery note)
  const handleValidate = () => {
    const deliveryData = {
      number: deliveryNumber,
      date: deliveryDate,
      client: selectedClient,
      deliveryAddress,
      items: deliveryItems,
      notes,
      status: 'sent'
    };
    onSave(deliveryData);
    onClose();
  };

  // Format currency display
  const formatCurrency = (amount: number) => {
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
          <DialogTitle className="text-2xl font-bold text-green-600">
            {deliveryNote ? 'Modifier le bon de livraison' : 'Nouveau bon de livraison'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header avec logo et infos organisation */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  {organization?.logo_url ? (
                    <img src={organization.logo_url} alt="Logo" className="h-16 w-16 object-contain" />
                  ) : (
                    <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{organization?.name || user?.user_metadata?.company_name || 'Mon Entreprise'}</h3>
                    <p className="text-sm text-gray-600">{organization?.address || user?.user_metadata?.company_address}</p>
                    <p className="text-sm text-gray-600">{organization?.email || user?.email}</p>
                    <p className="text-sm text-gray-600">{organization?.phone || user?.user_metadata?.company_phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold text-green-600">BON DE LIVRAISON</h2>
                  <div className="space-y-2 mt-2">
                    <div>
                      <Label htmlFor="deliveryNumber">Numéro</Label>
                      <Input
                        id="deliveryNumber"
                        value={deliveryNumber}
                        onChange={(e) => setDeliveryNumber(e.target.value)}
                        className="w-40"
                      />
                    </div>
                    <div>
                      <Label htmlFor="deliveryDate">Date</Label>
                      <Input
                        id="deliveryDate"
                        type="date"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
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
                Livrer à
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
                  />
                  {clientsLoading && (
                    <div className="absolute right-3 top-3 text-sm text-gray-400">
                      Chargement...
                    </div>
                  )}
                </div>
                
                {clientSearch && !selectedClient && filteredClients.length > 0 && (
                  <div className="border rounded-lg max-h-48 overflow-y-auto bg-white z-10">
                    {filteredClients.map((client) => (
                      <div
                        key={client.id}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                        onClick={() => handleClientSelect(client)}
                      >
                        <div className="font-medium">{client.company || client.name}</div>
                        {client.company && client.name !== client.company && (
                          <div className="text-sm text-gray-600">{client.name}</div>
                        )}
                        {client.email && (
                          <div className="text-sm text-gray-500">{client.email}</div>
                        )}
                        {formatAddress(client) && (
                          <div className="text-xs text-gray-400 mt-1 whitespace-pre-line">
                            {formatAddress(client)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {clientSearch && !selectedClient && filteredClients.length === 0 && !clientsLoading && (
                  <div className="text-sm text-gray-500 p-2">
                    Aucun client trouvé. Vous pouvez créer un nouveau client dans la section Clients.
                  </div>
                )}
                
                {selectedClient && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-green-800">
                          {selectedClient.company || selectedClient.name}
                        </h4>
                        {selectedClient.company && selectedClient.name !== selectedClient.company && (
                          <p className="text-sm text-green-700">{selectedClient.name}</p>
                        )}
                        {selectedClient.email && (
                          <p className="text-sm text-green-600">{selectedClient.email}</p>
                        )}
                        {selectedClient.phone && (
                          <p className="text-sm text-green-600">{selectedClient.phone}</p>
                        )}
                        {formatAddress(selectedClient) && (
                          <div className="text-sm text-green-600 mt-2 whitespace-pre-line">
                            <strong>Adresse :</strong><br />
                            {formatAddress(selectedClient)}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedClient(null);
                          setDeliveryAddress('');
                        }}
                        className="text-green-700 hover:text-green-800"
                      >
                        Changer
                      </Button>
                    </div>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="deliveryAddress">Adresse de livraison</Label>
                  <textarea
                    id="deliveryAddress"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Adresse de livraison (sera remplie automatiquement lors de la sélection du client)..."
                    className="w-full h-20 p-3 border rounded-md resize-none mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    L'adresse sera automatiquement remplie avec l'adresse du client sélectionné
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Table des articles */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Articles à livrer
                </CardTitle>
                <Button onClick={addDeliveryItem} size="sm" className="bg-green-600 hover:bg-green-700">
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
                  {deliveryItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="relative">
                        <Input
                          value={item.description}
                          onChange={(e) => {
                            updateDeliveryItem(item.id, 'description', e.target.value);
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
                                className="p-3 hover:bg-green-50 cursor-pointer border-b last:border-b-0 flex justify-between items-start transition-colors"
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
                                <div className="text-sm font-medium text-green-600 ml-3">
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
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateDeliveryItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          className="text-center"
                          min="0"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateDeliveryItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="text-right"
                          min="0"
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.discount}
                          onChange={(e) => updateDeliveryItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                          className="text-center"
                          min="0"
                          max="100"
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.vatRate}
                          onChange={(e) => updateDeliveryItem(item.id, 'vatRate', parseFloat(e.target.value) || 0)}
                          className="text-center"
                          min="0"
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.total)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDeliveryItem(item.id)}
                          disabled={deliveryItems.length === 1}
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

          {/* Totaux */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div></div>
            <Card>
              <CardHeader>
                <CardTitle>Totaux</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Total HT:</span>
                  <span className="font-medium">{formatCurrency(totalHT)}</span>
                </div>
                <div className="flex justify-between">
                  <span>TVA:</span>
                  <span className="font-medium">{formatCurrency(totalVAT)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total TTC:</span>
                    <span className="text-green-600">{formatCurrency(totalTTC)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Montant en lettres */}
          {totalTTC > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Montant en lettres</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium text-green-700 italic">
                  {numberToWords(Math.round(totalTTC))} euros
                </p>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes de livraison..."
                className="w-full h-24 p-3 border rounded-md resize-none"
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button variant="ghost" onClick={handleSaveAsDraft}>
              Enregistrer (comme brouillon)
            </Button>
            <Button onClick={handleValidate} className="bg-green-600 hover:bg-green-700">
              Valider (générer le bon de livraison)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
