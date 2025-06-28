
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Organization {
  id: string;
  name: string;
  subscription_start: string;
  subscription_end: string | null;
}

interface SubscriptionEditModalProps {
  organization: Organization | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export function SubscriptionEditModal({ 
  organization, 
  isOpen, 
  onClose, 
  onRefresh 
}: SubscriptionEditModalProps) {
  const [subscriptionStart, setSubscriptionStart] = useState('');
  const [subscriptionEnd, setSubscriptionEnd] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Initialize form when organization changes
  useEffect(() => {
    if (organization) {
      setSubscriptionStart(organization.subscription_start || '');
      setSubscriptionEnd(organization.subscription_end || '');
    }
  }, [organization]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          subscription_start: subscriptionStart,
          subscription_end: subscriptionEnd || null,
          updated_by: user?.id
        })
        .eq('id', organization.id);

      if (error) throw error;

      // Log the action
      await supabase
        .from('organization_history')
        .insert({
          organization_id: organization.id,
          action: 'subscription_dates_updated',
          details: {
            subscription_start: subscriptionStart,
            subscription_end: subscriptionEnd
          },
          performed_by: user?.id
        });

      toast({
        title: "Succès",
        description: "Dates d'abonnement mises à jour avec succès"
      });

      onRefresh();
      onClose();
    } catch (error) {
      console.error('Error updating subscription dates:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les dates d'abonnement",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier les dates d'abonnement - {organization?.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="subscription_start">Date de début</Label>
            <Input
              id="subscription_start"
              type="date"
              value={subscriptionStart}
              onChange={(e) => setSubscriptionStart(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="subscription_end">Date de fin</Label>
            <Input
              id="subscription_end"
              type="date"
              value={subscriptionEnd}
              onChange={(e) => setSubscriptionEnd(e.target.value)}
            />
            <p className="text-sm text-neutral-500 mt-1">
              Laissez vide pour un abonnement illimité
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Mise à jour...' : 'Sauvegarder'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
