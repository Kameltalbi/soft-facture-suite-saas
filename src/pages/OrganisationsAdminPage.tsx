import { useState, useEffect } from 'react';
import { Search, Building2, Calendar, CreditCard, ArrowUp, History, Edit, Pause, Check, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { UserManagementSection } from '@/components/admin/UserManagementSection';
import { NewOrganizationForm } from '@/components/admin/NewOrganizationForm';
import { OrganizationUsersList } from '@/components/admin/OrganizationUsersList';
import { OrganizationActionsMenu } from '@/components/admin/OrganizationActionsMenu';
import { SubscriptionEditModal } from '@/components/admin/SubscriptionEditModal';
import { SubscriptionStatusBadge } from '@/components/admin/SubscriptionStatusBadge';

interface Organization {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'suspended' | 'pending';
  plan: 'free' | 'standard' | 'premium';
  subscription_start: string;
  subscription_end: string | null;
  created_at: string;
  updated_at: string;
}

interface OrganizationHistory {
  id: string;
  action: string;
  details: any;
  performed_by: string;
  created_at: string;
}

// Type guards for validation
const isValidStatus = (status: string): status is 'active' | 'suspended' | 'pending' => {
  return ['active', 'suspended', 'pending'].includes(status);
};

const isValidPlan = (plan: string): plan is 'free' | 'standard' | 'premium' => {
  return ['free', 'standard', 'premium'].includes(plan);
};

const OrganisationsAdminPage = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Modals state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [usersModalOpen, setUsersModalOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [organizationHistory, setOrganizationHistory] = useState<OrganizationHistory[]>([]);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    status: '',
    plan: '',
    subscription_start: '',
    subscription_end: ''
  });

  const { toast } = useToast();
  const { user } = useAuth();
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);

  // Load organizations
  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data with proper type validation
      const transformedData: Organization[] = (data || []).map(org => ({
        id: org.id,
        name: org.name,
        email: org.email || '',
        status: isValidStatus(org.status) ? org.status : 'pending',
        plan: isValidPlan(org.plan) ? org.plan : 'free',
        subscription_start: org.subscription_start,
        subscription_end: org.subscription_end,
        created_at: org.created_at,
        updated_at: org.updated_at
      }));
      
      setOrganizations(transformedData);
      setFilteredOrganizations(transformedData);
    } catch (error) {
      console.error('Error loading organizations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les organisations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Load organization history
  const loadOrganizationHistory = async (orgId: string) => {
    try {
      const { data, error } = await supabase
        .from('organization_history')
        .select('*')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrganizationHistory(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique",
        variant: "destructive"
      });
    }
  };

  // Update organization
  const updateOrganization = async (orgId: string, updates: Partial<Organization>) => {
    try {
      const { error } = await supabase
        .from('organizations')
        .update({ ...updates, updated_by: user?.id })
        .eq('id', orgId);

      if (error) throw error;
      
      await loadOrganizations();
      
      toast({
        title: "Succès",
        description: "Organisation mise à jour avec succès"
      });
    } catch (error) {
      console.error('Error updating organization:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'organisation",
        variant: "destructive"
      });
    }
  };

  // Handle edit submit
  const handleEditSubmit = async () => {
    if (!selectedOrganization) return;

    // Validate the form values before submitting
    const status = isValidStatus(editForm.status) ? editForm.status : 'pending';
    const plan = isValidPlan(editForm.plan) ? editForm.plan : 'free';

    await updateOrganization(selectedOrganization.id, {
      status,
      plan,
      subscription_start: editForm.subscription_start,
      subscription_end: editForm.subscription_end || null
    });
    
    setEditModalOpen(false);
  };

  // Handle edit organization
  const handleEditOrganization = (org: Organization) => {
    setSelectedOrganization(org);
    setEditForm({
      status: org.status,
      plan: org.plan,
      subscription_start: org.subscription_start,
      subscription_end: org.subscription_end || ''
    });
    setEditModalOpen(true);
  };

  // Handle view users
  const handleViewUsers = (org: Organization) => {
    setSelectedOrganization(org);
    setUsersModalOpen(true);
  };

  // Handle view history
  const handleViewHistory = (org: Organization) => {
    setSelectedOrganization(org);
    loadOrganizationHistory(org.id);
    setHistoryModalOpen(true);
  };

  // Handle edit subscription dates
  const handleEditSubscription = (org: Organization) => {
    setSelectedOrganization(org);
    setSubscriptionModalOpen(true);
  };

  // Filter organizations
  useEffect(() => {
    let filtered = organizations;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(org =>
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(org => org.status === statusFilter);
    }

    // Plan filter
    if (planFilter !== 'all') {
      filtered = filtered.filter(org => org.plan === planFilter);
    }

    setFilteredOrganizations(filtered);
    setCurrentPage(1);
  }, [organizations, searchTerm, statusFilter, planFilter]);

  useEffect(() => {
    loadOrganizations();
  }, []);

  // Get status badge
  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      suspended: 'destructive',
      pending: 'secondary'
    };
    
    const labels = {
      active: 'Actif',
      suspended: 'Suspendu',
      pending: 'En attente'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] as any}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  // Get plan badge
  const getPlanBadge = (plan: string) => {
    const variants = {
      free: 'secondary',
      standard: 'default',
      premium: 'default'
    };
    
    const labels = {
      free: 'Gratuit',
      standard: 'Standard',
      premium: 'Premium'
    };

    return (
      <Badge variant={variants[plan as keyof typeof variants] as any}>
        {labels[plan as keyof typeof labels]}
      </Badge>
    );
  };

  // Pagination
  const totalPages = Math.ceil(filteredOrganizations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrganizations = filteredOrganizations.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F9FA] p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement des organisations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FA] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Administration Superadmin</h1>
            <p className="text-neutral-600">Gestion globale des organisations et utilisateurs</p>
          </div>
        </div>

        {/* Onglets */}
        <Tabs defaultValue="organizations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="organizations" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Organisations
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Utilisateurs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="organizations" className="space-y-6">
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600">Total</p>
                      <p className="text-2xl font-bold text-neutral-900">{organizations.length}</p>
                    </div>
                    <Building2 className="h-8 w-8 text-[#6A9C89]" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600">Actives</p>
                      <p className="text-2xl font-bold text-success">
                        {organizations.filter(o => o.status === 'active').length}
                      </p>
                    </div>
                    <Check className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600">Suspendues</p>
                      <p className="text-2xl font-bold text-destructive">
                        {organizations.filter(o => o.status === 'suspended').length}
                      </p>
                    </div>
                    <Pause className="h-8 w-8 text-destructive" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600">Premium</p>
                      <p className="text-2xl font-bold text-[#6A9C89]">
                        {organizations.filter(o => o.plan === 'premium').length}
                      </p>
                    </div>
                    <ArrowUp className="h-8 w-8 text-[#6A9C89]" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filtres et bouton création */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-lg">Filtres</CardTitle>
                  <NewOrganizationForm onCreated={loadOrganizations} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
                    <Input
                      placeholder="Rechercher par nom ou email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filtrer par statut" />
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
                      <SelectValue placeholder="Filtrer par plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les plans</SelectItem>
                      <SelectItem value="free">Gratuit</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Tableau des organisations */}
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
                        <TableHead>Organisation</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Début abonnement</TableHead>
                        <TableHead>Fin abonnement</TableHead>
                        <TableHead>Statut abonnement</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedOrganizations.map((org) => (
                        <TableRow key={org.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <Building2 size={16} className="mr-2 text-[#6A9C89]" />
                              <span className="font-medium">{org.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{org.email || 'N/A'}</TableCell>
                          <TableCell>{getStatusBadge(org.status)}</TableCell>
                          <TableCell>{getPlanBadge(org.plan)}</TableCell>
                          <TableCell>
                            {org.subscription_start ? new Date(org.subscription_start).toLocaleDateString('fr-FR') : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {org.subscription_end ? new Date(org.subscription_end).toLocaleDateString('fr-FR') : 'Illimité'}
                          </TableCell>
                          <TableCell>
                            <SubscriptionStatusBadge 
                              subscriptionStart={org.subscription_start}
                              subscriptionEnd={org.subscription_end}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <OrganizationActionsMenu
                              organization={org}
                              onEdit={handleEditOrganization}
                              onEditSubscription={handleEditSubscription}
                              onViewUsers={handleViewUsers}
                              onViewHistory={handleViewHistory}
                              onRefresh={loadOrganizations}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-neutral-600">
                      Page {currentPage} sur {totalPages}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        Précédent
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Suivant
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserManagementSection />
          </TabsContent>
        </Tabs>

        {/* Modal de modification */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier l'organisation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="status">Statut</Label>
                <Select value={editForm.status} onValueChange={(value) => setEditForm({...editForm, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="suspended">Suspendu</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="plan">Plan</Label>
                <Select value={editForm.plan} onValueChange={(value) => setEditForm({...editForm, plan: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Gratuit</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subscription_start">Début d'abonnement</Label>
                <Input
                  type="date"
                  value={editForm.subscription_start}
                  onChange={(e) => setEditForm({...editForm, subscription_start: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="subscription_end">Fin d'abonnement</Label>
                <Input
                  type="date"
                  value={editForm.subscription_end}
                  onChange={(e) => setEditForm({...editForm, subscription_end: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleEditSubmit}>
                  Sauvegarder
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal historique */}
        <Dialog open={historyModalOpen} onOpenChange={setHistoryModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Historique - {selectedOrganization?.name}</DialogTitle>
            </DialogHeader>
            <div className="max-h-96 overflow-y-auto">
              {organizationHistory.length === 0 ? (
                <p className="text-neutral-500 text-center py-4">Aucun historique disponible</p>
              ) : (
                <div className="space-y-3">
                  {organizationHistory.map((entry) => (
                    <div key={entry.id} className="border-l-2 border-[#6A9C89] pl-4 pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{entry.action}</p>
                          {entry.details && (
                            <p className="text-sm text-neutral-600">
                              {JSON.stringify(entry.details)}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-neutral-500">
                          {new Date(entry.created_at).toLocaleString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal des utilisateurs */}
        <Dialog open={usersModalOpen} onOpenChange={setUsersModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Utilisateurs de l'organisation</DialogTitle>
            </DialogHeader>
            {selectedOrganization && (
              <OrganizationUsersList 
                organizationId={selectedOrganization.id}
                organizationName={selectedOrganization.name}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de modification des dates d'abonnement */}
        <SubscriptionEditModal
          organization={selectedOrganization}
          isOpen={subscriptionModalOpen}
          onClose={() => setSubscriptionModalOpen(false)}
          onRefresh={loadOrganizations}
        />
      </div>
    </div>
  );
};

export default OrganisationsAdminPage;
