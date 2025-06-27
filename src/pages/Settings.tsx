
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
import { useSettings } from '@/hooks/useSettings';
import { supabase } from '@/integrations/supabase/client';
import { Organization, User } from '@/types/settings';

// Mock data for user management (not yet implemented with real data)
const mockUsers: User[] = [
  { id: '1', email: 'admin@softfacture.tn', full_name: 'Admin Principal', role: 'Administrateur', status: 'active', created_at: '2024-01-01T00:00:00Z', tenant_id: 'tenant1' },
  { id: '2', email: 'comptable@softfacture.tn', full_name: 'Marie Dubois', role: 'Comptable', status: 'active', created_at: '2024-01-15T00:00:00Z', tenant_id: 'tenant1' },
  { id: '3', email: 'commercial@softfacture.tn', full_name: 'Ahmed Ben Ali', role: 'Commercial', status: 'pending', created_at: '2024-02-01T00:00:00Z', tenant_id: 'tenant1' },
];

export default function Settings() {
  const { toast } = useToast();
  const { organization, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('organization');
  const [organizationData, setOrganizationData] = useState<Organization | null>(null);
  const [organizationLoading, setOrganizationLoading] = useState(true);
  
  const {
    currencies,
    globalSettings,
    numberings,
    roles,
    loading: settingsLoading,
    addCurrency,
    setPrimaryCurrency,
    saveGlobalSettings,
    updateNumbering,
    createRole,
    updateRole
  } = useSettings();

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
    setOrganizationLoading(false);
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

  const handleSavePdfTemplates = (data: any) => {
    saveGlobalSettings(data);
  };

  // Mock handlers for user management (not yet implemented)
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

  if (organizationLoading || settingsLoading) {
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
            onAddCurrency={addCurrency}
            onSetPrimary={setPrimaryCurrency}
          />
        </TabsContent>

        <TabsContent value="footer">
          <FooterSettings
            settings={globalSettings}
            onSave={saveGlobalSettings}
          />
        </TabsContent>

        <TabsContent value="templates">
          <PdfTemplateSettings
            settings={{
              invoice_template: globalSettings?.invoice_template || 'classic',
              quote_template: globalSettings?.quote_template || 'classic',
              delivery_note_template: globalSettings?.delivery_note_template || 'classic',
              credit_template: globalSettings?.credit_template || 'classic',
            }}
            onSave={handleSavePdfTemplates}
          />
        </TabsContent>

        <TabsContent value="numbering">
          <NumberingSettings
            numberings={numberings}
            onUpdateNumbering={updateNumbering}
          />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement
            users={mockUsers}
            roles={roles.map(r => r.name)}
            onInviteUser={handleInviteUser}
            onUpdateUserRole={handleUpdateUserRole}
            onDeleteUser={handleDeleteUser}
          />
        </TabsContent>

        <TabsContent value="roles">
          <RolePermissions
            roles={roles}
            onCreateRole={createRole}
            onUpdateRole={updateRole}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
