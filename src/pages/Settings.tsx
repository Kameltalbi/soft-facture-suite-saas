import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { OrganizationSettings } from '@/components/settings/OrganizationSettings';
import { CurrencySettings } from '@/components/settings/CurrencySettings';
import { FooterSettings } from '@/components/settings/FooterSettings';
import { NumberingSettings } from '@/components/settings/NumberingSettings';
import { UserManagement } from '@/components/settings/UserManagement';
import { RolePermissions } from '@/components/settings/RolePermissions';
import { PdfTemplateSettings } from '@/components/settings/PdfTemplateSettings';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  Organization,
  Currency,
  GlobalSettings,
  DocumentNumbering,
  User,
  Role,
  Permission
} from '@/types/settings';

// Mock data for features not yet implemented with real data
const mockCurrencies: Currency[] = [
  { id: '1', code: 'TND', symbol: 'د.ت', name: 'Dinar Tunisien', is_primary: true, tenant_id: 'tenant1' },
  { id: '2', code: 'EUR', symbol: '€', name: 'Euro', is_primary: false, tenant_id: 'tenant1' },
];

const mockNumberings: DocumentNumbering[] = [
  { id: '1', document_type: 'invoice', prefix: 'FACT-', format: 'incremental', next_number: 1001, reset_frequency: 'yearly', tenant_id: 'tenant1' },
  { id: '2', document_type: 'quote', prefix: 'DEVIS-', format: 'incremental', next_number: 2001, reset_frequency: 'yearly', tenant_id: 'tenant1' },
  { id: '3', document_type: 'delivery_note', prefix: 'BON-', format: 'incremental', next_number: 3001, reset_frequency: 'yearly', tenant_id: 'tenant1' },
  { id: '4', document_type: 'credit', prefix: 'AVOIR-', format: 'incremental', next_number: 4001, reset_frequency: 'yearly', tenant_id: 'tenant1' },
];

const mockUsers: User[] = [
  { id: '1', email: 'admin@softfacture.tn', full_name: 'Admin Principal', role: 'Administrateur', status: 'active', created_at: '2024-01-01T00:00:00Z', tenant_id: 'tenant1' },
  { id: '2', email: 'comptable@softfacture.tn', full_name: 'Marie Dubois', role: 'Comptable', status: 'active', created_at: '2024-01-15T00:00:00Z', tenant_id: 'tenant1' },
  { id: '3', email: 'commercial@softfacture.tn', full_name: 'Ahmed Ben Ali', role: 'Commercial', status: 'pending', created_at: '2024-02-01T00:00:00Z', tenant_id: 'tenant1' },
];

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Administrateur',
    permissions: {
      dashboard: { read: true, write: true, delete: false },
      invoices: { read: true, write: true, delete: true },
      quotes: { read: true, write: true, delete: true },
    },
    tenant_id: 'tenant1'
  },
  {
    id: '2',
    name: 'Comptable',
    permissions: {
      dashboard: { read: true, write: false, delete: false },
      invoices: { read: true, write: true, delete: false },
      quotes: { read: true, write: false, delete: false },
    },
    tenant_id: 'tenant1'
  }
];

const mockGlobalSettings: GlobalSettings = {
  id: '1',
  footer_content: 'Soft Facture SARL - 123 Avenue Habib Bourguiba, 1000 Tunis\nTél: +216 71 123 456 - Email: contact@softfacture.tn\nRIB: 12345678901234567890 - IBAN: TN59 1234 5678 9012 3456 7890',
  footer_display: 'all',
  primary_currency: 'TND',
  invoice_template: 'classic',
  quote_template: 'classic',
  delivery_note_template: 'classic',
  credit_template: 'classic',
  tenant_id: 'tenant1'
};

