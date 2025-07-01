
import { useState } from 'react';
import { ClientModal } from '@/components/modals/ClientModal';
import { ClientsHeader } from './Clients/ClientsHeader';
import { ClientStats } from './Clients/ClientStats';
import { ClientsTable } from './Clients/ClientsTable';
import { useClients } from '@/hooks/useClients';

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const { clients, loading, deleteClient } = useClients();

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
    </div>
  );
};

export default Clients;
