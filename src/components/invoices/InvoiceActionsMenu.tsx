
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
  CheckCircle, 
  Printer, 
  Mail, 
  Repeat, 
  CreditCard, 
  Edit, 
  Trash2,
  PenTool
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
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'partially_paid' | 'validated';
    is_signed?: boolean;
  };
  pdfComponent: React.ReactElement;
  onValidate: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onPaymentRecorded: (paymentData: any) => void;
  onEmailSent: (emailData: any) => void;
  onSign: () => void;
  hasSignature: boolean;
}

export function InvoiceActionsMenu({
  invoice,
  pdfComponent,
  onValidate,
  onEdit,
  onDuplicate,
  onDelete,
  onPaymentRecorded,
  onEmailSent,
  onSign,
  hasSignature
}: InvoiceActionsMenuProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isFullyPaid = invoice.status === 'paid' || (invoice.paidAmount && invoice.paidAmount >= invoice.amount);
  const canRecordPayment = !isFullyPaid;
  const canValidate = invoice.status === 'draft' || invoice.status === 'sent';
  const canModify = invoice.status === 'draft';
  const canSign = hasSignature && invoice.status !== 'draft';
  const isSigned = invoice.is_signed;

  // Debug logs pour diagnostiquer le problème de signature
  console.log('🔍 Debug signature:', {
    hasSignature,
    invoiceStatus: invoice.status,
    canSign,
    isSigned,
    invoiceId: invoice.id
  });

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
          {canValidate && (
            <DropdownMenuItem onClick={onValidate}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Valider
            </DropdownMenuItem>
          )}
          
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

          {canSign && (
            <DropdownMenuItem 
              onClick={onSign}
              disabled={isSigned}
              className={isSigned ? "text-muted-foreground" : "text-primary"}
            >
              <PenTool className="mr-2 h-4 w-4" />
              {isSigned ? 'Signée' : 'Signer'}
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {canRecordPayment && (
            <DropdownMenuItem onClick={() => setShowPaymentModal(true)}>
              <CreditCard className="mr-2 h-4 w-4" />
              Enregistrer un paiement
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
