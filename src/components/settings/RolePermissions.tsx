import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Shield, Plus } from 'lucide-react';
import { Role, Permission } from '@/types/settings';

interface RolePermissionsProps {
  roles: Role[];
  onCreateRole: (name: string, permissions: Record<string, Permission>) => void;
  onUpdateRole: (roleId: string, permissions: Record<string, Permission>) => void;
}

const MODULES = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'invoices', label: 'Factures' },
  { key: 'quotes', label: 'Devis' },
  { key: 'delivery_notes', label: 'Bons de livraison' },
  { key: 'credits', label: 'Avoirs' },
  { key: 'clients', label: 'Clients' },
  { key: 'products', label: 'Produits / Services' },
  { key: 'stock', label: 'Stock' },
  { key: 'settings_org', label: 'Paramètres organisation' },
  { key: 'settings_invoice', label: 'Paramètres factures (⚙️)' },
];

export function RolePermissions({ roles, onCreateRole, onUpdateRole }: RolePermissionsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRolePermissions, setNewRolePermissions] = useState<Record<string, Permission>>({});
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const initializePermissions = () => {
    const permissions: Record<string, Permission> = {};
    MODULES.forEach(module => {
      permissions[module.key] = { read: false, write: false, delete: false };
    });
    return permissions;
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoleName.trim()) {
      onCreateRole(newRoleName, newRolePermissions);
      setNewRoleName('');
      setNewRolePermissions({});
      setIsDialogOpen(false);
    }
  };

  const handlePermissionChange = (
    roleId: string, 
    module: string, 
    permission: keyof Permission, 
    value: boolean,
    isNewRole = false
  ) => {
    if (isNewRole) {
      setNewRolePermissions(prev => ({
        ...prev,
        [module]: {
          ...prev[module],
          [permission]: value
        }
      }));
    } else {
      const role = roles.find(r => r.id === roleId);
      if (role) {
        const updatedPermissions = {
          ...role.permissions,
          [module]: {
            ...role.permissions[module],
            [permission]: value
          }
        };
        onUpdateRole(roleId, updatedPermissions);
      }
    }
  };

  const getPermission = (role: Role | null, module: string, permission: keyof Permission, isNewRole = false): boolean => {
    if (isNewRole) {
      return newRolePermissions[module]?.[permission] || false;
    }
    return role?.permissions[module]?.[permission] || false;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Rôles et permissions
        </CardTitle>
        <CardDescription>
          Créez des rôles personnalisés et gérez les permissions d'accès
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-end">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Créer un nouveau rôle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Créer un nouveau rôle</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateRole} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="roleName">Nom du rôle</Label>
                  <Input
                    id="roleName"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="Ex: Comptable, Commercial, Responsable"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Label>Permissions</Label>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Module</TableHead>
                        <TableHead>Lecture</TableHead>
                        <TableHead>Écriture</TableHead>
                        <TableHead>Suppression</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MODULES.map((module) => (
                        <TableRow key={module.key}>
                          <TableCell className="font-medium">{module.label}</TableCell>
                          <TableCell>
                            <Checkbox
                              checked={getPermission(null, module.key, 'read', true)}
                              onCheckedChange={(checked) => 
                                handlePermissionChange('', module.key, 'read', checked as boolean, true)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={getPermission(null, module.key, 'write', true)}
                              onCheckedChange={(checked) => 
                                handlePermissionChange('', module.key, 'write', checked as boolean, true)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={getPermission(null, module.key, 'delete', true)}
                              onCheckedChange={(checked) => 
                                handlePermissionChange('', module.key, 'delete', checked as boolean, true)
                              }
                              disabled={module.key.startsWith('settings')}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">Créer le rôle</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Existing Roles */}
        {roles.map((role) => (
          <Card key={role.id} className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg">{role.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module</TableHead>
                    <TableHead>Lecture</TableHead>
                    <TableHead>Écriture</TableHead>
                    <TableHead>Suppression</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MODULES.map((module) => (
                    <TableRow key={module.key}>
                      <TableCell className="font-medium">{module.label}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={getPermission(role, module.key, 'read')}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(role.id, module.key, 'read', checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={getPermission(role, module.key, 'write')}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(role.id, module.key, 'write', checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={getPermission(role, module.key, 'delete')}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(role.id, module.key, 'delete', checked as boolean)
                          }
                          disabled={module.key.startsWith('settings')}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
