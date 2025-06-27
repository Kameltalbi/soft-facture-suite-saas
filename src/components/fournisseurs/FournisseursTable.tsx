
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
import { Fournisseur } from '@/types/fournisseur';

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

  const getStatutBadge = (statut: 'actif' | 'inactif') => {
    return (
      <Badge variant={statut === 'actif' ? 'default' : 'secondary'}>
        {statut === 'actif' ? 'Actif' : 'Inactif'}
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
                    <div className="font-medium text-neutral-900">{fournisseur.nom}</div>
                    {fournisseur.matriculeFiscal && (
                      <div className="text-xs text-neutral-400">
                        Matricule: {fournisseur.matriculeFiscal}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{fournisseur.contactPrincipal.nom || 'N/A'}</div>
                    {fournisseur.contactPrincipal.email && (
                      <div className="flex items-center text-sm text-neutral-600">
                        <Mail size={12} className="mr-1" />
                        {fournisseur.contactPrincipal.email}
                      </div>
                    )}
                    {fournisseur.contactPrincipal.telephone && (
                      <div className="flex items-center text-sm text-neutral-600">
                        <Phone size={12} className="mr-1" />
                        {fournisseur.contactPrincipal.telephone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{fournisseur.secteurActivite || 'N/A'}</Badge>
                </TableCell>
                <TableCell>
                  {getStatutBadge(fournisseur.statut)}
                </TableCell>
                <TableCell className="text-sm text-neutral-600">
                  {formatDate(fournisseur.dateAjout)}
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
