import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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
  CheckCircle 
} from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { TemplatedInvoicePDF } from '@/components/pdf/TemplatedInvoicePDF';
import { EmailModal } from '@/components/modals/EmailModal';
import { useAuth } from '@/hooks/useAuth';

export interface QuoteForActions {
  id: string;
  number: string;
  client: string;
  amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil: string;
}

interface QuoteActionsMenuProps {
  quote: QuoteForActions;
  pdfComponent: React.ReactElement;
  onView: () => void;
  onEdit: () => void;
  onConvertToInvoice: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onStatusChange: (status: string) => void;
  onEmailSent: (emailData: any) => void;
}

const statusLabels = {
  draft: { label: 'Brouillon', variant: 'secondary' as const },
  sent: { label: 'Envoyé', variant: 'default' as const },
  accepted: { label: 'Accepté', variant: 'default' as const },
  rejected: { label: 'Refusé', variant: 'destructive' as const },
  expired: { label: 'Expiré', variant: 'destructive' as const }
};

export function QuoteActionsMenu({
  quote,
  pdfComponent,
  onView,
  onEdit,
  onConvertToInvoice,
  onDuplicate,
  onDelete,
  onStatusChange,
  onEmailSent
}: QuoteActionsMenuProps) {
  const { user, organization } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const canEdit = quote.status === 'draft';
  const canConvertToInvoice = quote.status === 'accepted';

  const handleDelete = () => {
    onDelete();
    setShowDeleteDialog(false);
  };

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(newStatus);
  };

  const handleEmailSent = (emailData: any) => {
    onEmailSent(emailData);
    setShowEmailModal(false);
  };

  // Prepare company data from organization and user
  const company = {
    name: organization?.name || user?.user_metadata?.company_name || 'Mon Entreprise',
    logo: organization?.logo_url || user?.user_metadata?.avatar_url,
    address: organization?.address || user?.user_metadata?.company_address,
    email: organization?.email || user?.email,
    phone: organization?.phone || user?.user_metadata?.company_phone,
  };

  // Create enhanced PDF component with company data
  const enhancedPdfComponent = React.cloneElement(pdfComponent, { company });

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
            document={enhancedPdfComponent}
            fileName={`${quote.number}.pdf`}
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

          <DropdownMenuItem onClick={onEdit} disabled={!canEdit}>
            <Edit size={16} className="mr-2" />
            Modifier
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onDuplicate}>
            <Copy size={16} className="mr-2" />
            Dupliquer
          </DropdownMenuItem>

          {canConvertToInvoice && (
            <DropdownMenuItem onClick={onConvertToInvoice} className="text-primary">
              <ArrowRight size={16} className="mr-2" />
              Convertir en facture
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <CheckCircle size={16} className="mr-2" />
              Changer le statut
              <Badge variant={statusLabels[quote.status].variant} className="ml-auto text-xs">
                {statusLabels[quote.status].label}
              </Badge>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {Object.entries(statusLabels).map(([status, { label }]) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={quote.status === status}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

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
            <AlertDialogTitle>Supprimer le devis</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le devis {quote.number} ?
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
          id: quote.id,
          number: quote.number,
          client: quote.client,
          type: 'Devis'
        }}
        onSend={handleEmailSent}
      />
    </>
  );
}
