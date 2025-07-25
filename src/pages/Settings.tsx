
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
import { ExchangeRateSettings } from '@/components/settings/ExchangeRateSettings';
import { CustomTaxSettings } from '@/components/settings/CustomTaxSettings';
import { InvoiceDisplaySettings } from '@/components/settings/InvoiceDisplaySettings';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useSettings';
import { usePlanAccess } from '@/hooks/usePlanAccess';
import { supabase } from '@/integrations/supabase/client';
import { Organization, User } from '@/types/settings';

export default function Settings() {
  const { toast } = useToast();
  const { organization, profile } = useAuth();
  const { settingsAccess, isAdmin } = usePlanAccess();
  const [activeTab, setActiveTab] = useState('organization');

  // Vérification des permissions d'accès
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Accès refusé</h2>
          <p className="text-muted-foreground">
            Vous n'avez pas les permissions nécessaires pour accéder aux paramètres.
            Seuls les administrateurs peuvent accéder à cette page.
          </p>
        </Card>
      </div>
    );
  }
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
    updateCurrency,
    deleteCurrency,
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
      console.log('🔄 Chargement des utilisateurs pour organisation:', profile.organization_id);

      // Get users from profiles table 
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

      console.log('📋 Profils trouvés:', profilesData);

      if (!profilesData || profilesData.length === 0) {
        console.log('⚠️ Aucun profil trouvé pour cette organisation');
        setUsers([]);
        return;
      }

      // Récupérer les emails depuis auth.users via la fonction RPC
      const userIds = profilesData.map(u => u.user_id);
      const { data: authData, error: authError } = await supabase.rpc('get_user_emails', {
        user_ids: userIds
      });

      console.log('📧 Emails récupérés:', authData);

      if (authError) {
        console.error('Erreur lors de la récupération des emails:', authError);
      }

      const transformedUsers: User[] = profilesData.map(user => {
        const authUser = authData?.find((au: any) => au.id === user.user_id);
        const email = user.email || authUser?.email || 'Email non disponible';
        
        return {
          id: user.user_id,
          email: email,
          full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Utilisateur',
          role: user.role || 'user',
          status: 'active' as const,
          created_at: user.created_at,
          tenant_id: user.organization_id
        };
      });

      console.log('✅ Utilisateurs transformés:', transformedUsers);
      setUsers(transformedUsers);
    } catch (error) {
      console.error('❌ Error loading users:', error);
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
        signature: (organization as any).signature_url || undefined,
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
      const updateData: any = {
        name: data.name,
        address: data.address,
        email: data.email,
        phone: data.phone,
        website: data.website,
        vat_number: data.vat_code,
      };

      // Add signature_url if signature is provided
      if (data.signature) {
        updateData.signature_url = data.signature;
      }

      const { error } = await supabase
        .from('organizations')
        .update(updateData)
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

  // User management handlers - Updated approach
  const handleCreateUser = async (email: string, password: string, firstName: string, lastName: string, role: string) => {
    if (!profile?.organization_id) {
      toast({
        title: 'Erreur',
        description: 'Impossible de trouver l\'organisation',
        variant: 'destructive',
      });
      return;
    }

    try {
      console.log('🔄 Création collaborateur:', {
        email,
        firstName,
        lastName,
        role,
        organization_id: profile.organization_id
      });

      // Étape 1: Créer l'utilisateur dans Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: firstName,
            last_name: lastName,
            organization_id: profile.organization_id,
            organization_name: organization?.name,
            role: role
          }
        }
      });

      console.log('📝 Résultat signUp:', { authData, authError });

      if (authError) {
        console.error('❌ Erreur signUp:', authError);
        throw authError;
      }

      if (authData.user) {
        console.log('✅ Utilisateur créé dans auth, ID:', authData.user.id);
        
        // Étape 2: Créer le profil directement (ne pas compter sur le trigger)
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: authData.user.id,
            email: email,
            first_name: firstName || null,
            last_name: lastName || null,
            organization_id: profile.organization_id,
            role: role
          });

        if (profileError) {
          console.error('❌ Erreur création profil:', profileError);
          throw profileError;
        }

        console.log('✅ Profil créé avec succès');

        // Étape 3: Recharger immédiatement la liste
        await loadUsers();

        toast({
          title: 'Succès',
          description: 'Collaborateur créé avec succès.',
        });
      } else {
        console.warn('⚠️ Aucun utilisateur retourné par signUp');
        toast({
          title: 'Attention',
          description: 'L\'utilisateur existe peut-être déjà. Vérifiez l\'email.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('❌ Error creating user:', error);
      toast({
        title: 'Erreur',
        description: `Erreur lors de la création du collaborateur: ${error.message || 'Vérifiez que l\'email n\'est pas déjà utilisé.'}`,
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
      // Supprimer le profil
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (profileError) throw profileError;

      // Note: On ne peut pas supprimer l'utilisateur auth avec la clé publique
      // L'utilisateur sera marqué comme supprimé mais restera dans auth

      // Update local state
      setUsers(users.filter(user => user.id !== userId));

      toast({
        title: 'Succès',
        description: 'Utilisateur retiré de l\'organisation.',
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
        <TabsList className={`grid w-full ${settingsAccess.templates ? 'grid-cols-10' : 'grid-cols-9'}`}>
          <TabsTrigger value="organization">Organisation</TabsTrigger>
          <TabsTrigger value="currencies">Devises</TabsTrigger>
          <TabsTrigger value="exchange-rates">Taux de Change</TabsTrigger>
          <TabsTrigger value="footer">Pied de page</TabsTrigger>
          {settingsAccess.templates && <TabsTrigger value="templates">Templates PDF</TabsTrigger>}
          <TabsTrigger value="display">Affichage</TabsTrigger>
          <TabsTrigger value="taxes">Taxes</TabsTrigger>
          <TabsTrigger value="numbering">Numérotation</TabsTrigger>
          <TabsTrigger value="users">Collaborateurs</TabsTrigger>
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
            onUpdateCurrency={updateCurrency}
            onDeleteCurrency={deleteCurrency}
          />
        </TabsContent>

        <TabsContent value="exchange-rates">
          <ExchangeRateSettings />
        </TabsContent>

        <TabsContent value="footer">
          <FooterSettings
            settings={globalSettings}
            onSave={saveGlobalSettings}
          />
        </TabsContent>

        {settingsAccess.templates && (
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
        )}

        <TabsContent value="display">
          <InvoiceDisplaySettings />
        </TabsContent>

        <TabsContent value="taxes">
          <CustomTaxSettings />
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
            currentUserRole={profile?.role}
            currentPlan={organization?.plan}
            onCreateUser={handleCreateUser}
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
