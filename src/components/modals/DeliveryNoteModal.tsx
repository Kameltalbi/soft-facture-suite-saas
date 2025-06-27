
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Trash2, Package, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface DeliveryItem {
  id: string;
  description: string;
  quantity: number;
  deliveredQuantity?: number;
  status: 'pending' | 'delivered' | 'partial';
}

interface DeliveryNoteModalProps {
  open: boolean;
  onClose: () => void;
  deliveryNote?: any;
  onSave: (data: any) => void;
}

export function DeliveryNoteModal({ open, onClose, deliveryNote, onSave }: DeliveryNoteModalProps) {
  const { organization, user } = useAuth();
  
  // Form state
  const [deliveryNumber, setDeliveryNumber] = useState(deliveryNote?.number || 'BL-2025-001');
  const [deliveryDate, setDeliveryDate] = useState(deliveryNote?.date || new Date().toISOString().split('T')[0]);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(deliveryNote?.expectedDeliveryDate || '');
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState(deliveryNote?.client || null);
  const [notes, setNotes] = useState(deliveryNote?.notes || '');
  const [deliveryAddress, setDeliveryAddress] = useState(deliveryNote?.deliveryAddress || '');
  
  // Delivery items
  const [deliveryItems, setDeliveryItems] = useState<DeliveryItem[]>(deliveryNote?.items || [
    { id: '1', description: '', quantity: 1, deliveredQuantity: 0, status: 'pending' }
  ]);
  
  // Product search
  const [productSearch, setProductSearch] = useState('');
  
  // Mock clients for search
  const mockClients = [
    { id: '1', name: 'Client Premium', company: 'Premium Corp', address: '123 Rue de la Paix, 75001 Paris', email: 'contact@premium.fr' },
    { id: '2', name: 'Entreprise ABC', company: 'ABC Solutions', address: '456 Avenue République, 69000 Lyon', email: 'info@abc.fr' },
    { id: '3', name: 'Société Tech', company: 'Tech Innovation', address: '789 Boulevard Tech, 31000 Toulouse', email: 'hello@tech.fr' }
  ];
  
  // Mock products for search
  const mockProducts = [
    { id: '1', name: 'Ordinateur portable', unit: 'pièce' },
    { id: '2', name: 'Écran 24 pouces', unit: 'pièce' },
    { id: '3', name: 'Clavier sans fil', unit: 'pièce' },
    { id: '4', name: 'Souris optique', unit: 'pièce' }
  ];
  
  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.company.toLowerCase().includes(clientSearch.toLowerCase())
  );
  
  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );
  
  const addDeliveryItem = () => {
    const newItem: DeliveryItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      deliveredQuantity: 0,
      status: 'pending'
    };
    setDeliveryItems([...deliveryItems, newItem]);
  };
  
  const updateDeliveryItem = (id: string, field: keyof DeliveryItem, value: any) => {
    setDeliveryItems(deliveryItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        // Update status based on delivered quantity
        if (field === 'deliveredQuantity' || field === 'quantity') {
          const delivered = field === 'deliveredQuantity' ? value : item.deliveredQuantity || 0;
          const total = field === 'quantity' ? value : item.quantity;
          if (delivered === 0) {
            updated.status = 'pending';
          } else if (delivered >= total) {
            updated.status = 'delivered';
          } else {
            updated.status = 'partial';
          }
        }
        return updated;
      }
      return item;
    }));
  };
  
  const removeDeliveryItem = (id: string) => {
    setDeliveryItems(deliveryItems.filter(item => item.id !== id));
  };
  
  const getStatusBadge = (status: DeliveryItem['status']) => {
    const variants = {
      pending: { label: 'En attente', variant: 'secondary' as const },
      delivered: { label: 'Livré', variant: 'default' as const },
      partial: { label: 'Partiel', variant: 'outline' as const }
    };
    return (
      <Badge variant={variants[status].variant}>
        {variants[status].label}
      </Badge>
    );
  };
  
  const handleSave = () => {
    const deliveryData = {
      number: deliveryNumber,
      date: deliveryDate,
      expectedDeliveryDate,
      client: selectedClient,
      deliveryAddress,
      items: deliveryItems,
      notes
    };
    onSave(deliveryData);
    onClose();
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
                    <div>
                      <Label htmlFor="expectedDeliveryDate">Livraison prévue</Label>
                      <Input
                        id="expectedDeliveryDate"
                        type="date"
                        value={expectedDeliveryDate}
                        onChange={(e) => setExpectedDeliveryDate(e.target.value)}
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
                          setDeliveryAddress(client.address);
                        }}
                      >
                        <div className="font-medium">{client.company}</div>
                        <div className="text-sm text-gray-600">{client.name}</div>
                        <div className="text-sm text-gray-500">{client.address}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                {selectedClient && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{selectedClient.company}</h4>
                        <p className="text-sm text-gray-600">{selectedClient.name}</p>
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
                  <Label htmlFor="deliveryAddress">Adresse de livraison</Label>
                  <textarea
                    id="deliveryAddress"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Adresse de livraison..."
                    className="w-full h-20 p-3 border rounded-md resize-none mt-1"
                  />
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
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher un produit..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button onClick={addDeliveryItem} size="sm" className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {productSearch && (
                <div className="mb-4 border rounded-lg max-h-32 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="p-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex justify-between"
                      onClick={() => {
                        const newItem: DeliveryItem = {
                          id: Date.now().toString(),
                          description: product.name,
                          quantity: 1,
                          deliveredQuantity: 0,
                          status: 'pending'
                        };
                        setDeliveryItems([...deliveryItems, newItem]);
                        setProductSearch('');
                      }}
                    >
                      <span>{product.name}</span>
                      <span className="text-sm text-gray-500">{product.unit}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Description</TableHead>
                    <TableHead className="w-[15%] text-center">Qté commandée</TableHead>
                    <TableHead className="w-[15%] text-center">Qté livrée</TableHead>
                    <TableHead className="w-[15%] text-center">Statut</TableHead>
                    <TableHead className="w-[10%] text-center">État</TableHead>
                    <TableHead className="w-[5%]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveryItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Input
                          value={item.description}
                          onChange={(e) => updateDeliveryItem(item.id, 'description', e.target.value)}
                          placeholder="Description de l'article"
                        />
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
                          value={item.deliveredQuantity || 0}
                          onChange={(e) => updateDeliveryItem(item.id, 'deliveredQuantity', parseInt(e.target.value) || 0)}
                          className="text-center"
                          min="0"
                          max={item.quantity}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm">
                          {item.deliveredQuantity || 0}/{item.quantity}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(item.status)}
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

          {/* Section signatures (pour impression) */}
          <Card>
            <CardHeader>
              <CardTitle>Signatures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <Label className="font-medium">Signature du livreur :</Label>
                  <div className="h-20 border-2 border-dashed border-gray-300 rounded-lg mt-2 flex items-center justify-center text-gray-500">
                    Zone de signature
                  </div>
                </div>
                <div>
                  <Label className="font-medium">Signature du client :</Label>
                  <div className="h-20 border-2 border-dashed border-gray-300 rounded-lg mt-2 flex items-center justify-center text-gray-500">
                    Zone de signature
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              {deliveryNote ? 'Mettre à jour' : 'Créer le bon de livraison'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
