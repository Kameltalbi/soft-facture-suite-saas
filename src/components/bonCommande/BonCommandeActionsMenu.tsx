
import { useState } from 'react';
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
import { MoreHorizontal, Eye, Printer, Send, Edit, Copy, CheckCircle, Trash } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { EmailModal } from '@/components/modals/EmailModal';
import { BonCommandeFournisseur } from '@/types/bonCommande';

interface BonCommandeActionsMenuProps {
  bonCommande: BonCommandeFournisseur;
  pdfComponent: React.ReactNode;
  onView: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onMarkAsReceived: () => void;
  onDelete: () => void;
  onEmailSent: (emailData: any) => void;
}

export function BonCommandeActionsMenu({
  bonCommande,
  pdfComponent,
  onView,
  onEdit,
  onDuplicate,
  onMarkAsReceived,
  onDelete,
  onEmailSent
}: BonCommandeActionsMenuProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const canEdit = bonCommande.statut === 'brouillon' || bonCommande.statut === 'en_attente';
  const canMarkAsReceived = bonCommande.statut !== 'livree' && bonCommande.statut !== 'annulee';
  const isReceived = bonCommande.statut === 'livree';
  const canDelete = bonCommande.statut !== 'livree';
  const canSendEmail = bonCommande.statut !== 'livree' && bonCommande.statut !== 'annulee';

  const handleDelete = () => {
    onDelete();
    setShowDeleteDialog(false);
  };

  const handleEmailSent = (emailData: any) => {
    onEmailSent(emailData);
    setShowEmailModal(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white border shadow-lg">
          <DropdownMenuItem onClick={onView}>
            <Eye size={16} className="mr-2" />
            Voir le bon
          </DropdownMenuItem>

          <PDFDownloadLink
            document={pdfComponent as any}
            fileName={`${bonCommande.numero}.pdf`}
          >
            {({ loading }) => (
              <DropdownMenuItem disabled={loading}>
                <Printer size={16} className="mr-2" />
                {loading ? 'Génération...' : 'Télécharger PDF'}
              </DropdownMenuItem>
            )}
          </PDFDownloadLink>

          <DropdownMenuItem 
            onClick={() => setShowEmailModal(true)}
            disabled={!canSendEmail}
          >
            <Send size={16} className="mr-2" />
            Envoyer au fournisseur
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={onEdit} disabled={!canEdit}>
            <Edit size={16} className="mr-2" />
            Modifier
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onDuplicate}>
            <Copy size={16} className="mr-2" />
            Dupliquer
          </DropdownMenuItem>

          {canMarkAsReceived && (
            <DropdownMenuItem onClick={onMarkAsReceived} className="text-[#6A9C89]">
              <CheckCircle size={16} className="mr-2" />
              Marquer comme reçu
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
            disabled={!canDelete}
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
            <AlertDialogTitle>Supprimer le bon de commande</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le bon de commande {bonCommande.numero} ?
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
          id: bonCommande.id,
          number: bonCommande.numero,
          client: bonCommande.fournisseurNom,
          type: 'Bon de commande'
        }}
        onSend={handleEmailSent}
      />
    </>
  );
}
