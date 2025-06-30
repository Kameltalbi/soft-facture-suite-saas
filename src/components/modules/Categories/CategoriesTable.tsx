
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string | null;
  color: string;
  active: boolean;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

interface CategoriesTableProps {
  categories: Category[];
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  onViewCategory: (category: Category) => void;
}

export function CategoriesTable({ 
  categories, 
  onEditCategory, 
  onDeleteCategory, 
  onViewCategory 
}: CategoriesTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Couleur</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id} className="hover:bg-neutral-50">
                <TableCell>
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium text-neutral-900">{category.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-neutral-600">
                    {category.description || 'Aucune description'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div 
                      className="w-6 h-6 rounded border mr-2"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-mono">{category.color}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={category.active ? 'default' : 'secondary'}>
                    {category.active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-neutral-600">
                    {formatDate(category.created_at)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewCategory(category)}>
                        <Eye size={16} className="mr-2" />
                        Voir les détails
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditCategory(category)}>
                        <Edit size={16} className="mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDeleteCategory(category.id)}
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
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                  Aucune catégorie trouvée. Ajoutez votre première catégorie !
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
