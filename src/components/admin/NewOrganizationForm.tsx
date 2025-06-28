
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface NewOrganizationFormProps {
  onCreated: () => void;
}

export function NewOrganizationForm({ onCreated }: NewOrganizationFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    subscription_start: new Date().toISOString().split('T')[0], // Today by default
    subscription_end: ''
  });

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('organizations')
        .insert({
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone || null,
          address: formData.address || null,
          subscription_start: formData.subscription_start,
          subscription_end: formData.subscription_end || null,
          status: 'active',
          plan: 'free'
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Organisation créée avec succès"
      });

      setFormData({ 
        name: '', 
        email: '', 
        phone: '', 
        address: '', 
        subscription_start: new Date().toISOString().split('T')[0],
        subscription_end: ''
      });
      setIsOpen(false);
      onCreated();
    } catch (error) {
      console.error('Error creating organization:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'organisation",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Organisation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle organisation</DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle organisation avec ses dates d'abonnement
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nom de l'organisation *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nom de l'organisation"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@organisation.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+33 1 23 45 67 89"
              />
            </div>
            <div>
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Rue de la Paix, Paris"
              />
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Dates d'abonnement</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="subscription_start">Début *</Label>
                  <Input
                    id="subscription_start"
                    type="date"
                    value={formData.subscription_start}
                    onChange={(e) => setFormData({ ...formData, subscription_start: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subscription_end">Fin</Label>
                  <Input
                    id="subscription_end"
                    type="date"
                    value={formData.subscription_end}
                    onChange={(e) => setFormData({ ...formData, subscription_end: e.target.value })}
                  />
                </div>
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Laissez la date de fin vide pour un abonnement illimité
              </p>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Création...' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
