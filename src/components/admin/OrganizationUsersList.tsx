
import { useState, useEffect } from 'react';
import { Users, Mail, Shield } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: string;
  created_at: string;
}

interface AuthUser {
  id: string;
  email: string;
}

interface OrganizationUsersListProps {
  organizationId: string;
  organizationName: string;
}

export function OrganizationUsersList({ organizationId, organizationName }: OrganizationUsersListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

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
        email: (authData as AuthUser[])?.find((au: AuthUser) => au.id === user.user_id)?.email || 'N/A'
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

  useEffect(() => {
    loadUsers();
  }, [organizationId]);

  const getRoleBadge = (role: string) => {
    const variants = {
      superadmin: 'destructive',
      admin: 'default',
      user: 'secondary'
    };
    
    const labels = {
      superadmin: 'Super Admin',
      admin: 'Admin',
      user: 'Utilisateur'
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Utilisateurs de {organizationName}
        </CardTitle>
        <CardDescription>
          {users.length} utilisateur(s) dans cette organisation
        </CardDescription>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucun utilisateur trouvé dans cette organisation
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Date d'inscription</TableHead>
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
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
