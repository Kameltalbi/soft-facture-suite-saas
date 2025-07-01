
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
  Download, 
  Mail, 
  CreditCard, 
  Edit, 
  CheckCircle,
  Plus
} from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PaymentModal } from '@/components/modals/PaymentModal';
import { EmailModal } from '@/components/modals/EmailModal';
import { CreateAvoirModal } from '@/components/modals/CreateAvoirModal';

interface InvoiceActionsMenuProps {
  invoice: {
    id: string;
    number: string;
    client: string;
    amount: number;
    paidAmount?: number;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'partially_paid' | 'validated';
  };
  pdfComponent: React.ReactElement;
  onView: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onMarkAsSent: () => void;
  onMarkAsValidated: () => void;
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
  onMarkAsValidated,
  onDelete,
  onPaymentRecorded,
  onEmailSent
}: InvoiceActionsMenuProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showAvoirModal, setShowAvoirModal] = useState(false);

  const isFullyPaid = invoice.status === 'paid' || (invoice.paidAmount && invoice.paidAmount >= invoice.amount);
  const canRecordPayment = !isFullyPaid;
  const canValidate = invoice.status === 'draft';
  const canModify = invoice.status === 'draft';
  const isValidated = invoice.status !== 'draft';

  const handlePaymentSave = (paymentData: any) => {
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

  const handleAvoirCreate = (avoirData: any) => {
    console.log('Creating avoir:', avoirData);
    setShowAvoirModal(false);
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
          {/* 1. Modifier */}
          <DropdownMenuItem 
            onClick={onEdit}
            disabled={!canModify}
          >
            <Edit className="mr-2 h-4 w-4" />
            Modifier
            {!canModify && <span className="ml-auto text-xs text-muted-foreground">(Verrouillée)</span>}
          </DropdownMenuItem>

          {/* 2. Valider */}
          {canValidate && (
            <DropdownMenuItem onClick={onMarkAsValidated}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Valider
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {/* 3. Envoyer par email */}
          <DropdownMenuItem onClick={() => setShowEmailModal(true)}>
            <Mail className="mr-2 h-4 w-4" />
            Envoyer par email
          </DropdownMenuItem>

          {/* 4. Ajouter un paiement */}
          {canRecordPayment && (
            <DropdownMenuItem onClick={() => setShowPaymentModal(true)}>
              <CreditCard className="mr-2 h-4 w-4" />
              Ajouter un paiement
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {/* 5. Télécharger le PDF */}
          <PDFDownloadLink
            document={pdfComponent}
            fileName={`${invoice.number}.pdf`}
          >
            {({ loading }) => (
              <DropdownMenuItem disabled={loading}>
                <Download className="mr-2 h-4 w-4" />
                {loading ? 'Génération...' : 'Télécharger le PDF'}
              </DropdownMenuItem>
            )}
          </PDFDownloadLink>

          {/* 6. Créer un avoir */}
          {isValidated && (
            <DropdownMenuItem onClick={() => setShowAvoirModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Créer un avoir
            </DropdownMenuItem>
          )}
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

      {/* Avoir Modal */}
      <CreateAvoirModal
        open={showAvoirModal}
        onClose={() => setShowAvoirModal(false)}
        invoice={invoice}
        onSave={handleAvoirCreate}
      />
    </>
  );
}
