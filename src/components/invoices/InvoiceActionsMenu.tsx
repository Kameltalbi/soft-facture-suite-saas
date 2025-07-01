
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
import { 
  MoreHorizontal, 
  Eye, 
  Printer, 
  Mail, 
  Repeat, 
  CreditCard, 
  Edit, 
  Trash2,
  Send
} from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PaymentModal } from '@/components/modals/PaymentModal';
import { EmailModal } from '@/components/modals/EmailModal';

interface InvoiceActionsMenuProps {
  invoice: {
    id: string;
    number: string;
    client: string;
    amount: number;
    paidAmount?: number;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'partially_paid';
  };
  pdfComponent: React.ReactElement;
  onView: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onMarkAsSent: () => void;
  onDelete: () => void;
  onPaymentRecorded: (paymentData: any) => void;
  onEmailSent: (emailData: any) => void;
}

export function InvoiceActionsMenu({
  invoice,
  pdfComponent,
  onView,
  onEdit,
  onDuplicate,
  onMarkAsSent,
  onDelete,
  onPaymentRecorded,
  onEmailSent
}: InvoiceActionsMenuProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isFullyPaid = invoice.status === 'paid' || (invoice.paidAmount && invoice.paidAmount >= invoice.amount);
  const canRecordPayment = !isFullyPaid;
  const canMarkAsSent = invoice.status === 'draft';
  const canModify = invoice.status === 'draft';

  const handlePaymentSave = (paymentData: any) => {
    // Passer les données avec le montant total de la facture pour la validation
    const paymentDataWithTotal = {
      ...paymentData,
      totalAmount: invoice.amount
    };
    onPaymentRecorded(paymentDataWithTotal);
    setShowPaymentModal(false);
  };

  const handleEmailSend = (emailData: any) => {
    onEmailSent(emailData);
    setShowEmailModal(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Ouvrir le menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={onView}>
            <Eye className="mr-2 h-4 w-4" />
            Aperçu
          </DropdownMenuItem>
          
          <PDFDownloadLink
            document={pdfComponent}
            fileName={`${invoice.number}.pdf`}
          >
            {({ loading }) => (
              <DropdownMenuItem disabled={loading}>
                <Printer className="mr-2 h-4 w-4" />
                {loading ? 'Génération...' : 'Télécharger PDF'}
              </DropdownMenuItem>
            )}
          </PDFDownloadLink>

          <DropdownMenuItem onClick={() => setShowEmailModal(true)}>
            <Mail className="mr-2 h-4 w-4" />
            Envoyer par email
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onDuplicate}>
            <Repeat className="mr-2 h-4 w-4" />
            Dupliquer
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {canRecordPayment && (
            <DropdownMenuItem onClick={() => setShowPaymentModal(true)}>
              <CreditCard className="mr-2 h-4 w-4" />
              Enregistrer un paiement
            </DropdownMenuItem>
          )}

          {canMarkAsSent && (
            <DropdownMenuItem onClick={onMarkAsSent}>
              <Send className="mr-2 h-4 w-4" />
              Marquer comme envoyée
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem 
            onClick={onEdit}
            disabled={!canModify}
          >
            <Edit className="mr-2 h-4 w-4" />
            Modifier
            {!canModify && <span className="ml-auto text-xs text-muted-foreground">(Lecture seule)</span>}
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Payment Modal */}
      <PaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        invoice={invoice}
        onSave={handlePaymentSave}
      />

      {/* Email Modal */}
      <EmailModal
        open={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        document={{
          id: invoice.id,
          number: invoice.number,
          client: invoice.client,
          type: 'Facture'
        }}
        onSend={handleEmailSend}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la facture</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la facture {invoice.number} ?
              Cette action est irréversible.
              {isFullyPaid && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
                  ⚠️ Attention: Cette facture a été payée. La suppression peut affecter votre comptabilité.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
