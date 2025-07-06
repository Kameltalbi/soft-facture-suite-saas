
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Save } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import { toast } from 'sonner';

interface ClientModalProps {
  open: boolean;
  onClose: () => void;
  client?: any;
}

export function ClientModal({ open, onClose, client }: ClientModalProps) {
  const { createClient, updateClient } = useClients();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: 'Tunisie',
    vat_number: '',
    payment_terms: 30,
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        company: client.company || '',
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || '',
        city: client.city || '',
        postal_code: client.postal_code || '',
        country: client.country || 'Tunisie',
        vat_number: client.vat_number || '',
        payment_terms: client.payment_terms || 30,
        status: client.status || 'active'
      });
    } else {
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postal_code: '',
        country: 'Tunisie',
        vat_number: '',
        payment_terms: 30,
        status: 'active'
      });
    }
  }, [client, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Le nom du client est requis');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('L\'email du client est requis');
      return;
    }

    try {
      setLoading(true);
      console.log('Données du client à sauvegarder:', formData);
      
      let result;
      if (client) {
        result = await updateClient(client.id, formData);
      } else {
        result = await createClient(formData);
      }
      
      if (result.error) {
        toast.error(`Erreur: ${result.error}`);
      } else {
        toast.success(client ? 'Client modifié avec succès' : 'Client créé avec succès');
        onClose();
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du client:', error);
      toast.error('Une erreur est survenue lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const paymentTermsOptions = [
    { value: 0, label: 'Comptant' },
    { value: 15, label: '15 jours' },
    { value: 30, label: '30 jours' },
    { value: 45, label: '45 jours' },
    { value: 60, label: '60 jours' }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {client ? 'Modifier le client' : 'Nouveau client'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Informations personnelles</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nom du contact *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ahmed Ben Ali"
                  required
                />
              </div>

              <div>
                <Label htmlFor="company">Entreprise</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  placeholder="Nom de l'entreprise"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="contact@entreprise.tn"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+216 20 123 456"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Adresse</h3>
            
            <div>
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Avenue Habib Bourguiba"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="postal_code">Code postal</Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                  placeholder="1000"
                />
              </div>

              <div>
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  placeholder="Tunis"
                />
              </div>

              <div>
                <Label htmlFor="country">Pays</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  placeholder="Tunisie"
                />
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Informations commerciales</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vat_number">Matricule Fiscale</Label>
                <Input
                  id="vat_number"
                  value={formData.vat_number}
                  onChange={(e) => setFormData({...formData, vat_number: e.target.value})}
                  placeholder="1234567/A/M/000"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Optionnel - matricule fiscal du client
                </p>
              </div>

              <div>
                <Label htmlFor="payment_terms">Conditions de paiement</Label>
                <Select 
                  value={formData.payment_terms.toString()} 
                  onValueChange={(value) => setFormData({...formData, payment_terms: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentTermsOptions.map(option => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-neutral-50">
              <div>
                <Label htmlFor="status" className="text-sm font-medium">
                  Client actif
                </Label>
                <p className="text-xs text-neutral-500">
                  Les clients inactifs n'apparaissent pas dans les listes de sélection
                </p>
              </div>
              <Switch
                id="status"
                checked={formData.status === 'active'}
                onCheckedChange={(checked) => setFormData({...formData, status: checked ? 'active' : 'inactive'})}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
              <Save size={16} className="mr-2" />
              {loading ? 'Sauvegarde...' : (client ? 'Modifier' : 'Créer')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
