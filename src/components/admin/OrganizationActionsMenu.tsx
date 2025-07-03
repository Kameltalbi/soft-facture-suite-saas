
import { useState } from 'react';
import { MoreHorizontal, Edit, Pause, Play, Check, Calendar, CalendarDays, ArrowUp, History, Users, Trash2, CalendarX } from 'lucide-react';
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
  onRefresh: () => void;
}

export function OrganizationActionsMenu({ 
  organization, 
  onEdit, 
  onEditSubscription,
  onViewUsers, 
  onViewHistory, 
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

  const handleDelete = async () => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'organisation "${organization.name}" ? Cette action est irréversible.`)) {
      try {
        const { error } = await supabase
          .from('organizations')
          .delete()
          .eq('id', organization.id);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Organisation supprimée avec succès"
        });
        
        onRefresh();
      } catch (error) {
        console.error('Error deleting organization:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'organisation",
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
