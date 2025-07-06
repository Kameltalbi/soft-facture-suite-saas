
import { useState } from 'react';
import { MoreHorizontal, Edit, Pause, Play, Check, Calendar, CalendarDays, ArrowUp, ArrowDown, History, Users, Trash2, CalendarX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Organization } from '@/types/organization';

interface OrganizationActionsMenuProps {
  organization: Organization;
  onEdit: (org: Organization) => void;
  onEditSubscription: (org: Organization) => void;
  onViewUsers: (org: Organization) => void;
  onViewHistory: (org: Organization) => void;
  onActivate: (orgId: string) => void;
  onRefresh: () => void;
}

export function OrganizationActionsMenu({ 
  organization, 
  onEdit, 
  onEditSubscription,
  onViewUsers, 
  onViewHistory, 
  onActivate,
  onRefresh 
}: OrganizationActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Log action to history
  const logAction = async (orgId: string, action: string, details: any = {}) => {
    try {
      await supabase
        .from('organization_history')
        .insert({
          organization_id: orgId,
          action,
          details,
          performed_by: user?.id
        });
    } catch (error) {
      console.error('Error logging action:', error);
    }
  };

  // Update organization
  const updateOrganization = async (orgId: string, updates: Partial<Organization>) => {
    try {
      const { error } = await supabase
        .from('organizations')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', orgId);

      if (error) throw error;
      
      await logAction(orgId, 'organization_updated', updates);
      onRefresh();
      
      toast({
        title: "Succès",
        description: "Organisation mise à jour avec succès"
      });
    } catch (error) {
      console.error('Error updating organization:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'organisation",
        variant: "destructive"
      });
    }
  };

  const handleSuspend = async () => {
    const newStatus = organization.status === 'suspended' ? 'active' : 'suspended';
    await updateOrganization(organization.id, { status: newStatus });
    setIsOpen(false);
  };

  const handleValidatePayment = async () => {
    await updateOrganization(organization.id, { status: 'active' });
    await logAction(organization.id, 'payment_validated');
    setIsOpen(false);
  };

  const handleExtendSubscription = async () => {
    try {
      const { error } = await supabase.rpc('extend_subscription', {
        org_id: organization.id,
        months: 3
      });

      if (error) throw error;

      await logAction(organization.id, 'subscription_extended', { months: 3 });
      onRefresh();
      
      toast({
        title: "Succès",
        description: "Abonnement prolongé de 3 mois"
      });
    } catch (error) {
      console.error('Error extending subscription:', error);
      toast({
        title: "Erreur",
        description: "Impossible de prolonger l'abonnement",
        variant: "destructive"
      });
    }
    setIsOpen(false);
  };

  const handleAbrogateSubscription = async () => {
    if (confirm(`Êtes-vous sûr de vouloir abroger l'abonnement de "${organization.name}" ? L'abonnement sera terminé aujourd'hui.`)) {
      try {
        const today = new Date().toISOString().split('T')[0];
        await updateOrganization(organization.id, { 
          subscription_end: today,
          status: 'suspended'
        });
        await logAction(organization.id, 'subscription_abrogated');
      } catch (error) {
        console.error('Error abrogating subscription:', error);
      }
    }
    setIsOpen(false);
  };

  const handleUpgrade = async () => {
    const planHierarchy: Record<string, 'essential' | 'pro'> = { 
      essential: 'pro', 
      pro: 'pro' 
    };
    const newPlan = planHierarchy[organization.plan];
    
    if (newPlan !== organization.plan) {
      await updateOrganization(organization.id, { plan: newPlan });
      await logAction(organization.id, 'plan_upgraded', { from: organization.plan, to: newPlan });
    }
    setIsOpen(false);
  };

  const handleDowngrade = async () => {
    if (confirm(`Êtes-vous sûr de vouloir rétrograder l'organisation "${organization.name}" vers le plan Essential ? Cette action supprimera automatiquement les collaborateurs en excès.`)) {
      try {
        // D'abord, récupérer les utilisateurs de l'organisation
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .eq('organization_id', organization.id)
          .order('created_at', { ascending: true }); // Le plus ancien reste

        if (profilesError) throw profilesError;

        // Le plan Essential autorise seulement 1 utilisateur
        const maxUsers = 1;
        
        if (profiles && profiles.length > maxUsers) {
          // Garder le plus ancien utilisateur (premier créé) et supprimer les autres
          const usersToDelete = profiles.slice(maxUsers);
          
          for (const userToDelete of usersToDelete) {
            const { error: deleteError } = await supabase
              .from('profiles')
              .delete()
              .eq('id', userToDelete.id);

            if (deleteError) {
              console.error('Erreur lors de la suppression d\'un utilisateur:', deleteError);
            }
          }

          toast({
            title: "Information",
            description: `${usersToDelete.length} collaborateur(s) supprimé(s) automatiquement`
          });
        }

        // Ensuite, changer le plan
        await updateOrganization(organization.id, { plan: 'essential' });
        await logAction(organization.id, 'plan_downgraded', { 
          from: organization.plan, 
          to: 'essential',
          users_removed: profiles ? Math.max(0, profiles.length - maxUsers) : 0
        });

        toast({
          title: "Succès",
          description: "Organisation rétrogradée vers le plan Essential"
        });
      } catch (error) {
        console.error('Error downgrading organization:', error);
        toast({
          title: "Erreur",
          description: "Impossible de rétrograder l'organisation",
          variant: "destructive"
        });
      }
    }
    setIsOpen(false);
  };

  const handleDelete = async () => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'organisation "${organization.name}" ? Cette action supprimera TOUTES les données associées (utilisateurs, factures, clients, etc.). Cette action est irréversible.`)) {
      try {
        const orgId = organization.id;
        
        console.log('=== DÉBUT SUPPRESSION ORGANISATION ===');
        console.log('Organisation ID:', orgId);
        console.log('Organisation Name:', organization.name);
        
        // 1. Supprimer les éléments de documents
        console.log('🔄 Suppression des éléments de documents...');
        await supabase.from('invoice_items').delete().eq('organization_id', orgId);
        await supabase.from('quote_items').delete().eq('organization_id', orgId);
        await supabase.from('credit_note_items').delete().eq('organization_id', orgId);
        await supabase.from('delivery_note_items').delete().eq('organization_id', orgId);
        await supabase.from('purchase_order_items').delete().eq('organization_id', orgId);
        console.log('✅ Éléments de documents supprimés');
        
        // 2. CRITIQUE: Supprimer les paiements AVANT les factures
        console.log('🔄 Suppression des paiements...');
        const { data: paymentsToDelete } = await supabase
          .from('payments')
          .select('id')
          .eq('organization_id', orgId);
        console.log(`📊 ${paymentsToDelete?.length || 0} paiements trouvés`);
        
        const { error: paymentsError, count: paymentsCount } = await supabase
          .from('payments')
          .delete({ count: 'exact' })
          .eq('organization_id', orgId);
        
        if (paymentsError) {
          console.error('❌ Erreur suppression paiements:', paymentsError);
          throw new Error(`Impossible de supprimer les paiements: ${paymentsError.message}`);
        }
        console.log(`✅ ${paymentsCount || 0} paiements supprimés`);
        
        // 3. Vérification que les paiements ont été supprimés
        const { data: remainingPayments } = await supabase
          .from('payments')
          .select('id')
          .eq('organization_id', orgId);
        
        if ((remainingPayments?.length || 0) > 0) {
          console.error('🚨 ERREUR: Il reste des paiements après suppression!', remainingPayments);
          throw new Error(`Il reste ${remainingPayments?.length} paiements non supprimés`);
        }
        
        // 4. Supprimer les mouvements de stock
        console.log('🔄 Suppression des mouvements de stock...');
        await supabase.from('stock_movements').delete().eq('organization_id', orgId);
        
        // 5. Supprimer les documents
        console.log('🔄 Suppression des documents...');
        await supabase.from('invoices').delete().eq('organization_id', orgId);
        await supabase.from('quotes').delete().eq('organization_id', orgId);
        await supabase.from('credit_notes').delete().eq('organization_id', orgId);
        await supabase.from('delivery_notes').delete().eq('organization_id', orgId);
        await supabase.from('purchase_orders').delete().eq('organization_id', orgId);
        console.log('✅ Documents supprimés');
        
        // 6. Supprimer les autres données
        console.log('🔄 Suppression des données de base...');
        await supabase.from('products').delete().eq('organization_id', orgId);
        await supabase.from('clients').delete().eq('organization_id', orgId);
        await supabase.from('categories').delete().eq('organization_id', orgId);
        console.log('✅ Données de base supprimées');
        
        // 7. Supprimer les paramètres
        console.log('🔄 Suppression des paramètres...');
        await supabase.from('currencies').delete().eq('organization_id', orgId);
        await supabase.from('custom_taxes').delete().eq('organization_id', orgId);
        await supabase.from('exchange_rates').delete().eq('organization_id', orgId);
        await supabase.from('global_settings').delete().eq('organization_id', orgId);
        await supabase.from('document_numberings').delete().eq('organization_id', orgId);
        await supabase.from('roles').delete().eq('organization_id', orgId);
        await supabase.from('saved_reports').delete().eq('organization_id', orgId);
        console.log('✅ Paramètres supprimés');
        
        // 8. Supprimer l'historique
        console.log('🔄 Suppression de l\'historique...');
        await supabase.from('organization_history').delete().eq('organization_id', orgId);
        console.log('✅ Historique supprimé');
        
        // 9. Supprimer les profils en dernier
        console.log('🔄 Suppression des profils utilisateurs...');
        const { error: profilesError, count: profilesCount } = await supabase
          .from('profiles')
          .delete({ count: 'exact' })
          .eq('organization_id', orgId);
        
        if (profilesError) {
          console.error('❌ Erreur suppression profils:', profilesError);
          throw new Error(`Impossible de supprimer les profils: ${profilesError.message}`);
        }
        console.log(`✅ ${profilesCount || 0} profils supprimés`);
        
        // 10. Vérification finale des paiements avant suppression organisation
        console.log('🔍 Vérification finale des paiements...');
        const { data: finalPayments } = await supabase
          .from('payments')
          .select('id')
          .eq('organization_id', orgId);
          
        if ((finalPayments?.length || 0) > 0) {
          console.error('🚨 ERREUR CRITIQUE: Il reste des paiements!', finalPayments);
          throw new Error(`Il reste ${finalPayments?.length} paiements non supprimés`);
        }
        
        // 11. Supprimer l'organisation
        console.log('🏢 Suppression finale de l\'organisation...');
        const { error: orgError } = await supabase
          .from('organizations')
          .delete()
          .eq('id', orgId);

        if (orgError) {
          console.error('❌ Erreur suppression organisation:', orgError);
          throw new Error(`Impossible de supprimer l'organisation: ${orgError.message}`);
        }

        console.log('🎉 === SUPPRESSION TERMINÉE AVEC SUCCÈS ===');
        
        toast({
          title: "Succès",
          description: "Organisation et toutes ses données supprimées avec succès"
        });
        
        onRefresh();
      } catch (error) {
        console.error('💥 === ERREUR FATALE SUPPRESSION ===', error);
        toast({
          title: "Erreur",
          description: error instanceof Error ? error.message : "Impossible de supprimer l'organisation",
          variant: "destructive"
        });
      }
    }
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* Actions de consultation */}
        <DropdownMenuItem onClick={() => onViewUsers(organization)} className="cursor-pointer">
          <Users className="h-4 w-4 mr-2" />
          Voir les utilisateurs
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onViewHistory(organization)} className="cursor-pointer">
          <History className="h-4 w-4 mr-2" />
          Voir l'historique
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Actions de modification */}
        <DropdownMenuItem onClick={() => onEdit(organization)} className="cursor-pointer">
          <Edit className="h-4 w-4 mr-2" />
          Modifier l'organisation
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onEditSubscription(organization)} className="cursor-pointer">
          <CalendarDays className="h-4 w-4 mr-2" />
          Modifier les dates
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleSuspend} className="cursor-pointer">
          {organization.status === 'suspended' ? (
            <>
              <Play className="h-4 w-4 mr-2" />
              Réactiver
            </>
          ) : (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Suspendre
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Actions de gestion d'abonnement */}
        {organization.status === 'pending' && (
          <DropdownMenuItem onClick={() => { onActivate(organization.id); setIsOpen(false); }} className="cursor-pointer text-green-600">
            <Check className="h-4 w-4 mr-2" />
            Activer l'organisation
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem onClick={handleValidatePayment} className="cursor-pointer">
          <Check className="h-4 w-4 mr-2" />
          Valider le paiement
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleExtendSubscription} className="cursor-pointer">
          <Calendar className="h-4 w-4 mr-2" />
          Prolonger (3 mois)
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleAbrogateSubscription} className="cursor-pointer text-orange-600">
          <CalendarX className="h-4 w-4 mr-2" />
          Abroger l'abonnement
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleUpgrade} className="cursor-pointer" disabled={organization.plan === 'pro'}>
          <ArrowUp className="h-4 w-4 mr-2" />
          Améliorer le plan
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleDowngrade} className="cursor-pointer" disabled={organization.plan === 'essential'}>
          <ArrowDown className="h-4 w-4 mr-2" />
          Rétrograder le plan
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Action de suppression */}
        <DropdownMenuItem onClick={handleDelete} className="cursor-pointer text-red-600 hover:text-red-700">
          <Trash2 className="h-4 w-4 mr-2" />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
