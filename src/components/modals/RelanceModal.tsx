
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface RelanceModalProps {
  open: boolean;
  onClose: () => void;
  invoice: any;
  onSent: () => void;
}

export function RelanceModal({ open, onClose, invoice, onSent }: RelanceModalProps) {
  const [relanceType, setRelanceType] = useState('email');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');

  const handleSend = () => {
    // Simuler l'envoi de la relance
    console.log('Sending relance:', { invoice, relanceType, message, subject });
    onSent();
  };

  const defaultMessage = `Madame, Monsieur,

Nous constatons que la facture ${invoice?.invoice_number} d'un montant de ${invoice?.amount_total?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })} émise le ${invoice?.date ? new Date(invoice.date).toLocaleDateString('fr-FR') : ''} n'a pas encore été réglée.

Nous vous rappelons que le délai de paiement est désormais dépassé.

Nous vous prions de bien vouloir procéder au règlement dans les plus brefs délais.

En cas de difficultés, n'hésitez pas à nous contacter.

Cordialement,`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Envoyer une relance</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Type de relance</Label>
            <Select value={relanceType} onValueChange={setRelanceType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="courrier">Courrier</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {relanceType === 'email' && (
            <div>
              <Label>Objet</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Relance facture impayée"
              />
            </div>
          )}

          <div>
            <Label>Message</Label>
            <Textarea
              value={message || defaultMessage}
              onChange={(e) => setMessage(e.target.value)}
              rows={10}
              placeholder="Votre message de relance..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleSend}>
              Envoyer la relance
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
