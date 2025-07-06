
import { useState, useEffect } from 'react';
import { Users, Mail, Shield, Calendar, Eye, Edit2, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  user_id: string;
  organization_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: string;
  created_at: string;
  organization_name: string;
}

interface AuthUser {
  id: string;
  email: string;
}

interface Organization {
  id: string;
  name: string;
}

interface UserManagementSectionProps {
  organizationId?: string;
}

export function UserManagementSection({ organizationId }: UserManagementSectionProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState('');
  
  // États pour la création d'utilisateur
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [createForm, setCreateForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    organizationId: '',
    role: 'user'
  });

  const { toast } = useToast();

  // Charger les organisations
  const loadOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setOrganizations(data || []);
    } catch (error) {
      console.error('Error loading organizations:', error);
    }
  };

  // Charger les utilisateurs
  const loadUsers = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          organization_id,
          first_name,
          last_name,
          role,
          created_at,
          organizations!inner(name)
        `)
        .order('created_at', { ascending: false });

      // Si un ID d'organisation est spécifié, filtrer par organisation
      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Récupérer les emails depuis auth.users via la fonction RPC
      const userIds = data?.map(u => u.user_id) || [];
      const { data: authData, error: authError } = await supabase.rpc('get_user_emails', {
        user_ids: userIds
      });

      if (authError) {
        console.error('Error fetching user emails:', authError);
      }

      const usersWithEmails = data?.map(user => ({
        ...user,
        email: (authData as AuthUser[])?.find((au: AuthUser) => au.id === user.user_id)?.email || 'N/A',
        organization_name: user.organizations?.name || 'N/A'
      })) || [];

      setUsers(usersWithEmails);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour le rôle d'un utilisateur
  const updateUserRole = async () => {
    if (!selectedUser || !newRole) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedUser.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Rôle utilisateur mis à jour avec succès"
      });

      setEditModalOpen(false);
      loadUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le rôle",
        variant: "destructive"
      });
    }
  };

  // Supprimer un utilisateur
  const deleteUser = async () => {
    if (!selectedUser) return;

    try {
      // Supprimer le profil (cela va déclencher une suppression en cascade)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', selectedUser.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Utilisateur supprimé avec succès"
      });

      setDeleteModalOpen(false);
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur",
        variant: "destructive"
      });
    }
  };

  // Créer un utilisateur
  const createUser = async () => {
    if (!createForm.email || !createForm.password || !createForm.organizationId) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Calling create-user-admin edge function with:', {
        email: createForm.email,
        firstName: createForm.firstName,
        lastName: createForm.lastName,
        organizationId: createForm.organizationId,
        role: createForm.role
      });

      // Appeler l'edge function pour créer l'utilisateur
      const { data, error } = await supabase.functions.invoke('create-user-admin', {
        body: {
          email: createForm.email,
          password: createForm.password,
          firstName: createForm.firstName,
          lastName: createForm.lastName,
          organizationId: createForm.organizationId,
          role: createForm.role
        }
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }
      if (data.error) {
        console.error('Edge function returned error:', data.error);
        // Gestion d'erreurs spécifiques pour améliorer l'expérience utilisateur
        if (data.error.includes('already been registered')) {
          throw new Error('Cet email est déjà utilisé par un autre utilisateur');
        }
        throw new Error(data.error);
      }

      toast({
        title: "Succès",
        description: "Utilisateur créé avec succès"
      });

      setCreateModalOpen(false);
      setCreateForm({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        organizationId: '',
        role: 'user'
      });
      loadUsers();
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer l'utilisateur",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadUsers();
    loadOrganizations();
  }, [organizationId]);

  // Badge pour le rôle
  const getRoleBadge = (role: string) => {
    const variants = {
      superadmin: 'destructive',
      admin: 'default',
      user: 'secondary'
    };
    
    const labels = {
      superadmin: 'Super Admin',
      admin: 'Admin',
      user: 'Collaborateur'
    };

    return (
      <Badge variant={variants[role as keyof typeof variants] as any}>
        {labels[role as keyof typeof labels] || role}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-lg">Chargement des utilisateurs...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gestion des Utilisateurs
                {organizationId && ` - Organisation spécifique`}
              </CardTitle>
              <CardDescription>
                {users.length} utilisateur(s) {organizationId ? 'dans cette organisation' : 'au total'}
              </CardDescription>
            </div>
            <Button onClick={() => setCreateModalOpen(true)}>
              <Users className="h-4 w-4 mr-2" />
              Ajouter collaborateur
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Organisation</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Date d'inscription</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-[#6A9C89] rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-medium">
                            {(user.first_name?.[0] || user.email[0]).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">
                            {user.first_name && user.last_name 
                              ? `${user.first_name} ${user.last_name}`
                              : 'Nom non renseigné'
                            }
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>{user.organization_name}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(user.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setNewRole(user.role);
                            setEditModalOpen(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        {user.role !== 'superadmin' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setDeleteModalOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de modification du rôle */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le rôle utilisateur</DialogTitle>
            <DialogDescription>
              Modifier le rôle de {selectedUser?.first_name} {selectedUser?.last_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="role">Nouveau rôle</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Collaborateur</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={updateUserRole}>
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de suppression */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l'utilisateur</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer {selectedUser?.first_name} {selectedUser?.last_name} ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={deleteUser}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de création d'utilisateur */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un collaborateur</DialogTitle>
            <DialogDescription>
              Créer un nouveau collaborateur et l'assigner à une organisation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={createForm.firstName}
                  onChange={(e) => setCreateForm({...createForm, firstName: e.target.value})}
                  placeholder="Prénom"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  value={createForm.lastName}
                  onChange={(e) => setCreateForm({...createForm, lastName: e.target.value})}
                  placeholder="Nom"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                placeholder="email@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Mot de passe *</Label>
              <Input
                id="password"
                type="password"
                value={createForm.password}
                onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                placeholder="Mot de passe"
                required
              />
            </div>
            <div>
              <Label htmlFor="organization">Organisation *</Label>
              <Select 
                value={createForm.organizationId} 
                onValueChange={(value) => setCreateForm({...createForm, organizationId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une organisation" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="role">Rôle</Label>
              <Select 
                value={createForm.role} 
                onValueChange={(value) => setCreateForm({...createForm, role: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Collaborateur</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={createUser}>
              Créer le collaborateur
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
