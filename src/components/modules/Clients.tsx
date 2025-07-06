
import { useState } from 'react';
import { ClientModal } from '@/components/modals/ClientModal';
import { ClientsHeader } from './Clients/ClientsHeader';
import { ClientStats } from './Clients/ClientStats';
import { ClientsTable } from './Clients/ClientsTable';
import { useClients } from '@/hooks/useClients';
import { useToast } from '@/hooks/use-toast';
import { ImportClientsModal } from '@/components/modals/ImportClientsModal';

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const { clients, loading, deleteClient, fetchClients } = useClients();
  const { toast } = useToast();

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = () => {
    setEditingClient(null);
    setShowModal(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setShowModal(true);
  };

  const handleDeleteClient = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      await deleteClient(id);
    }
  };

  const handleViewClient = (client) => {
    console.log('Viewing client:', client);
  };

  const handleImportClients = () => {
    setShowImportModal(true);
  };

  const handleExportClients = () => {
    if (clients.length === 0) {
      toast({
        title: "Aucun client à exporter",
        description: "Vous n'avez aucun client dans votre base de données",
        variant: "destructive"
      });
      return;
    }

    // Créer le CSV
    const headers = ['name', 'email', 'phone', 'company', 'address', 'city', 'postal_code', 'country', 'vat_number', 'payment_terms'];
    const csvContent = [
      headers.join(','),
      ...clients.map(client => [
        `"${client.name || ''}"`,
        `"${client.email || ''}"`,
        `"${client.phone || ''}"`,
        `"${client.company || ''}"`,
        `"${client.address || ''}"`,
        `"${client.city || ''}"`,
        `"${client.postal_code || ''}"`,
        `"${client.country || 'France'}"`,
        `"${client.vat_number || ''}"`,
        `"${client.payment_terms || 30}"`
      ].join(','))
    ].join('\n');

    // Télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clients_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export réussi",
      description: `${clients.length} client(s) exporté(s) avec succès`
    });
  };

  const handleImportComplete = () => {
    fetchClients();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement des clients...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-[#F7F9FA] min-h-screen">
      <ClientsHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClient={handleAddClient}
        onImportClients={handleImportClients}
        onExportClients={handleExportClients}
      />

      <ClientStats clients={clients} />

      <ClientsTable
        clients={filteredClients.length === 0 && clients.length > 0 ? [] : filteredClients}
        onViewClient={handleViewClient}
        onEditClient={handleEditClient}
        onDeleteClient={handleDeleteClient}
      />

      <ClientModal
        open={showModal}
        onClose={() => setShowModal(false)}
        client={editingClient}
      />

      <ImportClientsModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportComplete={handleImportComplete}
      />
    </div>
  );
};

export default Clients;
