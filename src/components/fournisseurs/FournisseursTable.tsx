
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, Edit, Trash2, MoreHorizontal, Mail, Phone } from 'lucide-react';

interface Fournisseur {
  id: string;
  name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  vat_number: string | null;
  business_sector: string | null;
  status: string | null;
  internal_notes: string | null;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

interface FournisseursTableProps {
  fournisseurs: Fournisseur[];
  onEdit: (fournisseur: Fournisseur) => void;
  onDelete: (id: string) => void;
  onView: (fournisseur: Fournisseur) => void;
}

export function FournisseursTable({ fournisseurs, onEdit, onDelete, onView }: FournisseursTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatutBadge = (statut: string | null) => {
    return (
      <Badge variant={statut === 'active' ? 'default' : 'secondary'}>
        {statut === 'active' ? 'Actif' : 'Inactif'}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des fournisseurs</CardTitle>
        <CardDescription>
          Gérez vos fournisseurs et leurs informations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom du fournisseur</TableHead>
              <TableHead>Contact principal</TableHead>
              <TableHead>Secteur d'activité</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date d'ajout</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fournisseurs.map((fournisseur) => (
              <TableRow key={fournisseur.id} className="hover:bg-neutral-50">
                <TableCell>
                  <div>
                    <div className="font-medium text-neutral-900">{fournisseur.name}</div>
                    {fournisseur.vat_number && (
                      <div className="text-xs text-neutral-400">
                        Matricule: {fournisseur.vat_number}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{fournisseur.contact_name || 'N/A'}</div>
                    {fournisseur.email && (
                      <div className="flex items-center text-sm text-neutral-600">
                        <Mail size={12} className="mr-1" />
                        {fournisseur.email}
                      </div>
                    )}
                    {fournisseur.phone && (
                      <div className="flex items-center text-sm text-neutral-600">
                        <Phone size={12} className="mr-1" />
                        {fournisseur.phone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{fournisseur.business_sector || 'N/A'}</Badge>
                </TableCell>
                <TableCell>
                  {getStatutBadge(fournisseur.status)}
                </TableCell>
                <TableCell className="text-sm text-neutral-600">
                  {formatDate(fournisseur.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(fournisseur)}>
                        <Eye size={16} className="mr-2" />
                        Voir les détails
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(fournisseur)}>
                        <Edit size={16} className="mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(fournisseur.id)}
                        className="text-destructive"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {fournisseurs.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                  Aucun fournisseur trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
