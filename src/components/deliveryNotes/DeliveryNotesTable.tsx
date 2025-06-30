
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Package, CheckCircle, Clock } from 'lucide-react';
import { DeliveryNoteActionsMenu } from '@/components/deliveryNotes/DeliveryNoteActionsMenu';
import { DeliveryNoteFromDB } from '@/types/deliveryNote';

interface DeliveryNotesTableProps {
  deliveryNotes: DeliveryNoteFromDB[];
  onEdit: (note: DeliveryNoteFromDB) => void;
  onDelete: (id: string) => void;
}

export function DeliveryNotesTable({ deliveryNotes, onEdit, onDelete }: DeliveryNotesTableProps) {
  const getStatusBadge = (status: DeliveryNoteFromDB['status']) => {
    const statusConfig = {
      pending: { label: 'En attente', variant: 'secondary' as const, icon: Clock },
      sent: { label: 'Envoyé', variant: 'outline' as const, icon: Package },
      delivered: { label: 'Livré', variant: 'default' as const, icon: CheckCircle },
      signed: { label: 'Signé', variant: 'default' as const, icon: CheckCircle }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent size={12} />
        {config.label}
      </Badge>
    );
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numéro</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date prévue</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deliveryNotes.map((note) => (
              <TableRow key={note.id} className="hover:bg-neutral-50">
                <TableCell>
                  <div className="font-medium text-neutral-900">{note.delivery_number}</div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{note.clients?.name || 'N/A'}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{new Date(note.date).toLocaleDateString('fr-FR')}</span>
                </TableCell>
                <TableCell>
                  {getStatusBadge(note.status)}
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {note.expected_delivery_date
                      ? new Date(note.expected_delivery_date).toLocaleDateString('fr-FR')
                      : 'N/A'
                    }
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DeliveryNoteActionsMenu
                    deliveryNote={note}
                    onEdit={() => onEdit(note)}
                    onDelete={() => onDelete(note.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
            {deliveryNotes.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                  Aucun bon de livraison ne correspond à votre recherche
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
