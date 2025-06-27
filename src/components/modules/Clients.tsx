
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Mail, Phone, MapPin, User } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ClientModal } from '@/components/modals/ClientModal';

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  vatNumber?: string;
  paymentTerms: number;
  totalInvoiced: number;
  status: 'active' | 'inactive';
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    company: 'Entreprise ABC',
    email: 'jean.dupont@abc.com',
    phone: '+33 1 23 45 67 89',
    address: '123 rue de la Paix',
    city: 'Paris',
    postalCode: '75001',
    country: 'France',
    vatNumber: 'FR12345678901',
    paymentTerms: 30,
    totalInvoiced: 15750.00,
    status: 'active'
  },
  {
    id: '2',
    name: 'Marie Martin',
    company: 'Société XYZ',
    email: 'marie.martin@xyz.fr',
    phone: '+33 2 34 56 78 90',
    address: '456 avenue du Commerce',
    city: 'Lyon',
    postalCode: '69000',
    country: 'France',
    paymentTerms: 15,
    totalInvoiced: 8420.00,
    status: 'active'
  },
  {
    id: '3',
    name: 'Pierre Durand',
    company: 'Client Premium',
    email: 'pierre@premium.com',
    phone: '+33 3 45 67 89 01',
    address: '789 boulevard des Affaires',
    city: 'Marseille',
    postalCode: '13000',
    country: 'France',
    vatNumber: 'FR98765432109',
    paymentTerms: 45,
    totalInvoiced: 32100.00,
    status: 'active'
  },
  {
    id: '4',
    name: 'Sophie Leroy',
    company: 'Startup Innovation',
    email: 'sophie@startup.io',
    phone: '+33 4 56 78 90 12',
    address: '321 rue de l\'Innovation',
    city: 'Toulouse',
    postalCode: '31000',
    country: 'France',
    paymentTerms: 30,
    totalInvoiced: 2850.00,
    status: 'inactive'
  }
];

export function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewClient = () => {
    setEditingClient(null);
    setShowClientModal(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setShowClientModal(true);
  };

  const stats = {
    totalClients: mockClients.length,
    activeClients: mockClients.filter(c => c.status === 'active').length,
    totalInvoiced: mockClients.reduce((sum, c) => sum + c.totalInvoiced, 0),
    averageInvoice: mockClients.reduce((sum, c) => sum + c.totalInvoiced, 0) / mockClients.length
  };

  return (
    <div className="p-6 space-y-6 bg-neutral-50 min-h-screen">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
          <Input
            placeholder="Rechercher un client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-neutral-200"
          />
        </div>

        <Button 
          onClick={handleNewClient}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus size={16} className="mr-2" />
          Nouveau Client
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total clients</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.totalClients}</p>
              </div>
              <User className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Clients actifs</p>
                <p className="text-2xl font-bold text-success">{stats.activeClients}</p>
              </div>
              <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                <span className="text-success font-bold">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">CA total</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {stats.totalInvoiced.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                    maximumFractionDigits: 0
                  })}
                </p>
              </div>
              <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                <span className="text-secondary font-bold">€</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">CA moyen</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {stats.averageInvoice.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                    maximumFractionDigits: 0
                  })}
                </p>
              </div>
              <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
                <span className="text-neutral-600 font-bold">~</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des clients</CardTitle>
          <CardDescription>
            Gérez vos clients et leurs informations de facturation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead>Conditions</TableHead>
                <TableHead>CA total</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id} className="hover:bg-neutral-50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-neutral-900">{client.name}</div>
                      <div className="text-sm text-neutral-500">{client.company}</div>
                      {client.vatNumber && (
                        <div className="text-xs text-neutral-400">TVA: {client.vatNumber}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail size={12} className="mr-1 text-neutral-400" />
                        {client.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone size={12} className="mr-1 text-neutral-400" />
                        {client.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start text-sm">
                      <MapPin size={12} className="mr-1 text-neutral-400 mt-0.5 shrink-0" />
                      <div>
                        <div>{client.address}</div>
                        <div>{client.postalCode} {client.city}</div>
                        <div className="text-neutral-500">{client.country}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {client.paymentTerms} jours
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {client.totalInvoiced.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                      {client.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClient(client)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Client Modal */}
      <ClientModal
        open={showClientModal}
        onClose={() => setShowClientModal(false)}
        client={editingClient}
      />
    </div>
  );
}
