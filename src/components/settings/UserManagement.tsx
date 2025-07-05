
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus, Trash2, UserPlus, Edit, AlertCircle } from 'lucide-react';
import { User } from '@/types/settings';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UserManagementProps {
  users: User[];
  roles: string[];
  currentUserRole?: string;
  currentPlan?: string;
  onCreateUser: (email: string, password: string, firstName: string, lastName: string, role: string) => void;
  onUpdateUserRole: (userId: string, role: string) => void;
  onDeleteUser: (userId: string) => void;
}

export function UserManagement({ users, roles, currentUserRole, currentPlan, onCreateUser, onUpdateUserRole, onDeleteUser }: UserManagementProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: '',
  });

  // Plan limits
  const getUserLimit = (plan: string) => {
    switch (plan) {
      case 'essential':
        return 1;
      case 'pro':
        return 3;
      default:
        return 1;
    }
  };

  const userLimit = getUserLimit(currentPlan || 'essential');
  const activeUsers = users.filter(u => u.status === 'active').length;
  const hasReachedLimit = activeUsers >= userLimit;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateUser(userData.email, userData.password, userData.firstName, userData.lastName, userData.role);
    setUserData({ email: '', password: '', firstName: '', lastName: '', role: '' });
    setIsDialogOpen(false);
  };

  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactif</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'superadmin':
        return <Badge className="bg-red-100 text-red-800">Super Admin</Badge>;
      case 'admin':
        return <Badge className="bg-blue-100 text-blue-800">Admin</Badge>;
      case 'user':
        return <Badge className="bg-gray-100 text-gray-800">Collaborateur</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  // Filter roles for creation - only superadmin can create superadmin
  const getAvailableRoles = () => {
    if (currentUserRole === 'superadmin') {
      return roles;
    }
    return roles.filter(role => role !== 'superadmin');
  };

  // Filter roles for updates - same logic
  const getUpdatableRoles = (targetUserRole: string) => {
    if (currentUserRole === 'superadmin') {
      return roles;
    }
    // Admin cannot update to/from superadmin
    if (targetUserRole === 'superadmin') {
      return [targetUserRole]; // Can't change superadmin role if you're not superadmin
    }
    return roles.filter(role => role !== 'superadmin');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Collaborateurs de l'organisation
        </CardTitle>
        <CardDescription>
          Créez et gérez les collaborateurs et leurs rôles dans votre organisation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <p className={`text-sm ${hasReachedLimit ? 'text-red-600' : 'text-gray-600'}`}>
              {activeUsers} collaborateur(s) actif(s) sur {userLimit} autorisé{userLimit > 1 ? 's' : ''} ({currentPlan === 'pro' ? 'Pro' : 'Essential'})
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={hasReachedLimit}>
                <UserPlus className="h-4 w-4 mr-2" />
                Ajouter collaborateur
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un collaborateur</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={userData.firstName}
                      onChange={(e) => setUserData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Prénom"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={userData.lastName}
                      onChange={(e) => setUserData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Nom"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Adresse email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="utilisateur@exemple.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={userData.password}
                    onChange={(e) => setUserData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Mot de passe"
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select
                    value={userData.role}
                    onValueChange={(value) => setUserData(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableRoles().map((role) => (
                        <SelectItem key={role} value={role}>
                          {role === 'superadmin' ? 'Super Admin' : 
                           role === 'admin' ? 'Admin' : 
                           role === 'user' ? 'Collaborateur' : role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                    <Button type="submit">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter le collaborateur
                    </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date d'ajout</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getRoleBadge(user.role)}
                    <Select
                      value={user.role}
                      onValueChange={(value) => onUpdateUserRole(user.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getUpdatableRoles(user.role).map((role) => (
                          <SelectItem key={role} value={role}>
                            {role === 'superadmin' ? 'Super Admin' : 
                             role === 'admin' ? 'Admin' : 
                             role === 'user' ? 'Collaborateur' : role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
