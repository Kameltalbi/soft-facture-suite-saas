
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
import { MoreHorizontal, Eye, Printer, Mail, Edit, Copy, ArrowRight, Trash } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { EmailModal } from '@/components/modals/EmailModal';
import { Quote } from '@/types/quote';

interface QuoteActionsMenuProps {
  quote: Quote;
  pdfComponent: React.ReactNode;
  onView: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onConvert: () => void;
  onDelete: () => void;
  onEmailSent: (emailData: any) => void;
}

export function QuoteActionsMenu({
  quote,
  pdfComponent,
  onView,
  onEdit,
  onDuplicate,
  onConvert,
  onDelete,
  onEmailSent
}: QuoteActionsMenuProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleDelete = () => {
    onDelete();
    setShowDeleteDialog(false);
  };

  const handleEmailSent = (emailData: any) => {
    onEmailSent(emailData);
    setShowEmailModal(false);
  };

  const canConvert = quote.statut === 'acceptee';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={onView}>
            <Eye size={16} className="mr-2" />
            Voir le devis
          </DropdownMenuItem>

          <PDFDownloadLink
            document={pdfComponent as any}
            fileName={`${quote.numero}.pdf`}
          >
            {({ loading }) => (
              <DropdownMenuItem disabled={loading}>
                <Printer size={16} className="mr-2" />
                {loading ? 'Génération...' : 'Télécharger PDF'}
              </DropdownMenuItem>
            )}
          </PDFDownloadLink>

          <DropdownMenuItem onClick={() => setShowEmailModal(true)}>
            <Mail size={16} className="mr-2" />
            Envoyer par email
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={onEdit}>
            <Edit size={16} className="mr-2" />
            Modifier
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onDuplicate}>
            <Copy size={16} className="mr-2" />
            Dupliquer
          </DropdownMenuItem>

          {canConvert && (
            <DropdownMenuItem onClick={onConvert} className="text-primary">
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le devis</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le devis {quote.numero} ?
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

      <EmailModal
        open={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        document={{
          id: quote.id,
          number: quote.numero,
          client: quote.clientNom,
          type: 'Devis'
        }}
        onSend={handleEmailSent}
      />
    </>
  );
}