export default function Settings() {
  const { toast } = useToast();
  const { organization, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('organization');
  const [organizationData, setOrganizationData] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  // State management for mock data
  const [currencies] = useState(mockCurrencies);
  const [numberings] = useState(mockNumberings);
  const [users] = useState(mockUsers);
  const [roles] = useState(mockRoles);
  const [globalSettings] = useState(mockGlobalSettings);

  useEffect(() => {
    if (organization) {
      // Convert the organization from useAuth to the expected format
      const convertedOrg: Organization = {
        id: organization.id,
        name: organization.name,
        address: organization.address || '',
        email: organization.email || '',
        phone: organization.phone || '',
        website: organization.website || '',
        rib: '', // These fields might need to be added to the organizations table
        iban: '',
        swift: '',
        bank: '',
        siret: '',
        fiscal_id: '',
        vat_code: organization.vat_number || '',
        logo: organization.logo_url || undefined,
        tenant_id: organization.id // Using organization id as tenant_id
      };
      setOrganizationData(convertedOrg);
    }
    setLoading(false);
  }, [organization]);

  const handleSaveOrganization = async (data: Partial<Organization>) => {
    if (!profile?.organization_id) {
      toast({
        title: 'Erreur',
        description: 'Impossible de trouver l\'organisation',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          name: data.name,
          address: data.address,
          email: data.email,
          phone: data.phone,
          website: data.website,
          vat_number: data.vat_code,
        })
        .eq('id', profile.organization_id);

      if (error) throw error;

      // Update local state
      if (organizationData) {
        setOrganizationData({ ...organizationData, ...data });
      }

      toast({
        title: 'Succès',
        description: 'Informations de l\'organisation mises à jour avec succès.',
      });
    } catch (error) {
      console.error('Error updating organization:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la mise à jour des informations.',
        variant: 'destructive',
      });
    }
  };

  const handleAddCurrency = (currency: Omit<Currency, 'id' | 'tenant_id'>) => {
    console.log('Adding currency:', currency);
    toast({
      title: 'Succès',
      description: 'Devise ajoutée avec succès.',
    });
  };

  const handleSetPrimaryCurrency = (currencyId: string) => {
    console.log('Setting primary currency:', currencyId);
    toast({
      title: 'Succès',
      description: 'Devise principale mise à jour.',
    });
  };

  const handleSaveGlobalSettings = (data: Partial<GlobalSettings>) => {
    console.log('Saving global settings:', data);
    toast({
      title: 'Succès',
      description: 'Paramètres globaux mis à jour avec succès.',
    });
  };

  const handleSavePdfTemplates = (data: any) => {
    console.log('Saving PDF templates:', data);
    toast({
      title: 'Succès',
      description: 'Templates PDF mis à jour avec succès.',
    });
  };

  const handleUpdateNumbering = (id: string, data: Partial<DocumentNumbering>) => {
    console.log('Updating numbering:', id, data);
    toast({
      title: 'Succès',
      description: 'Numérotation mise à jour avec succès.',
    });
  };

  const handleInviteUser = (email: string, role: string) => {
    console.log('Inviting user:', email, role);
    toast({
      title: 'Succès',
      description: 'Invitation envoyée avec succès.',
    });
  };

  const handleUpdateUserRole = (userId: string, role: string) => {
    console.log('Updating user role:', userId, role);
    toast({
      title: 'Succès',
      description: 'Rôle utilisateur mis à jour.',
    });
  };

  const handleDeleteUser = (userId: string) => {
    console.log('Deleting user:', userId);
    toast({
      title: 'Succès',
      description: 'Utilisateur supprimé.',
    });
  };

  const handleCreateRole = (name: string, permissions: Record<string, Permission>) => {
    console.log('Creating role:', name, permissions);
    toast({
      title: 'Succès',
      description: 'Rôle créé avec succès.',
    });
  };

  const handleUpdateRole = (roleId: string, permissions: Record<string, Permission>) => {
    console.log('Updating role:', roleId, permissions);
    toast({
      title: 'Succès',
      description: 'Permissions mises à jour.',
    });
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600 mt-2">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600 mt-2">
          Configurez votre organisation, vos préférences et gérez vos utilisateurs
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="organization">Organisation</TabsTrigger>
          <TabsTrigger value="currencies">Devises</TabsTrigger>
          <TabsTrigger value="footer">Pied de page</TabsTrigger>
          <TabsTrigger value="templates">Templates PDF</TabsTrigger>
          <TabsTrigger value="numbering">Numérotation</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="roles">Rôles</TabsTrigger>
        </TabsList>

        <TabsContent value="organization">
          {organizationData ? (
            <OrganizationSettings
              organization={organizationData}
              onSave={handleSaveOrganization}
            />
          ) : (
            <Card className="p-6">
              <p className="text-gray-500">Aucune organisation trouvée</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="currencies">
          <CurrencySettings
            currencies={currencies}
            onAddCurrency={handleAddCurrency}
            onSetPrimary={handleSetPrimaryCurrency}
          />
        </TabsContent>

        <TabsContent value="footer">
          <FooterSettings
            settings={globalSettings}
            onSave={handleSaveGlobalSettings}
          />
        </TabsContent>

        <TabsContent value="templates">
          <PdfTemplateSettings
            settings={{
              invoice_template: globalSettings.invoice_template || 'classic',
              quote_template: globalSettings.quote_template || 'classic',
              delivery_note_template: globalSettings.delivery_note_template || 'classic',
              credit_template: globalSettings.credit_template || 'classic',
            }}
            onSave={handleSavePdfTemplates}
          />
        </TabsContent>

        <TabsContent value="numbering">
          <NumberingSettings
            numberings={numberings}
            onUpdateNumbering={handleUpdateNumbering}
          />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement
            users={users}
            roles={roles.map(r => r.name)}
            onInviteUser={handleInviteUser}
            onUpdateUserRole={handleUpdateUserRole}
            onDeleteUser={handleDeleteUser}
          />
        </TabsContent>

        <TabsContent value="roles">
          <RolePermissions
            roles={roles}
            onCreateRole={handleCreateRole}
            onUpdateRole={handleUpdateRole}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
