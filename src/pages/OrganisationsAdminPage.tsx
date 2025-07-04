
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Building, Users, Calendar, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { NewOrganizationForm } from '@/components/admin/NewOrganizationForm';
import { OrganizationActionsMenu } from '@/components/admin/OrganizationActionsMenu';
import { SubscriptionStatusBadge } from '@/components/admin/SubscriptionStatusBadge';
import { SubscriptionEditModal } from '@/components/admin/SubscriptionEditModal';
import { Header } from '@/components/layout/Header';
import { Organization } from '@/types/organization';

export default function OrganisationsAdminPage() {
  console.log('🏢 OrganisationsAdminPage - Début du rendu');
  
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  console.log('🏢 OrganisationsAdminPage - État des hooks initialisés');

  const fetchOrganizations = async () => {
    console.log('📊 Début fetchOrganizations');
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedData = (data || []).map(org => ({
        ...org,
        status: org.status as 'active' | 'suspended' | 'pending',
        plan: org.plan as 'essential' | 'pro'
      }));
      
      console.log('📊 Organizations récupérées:', typedData.length);
      setOrganizations(typedData);
    } catch (error) {
      console.error('❌ Error fetching organizations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les organisations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      console.log('📊 fetchOrganizations terminé');
    }
  };

  const handleRefresh = () => {
    fetchOrganizations();
  };

  const handleEditSubscription = (org: Organization) => {
    setSelectedOrg(org);
    setIsEditModalOpen(true);
  };

  const handleExtendSubscription = async (orgId: string, months: number) => {
    try {
      const { error } = await supabase.rpc('extend_subscription', {
        org_id: orgId,
        months: months
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: `Abonnement prolongé de ${months} mois`
      });

      handleRefresh();
    } catch (error) {
      console.error('Error extending subscription:', error);
      toast({
        title: "Erreur",
        description: "Impossible de prolonger l'abonnement",
        variant: "destructive"
      });
    }
  };

  const handleAbrogateSubscription = async (orgId: string) => {
    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          subscription_end: new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString()
        })
        .eq('id', orgId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Abonnement abrogé avec succès"
      });

      handleRefresh();
    } catch (error) {
      console.error('Error abrogating subscription:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'abroger l'abonnement",
        variant: "destructive"
      });
    }
  };

  const handleUpgradeOrganization = async (orgId: string, newPlan: string) => {
    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          plan: newPlan,
          updated_at: new Date().toISOString()
        })
        .eq('id', orgId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: `Organisation mise à niveau vers le plan ${newPlan}`
      });

      handleRefresh();
    } catch (error) {
      console.error('Error upgrading organization:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à niveau l'organisation",
        variant: "destructive"
      });
    }
  };

  const handleActivateOrganization = async (orgId: string) => {
    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          status: 'active',
          subscription_start: new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString()
        })
        .eq('id', orgId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Organisation activée avec succès"
      });

      handleRefresh();
    } catch (error) {
      console.error('Error activating organization:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'activer l'organisation",
        variant: "destructive"
      });
    }
  };

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || org.status === statusFilter;
    const matchesPlan = planFilter === 'all' || org.plan === planFilter;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const stats = {
    total: organizations.length,
    active: organizations.filter(org => org.status === 'active').length,
    suspended: organizations.filter(org => org.status === 'suspended').length,
    pending: organizations.filter(org => org.status === 'pending').length,
    pro: organizations.filter(org => org.plan === 'pro').length,
  };

  useEffect(() => {
    console.log('🔄 useEffect - Appel de fetchOrganizations');
    fetchOrganizations();
  }, []);

  if (loading) {
    console.log('⏳ OrganisationsAdminPage - Affichage du loader');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6A9C89]"></div>
      </div>
    );
  }

  console.log('🎨 OrganisationsAdminPage - Rendu de l\'interface principale');

  // Placeholder handlers for OrganizationActionsMenu
  const handleEdit = (org: Organization) => {
    console.log('Edit organization:', org);
    // TODO: Implement edit functionality
  };

  const handleViewUsers = (org: Organization) => {
    console.log('View users for organization:', org);
    // TODO: Implement view users functionality
  };

  const handleViewHistory = (org: Organization) => {
    console.log('View history for organization:', org);
    // TODO: Implement view history functionality
  };

  // Log render phases
  console.log('🎨 Rendu du header');
  console.log('🎨 Rendu du contenu principal');
  console.log('🎨 Rendu des onglets');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white px-6 py-4">
        <Header activeModule="admin" />
      </div>
      
      <div className="w-full px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Administration Superadmin</h1>
          <p className="text-gray-600 mt-2">Gestion globale des organisations et utilisateurs</p>
        </div>

        <Tabs defaultValue="organizations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="organizations" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Organisations
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Utilisateurs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="organizations" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Actives</CardTitle>
                  <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">En attente</CardTitle>
                  <div className="h-4 w-4 bg-orange-500 rounded-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Suspendues</CardTitle>
                  <div className="h-4 w-4 bg-red-500 rounded-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.suspended}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Plan Pro</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.pro}</div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filtres</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Rechercher par nom ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="suspended">Suspendu</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={planFilter} onValueChange={setPlanFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Tous les plans" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les plans</SelectItem>
                      <SelectItem value="essential">Essentiel</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                    </SelectContent>
                  </Select>
                  <NewOrganizationForm onCreated={handleRefresh} />
                </div>
              </CardContent>
            </Card>

            {/* Organizations Table */}
            <Card>
              <CardHeader>
                <CardTitle>Organisations</CardTitle>
                <CardDescription>
                  {filteredOrganizations.length} organisation(s) trouvée(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-64">Organisation</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Téléphone</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Début abonnement</TableHead>
                        <TableHead>Fin abonnement</TableHead>
                        <TableHead>Statut abonnement</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrganizations.map((org) => (
                        <TableRow key={org.id}>
                          <TableCell>
                            <div className="flex items-center gap-4">
                              <div className="logo-container w-16 h-16 flex items-center justify-center bg-white border border-gray-200 rounded-lg p-2 flex-shrink-0">
                                {org.logo_url ? (
                                  <img 
                                    src={org.logo_url} 
                                    alt={`${org.name} logo`}
                                    className="max-w-full max-h-full object-contain"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-[#6A9C89] rounded flex items-center justify-center">
                                    <Building className="h-6 w-6 text-white" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-gray-900 truncate">{org.name}</div>
                                <div className="text-sm text-gray-500">ID: {org.id.slice(0, 8)}...</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{org.email || 'N/A'}</TableCell>
                          <TableCell>{org.phone || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={
                              org.status === 'active' ? 'default' : 
                              org.status === 'suspended' ? 'destructive' : 'secondary'
                            }>
                              {org.status === 'active' ? 'Actif' : 
                               org.status === 'suspended' ? 'Suspendu' : 
                               org.status === 'pending' ? 'En attente' :
                               org.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              org.plan === 'pro' ? 'default' : 'secondary'
                            }>
                              {org.plan === 'essential' ? 'Essentiel' : 
                               org.plan === 'pro' ? 'Pro' : org.plan}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(org.subscription_start).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell>
                            {org.subscription_end ? 
                              new Date(org.subscription_end).toLocaleDateString('fr-FR') : 
                              'Illimité'
                            }
                          </TableCell>
                          <TableCell>
                            <SubscriptionStatusBadge 
                              subscriptionStart={org.subscription_start}
                              subscriptionEnd={org.subscription_end}
                            />
                          </TableCell>
                          <TableCell>
                            <OrganizationActionsMenu 
                              organization={org}
                              onEdit={handleEdit}
                              onEditSubscription={handleEditSubscription}
                              onViewUsers={handleViewUsers}
                              onViewHistory={handleViewHistory}
                              onActivate={handleActivateOrganization}
                              onRefresh={handleRefresh}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des utilisateurs</CardTitle>
                <CardDescription>
                  Fonctionnalité à venir
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  La gestion des utilisateurs sera disponible prochainement.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <SubscriptionEditModal
          organization={selectedOrg}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  );
}
