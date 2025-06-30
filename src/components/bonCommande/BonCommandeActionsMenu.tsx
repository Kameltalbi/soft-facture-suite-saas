
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
import { BonCommandePDF } from '@/components/pdf/BonCommandePDF';
import { EmailModal } from '@/components/modals/EmailModal';
import { BonCommandeFournisseur } from '@/types/bonCommande';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useSettings';
import { useCurrency } from '@/contexts/CurrencyContext';

interface BonCommandeActionsMenuProps {
  bonCommande: BonCommandeFournisseur;
  onView: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onConvertToDelivery: () => void;
  onStatusChange: (status: BonCommandeFournisseur['statut']) => void;
  onDelete: () => void;
  onEmailSent: (emailData: any) => void;
}

const statusLabels = {
  brouillon: { label: 'Brouillon', variant: 'secondary' as const },
  en_attente: { label: 'En attente', variant: 'default' as const },
  validee: { label: 'Validée', variant: 'default' as const },
  livree: { label: 'Livrée', variant: 'default' as const },
  annulee: { label: 'Annulée', variant: 'destructive' as const }
};

export function BonCommandeActionsMenu({
  bonCommande,
  onView,
  onEdit,
  onDuplicate,
  onConvertToDelivery,
  onStatusChange,
  onDelete,
  onEmailSent
}: BonCommandeActionsMenuProps) {
  const { user, organization } = useAuth();
  const { globalSettings } = useSettings();
  const { currency } = useCurrency();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const canEdit = bonCommande.statut === 'brouillon' || bonCommande.statut === 'en_attente';
  const canConvertToDelivery = bonCommande.statut === 'validee';

  const handleDelete = () => {
    onDelete();
    setShowDeleteDialog(false);
  };

  const handleStatusChange = (newStatus: BonCommandeFournisseur['statut']) => {
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

  // Prepare settings for PDF
  const settings = {
    showVat: true,
    showDiscount: false,
    currency: currency.code,
    amountInWords: true,
    purchase_order_template: globalSettings?.quote_template || 'classic',
    unified_template: globalSettings?.unified_template || 'classic',    
    use_unified_template: globalSettings?.use_unified_template || false
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
          <DropdownMenuItem onClick={onView}>
            <Eye size={16} className="mr-2" />
            Voir le bon de commande
          </DropdownMenuItem>

          <PDFDownloadLink
            document={
              <BonCommandePDF 
                bonCommande={bonCommande}
                company={company}
                settings={settings}
              />
            }
            fileName={`${bonCommande.numero}.pdf`}
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

          {canConvertToDelivery && (
            <DropdownMenuItem onClick={onConvertToDelivery} className="text-primary">
              <Package size={16} className="mr-2" />
              Convertir en bon de livraison
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <CheckCircle size={16} className="mr-2" />
              Changer le statut
              <Badge variant={statusLabels[bonCommande.statut].variant} className="ml-auto text-xs">
                {statusLabels[bonCommande.statut].label}
              </Badge>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {Object.entries(statusLabels).map(([status, { label }]) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => handleStatusChange(status as BonCommandeFournisseur['statut'])}
                  disabled={bonCommande.statut === status}
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
