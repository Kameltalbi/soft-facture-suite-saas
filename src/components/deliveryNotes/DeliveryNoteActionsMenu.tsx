
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Eye, 
  Printer, 
  Mail, 
  Edit, 
  Copy, 
  ArrowRight, 
  Trash,
  CheckCircle,
  Package
} from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { EmailModal } from '@/components/modals/EmailModal';
import { useAuth } from '@/hooks/useAuth';
import { DeliveryNoteFromDB } from '@/types/deliveryNote';

interface DeliveryNoteActionsMenuProps {
  deliveryNote: DeliveryNoteFromDB;
  onEdit: () => void;
  onDelete: () => void;
}

const statusLabels = {
  pending: { label: 'En attente', variant: 'secondary' as const },
  sent: { label: 'Envoyé', variant: 'default' as const },
  delivered: { label: 'Livré', variant: 'default' as const },
  signed: { label: 'Signé', variant: 'default' as const }
};

export function DeliveryNoteActionsMenu({
  deliveryNote,
  onEdit,
  onDelete
}: DeliveryNoteActionsMenuProps) {
  const { user, organization } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const canEdit = deliveryNote.status === 'pending';
  const canMarkAsDelivered = deliveryNote.status === 'sent';
  const canConvertToInvoice = deliveryNote.status === 'delivered' || deliveryNote.status === 'signed';

  const handleDelete = () => {
    onDelete();
    setShowDeleteDialog(false);
  };

  const handleEmailSent = (emailData: any) => {
    console.log('Email sent:', emailData);
    setShowEmailModal(false);
  };

  const handleView = () => {
    console.log('View delivery note:', deliveryNote.id);
  };

  const handleDuplicate = () => {
    console.log('Duplicate delivery note:', deliveryNote.id);
  };

  const handleMarkAsDelivered = () => {
    console.log('Mark as delivered:', deliveryNote.id);
  };

  const handleConvertToInvoice = () => {
    console.log('Convert to invoice:', deliveryNote.id);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={handleView}>
            <Eye size={16} className="mr-2" />
            Voir le bon de livraison
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Printer size={16} className="mr-2" />
            Télécharger PDF
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setShowEmailModal(true)}>
            <Mail size={16} className="mr-2" />
            Envoyer par email
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={onEdit} disabled={!canEdit}>
            <Edit size={16} className="mr-2" />
            Modifier
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleDuplicate}>
            <Copy size={16} className="mr-2" />
            Dupliquer
          </DropdownMenuItem>

          {canMarkAsDelivered && (
            <DropdownMenuItem onClick={handleMarkAsDelivered} className="text-primary">
              <Package size={16} className="mr-2" />
              Marquer comme livré
            </DropdownMenuItem>
          )}

          {canConvertToInvoice && (
            <DropdownMenuItem onClick={handleConvertToInvoice} className="text-primary">
              <ArrowRight size={16} className="mr-2" />
              Convertir en facture
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash size={16} className="mr-2" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le bon de livraison</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le bon de livraison {deliveryNote.delivery_number} ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Email Modal */}
      <EmailModal
        open={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        document={{
          id: deliveryNote.id,
          number: deliveryNote.delivery_number,
          client: deliveryNote.clients?.name || 'N/A',
          type: 'Bon de livraison'
        }}
        onSend={handleEmailSent}
      />
    </>
  );
}
