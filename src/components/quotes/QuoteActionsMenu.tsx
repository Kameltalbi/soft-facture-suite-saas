
import { useState } from 'react';
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
import { MoreHorizontal, Eye, Printer, Mail, Edit, Copy, ArrowRight, Trash, FileText, CheckCircle } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { EmailModal } from '@/components/modals/EmailModal';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface Quote {
  id: string;
  number: string;
  client: string;
  amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil: string;
}

interface QuoteActionsMenuProps {
  quote: Quote;
  pdfComponent: React.ReactNode;
  onView: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onConvertToInvoice: () => void;
  onStatusChange: (status: Quote['status']) => void;
  onDelete: () => void;
  onEmailSent: (emailData: any) => void;
}

const statusLabels = {
  draft: { label: 'Brouillon', variant: 'secondary' as const },
  sent: { label: 'Envoyé', variant: 'default' as const },
  accepted: { label: 'Accepté', variant: 'default' as const },
  rejected: { label: 'Refusé', variant: 'destructive' as const },
  expired: { label: 'Expiré', variant: 'secondary' as const }
};

export function QuoteActionsMenu({
  quote,
  pdfComponent,
  onView,
  onEdit,
  onDuplicate,
  onConvertToInvoice,
  onStatusChange,
  onDelete,
  onEmailSent
}: QuoteActionsMenuProps) {
  const { organization } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const [converting, setConverting] = useState(false);

  const canEdit = quote.status === 'draft' || quote.status === 'sent';
  const canConvertToInvoice = quote.status === 'accepted';
  const isExpired = new Date(quote.validUntil) < new Date();

  const handleDelete = () => {
    onDelete();
    setShowDeleteDialog(false);
  };

  const handleStatusChange = (newStatus: Quote['status']) => {
    onStatusChange(newStatus);
  };

  const handleEmailSent = (emailData: any) => {
    onEmailSent(emailData);
    setShowEmailModal(false);
  };

  const handleConvertToInvoice = async () => {
    if (!organization?.id) {
      toast({
        title: "Erreur",
        description: "Organisation non trouvée",
        variant: "destructive"
      });
      return;
    }

    try {
      setConverting(true);

      // Récupérer les données complètes du devis
      const { data: quoteData, error: quoteError } = await supabase
        .from('quotes')
        .select(`
          *,
          clients(*),
          quote_items(*)
        `)
        .eq('id', quote.id)
        .single();

      if (quoteError) throw quoteError;

      // Générer le numéro de facture
      const invoiceNumber = `FAC-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;

      // Créer la facture
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoiceNumber,
          date: new Date().toISOString().split('T')[0],
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 jours
          client_id: quoteData.client_id,
          organization_id: organization.id,
          status: 'draft',
          subtotal: quoteData.subtotal,
          tax_amount: quoteData.tax_amount,
          total_amount: quoteData.total_amount,
          notes: `Facture créée à partir du devis ${quoteData.quote_number}`
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Créer les éléments de facture à partir des éléments du devis
      if (quoteData.quote_items && quoteData.quote_items.length > 0) {
        const invoiceItems = quoteData.quote_items.map(item => ({
          invoice_id: invoiceData.id,
          organization_id: organization.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          tax_rate: item.tax_rate,
          total_price: item.total_price,
          product_id: item.product_id
        }));

        const { error: itemsError } = await supabase
          .from('invoice_items')
          .insert(invoiceItems);

        if (itemsError) throw itemsError;
      }

      // Supprimer le devis converti (au lieu de le marquer comme accepté)
      const { error: deleteError } = await supabase
        .from('quotes')
        .delete()
        .eq('id', quote.id);

      if (deleteError) throw deleteError;

      // Rafraîchir les listes
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });

      toast({
        title: "Succès",
        description: `Le devis ${quote.number} a été converti en facture ${invoiceNumber} et retiré de la liste des devis`,
      });

      setShowConvertDialog(false);
      onConvertToInvoice();

    } catch (error) {
      console.error('Erreur lors de la conversion:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la conversion du devis en facture",
        variant: "destructive"
      });
    } finally {
      setConverting(false);
    }
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
            Voir le devis
          </DropdownMenuItem>

          <PDFDownloadLink
            document={pdfComponent as any}
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
            Modifier le devis
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onDuplicate}>
            <Copy size={16} className="mr-2" />
            Dupliquer
          </DropdownMenuItem>

          {canConvertToInvoice && (
            <DropdownMenuItem 
              onClick={() => setShowConvertDialog(true)} 
              className="text-primary"
            >
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
            <DropdownMenuSubContent className="bg-white border shadow-lg">
              {Object.entries(statusLabels).map(([status, { label }]) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => handleStatusChange(status as Quote['status'])}
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

      {/* Convert to Invoice Confirmation Dialog */}
      <AlertDialog open={showConvertDialog} onOpenChange={setShowConvertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Convertir en facture</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir convertir le devis {quote.number} en facture ?
              Une nouvelle facture sera créée et le devis sera retiré de cette liste.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={converting}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConvertToInvoice}
              disabled={converting}
              className="bg-primary hover:bg-primary/90"
            >
              {converting ? 'Conversion...' : 'Convertir'}
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
