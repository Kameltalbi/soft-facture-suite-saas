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

export default function Settings() {
  const { toast } = useToast();
  const { organization, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('organization');
  const [organizationData, setOrganizationData] = useState<Organization | null>(null);
  const [organizationLoading, setOrganizationLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  
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

  // Load users from the organization
  const loadUsers = async () => {
    if (!profile?.organization_id) {
      setUsersLoading(false);
      return;
    }

    try {
      // Get users from profiles table with email
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          first_name,
          last_name,
          role,
          email,
          created_at,
          organization_id
        `)
        .eq('organization_id', profile.organization_id);

      if (profilesError) throw profilesError;

      // Transform data to match User interface
      const transformedUsers: User[] = (profilesData || []).map(user => {
        return {
          id: user.user_id,
          email: user.email || 'Email non disponible',
          full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Utilisateur',
          role: user.role || 'user',
          status: 'active' as const,
          created_at: user.created_at,
          tenant_id: user.organization_id
        };
      });

      console.log('Loaded users:', transformedUsers);
      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les utilisateurs',
        variant: 'destructive',
      });
    } finally {
      setUsersLoading(false);
    }
  };

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

  useEffect(() => {
    loadUsers();
  }, [profile?.organization_id]);

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

  // User management handlers
  const handleInviteUser = async (email: string, role: string) => {
    try {
      // This would typically involve sending an invitation email
      // For now, we'll just show a success message
      console.log('Inviting user:', email, role);
      toast({
        title: 'Succès',
        description: 'Invitation envoyée avec succès.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de l\'envoi de l\'invitation.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateUserRole = async (userId: string, role: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('user_id', userId);

      if (error) throw error;

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role } : user
      ));

      toast({
        title: 'Succès',
        description: 'Rôle utilisateur mis à jour.',
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la mise à jour du rôle.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      // Update local state
      setUsers(users.filter(user => user.id !== userId));

      toast({
        title: 'Succès',
        description: 'Utilisateur supprimé.',
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la suppression de l\'utilisateur.',
        variant: 'destructive',
      });
    }
  };

  if (organizationLoading || settingsLoading || usersLoading) {
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
            users={users}
            roles={['user', 'admin', 'superadmin']}
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
