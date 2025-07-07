
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Send } from 'lucide-react';

interface EmailModalProps {
  open: boolean;
  onClose: () => void;
  document: {
    id: string;
    number: string;
    client: string;
    type?: string;
  };
  onSend: (emailData: any) => void;
}

export function EmailModal({ open, onClose, document, onSend }: EmailModalProps) {
  const [emailData, setEmailData] = useState({
    to: 'client@exemple.com', // Should be fetched from client data
    subject: `${document.type || 'Facture'} ${document.number}`,
    message: `Bonjour,

Veuillez trouver ci-joint votre ${document.type?.toLowerCase() || 'facture'} ${document.number}.

Nous vous remercions pour votre confiance.

Cordialement,
L'équipe Soft Facture`
  });

  const handleSend = () => {
    onSend({
      ...emailData,
      documentId: document.id,
      attachPdf: true
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail size={20} />
            Envoyer par email
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-neutral-50 p-3 rounded-lg">
            <p className="text-sm text-neutral-600">Document: {document.number}</p>
            <p className="text-sm">Client: {document.client}</p>
            <p className="text-xs text-neutral-500 mt-1">📎 Le PDF sera automatiquement joint à l'email</p>
          </div>

          <div>
            <Label htmlFor="to">Destinataire *</Label>
            <Input
              id="to"
              type="email"
              placeholder="email@client.com"
              value={emailData.to}
              onChange={(e) => setEmailData({...emailData, to: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="subject">Référence *</Label>
            <Input
              id="subject"
              value={emailData.subject}
              onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              rows={8}
              value={emailData.message}
              onChange={(e) => setEmailData({...emailData, message: e.target.value})}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSend} className="bg-primary hover:bg-primary/90">
            <Send size={16} className="mr-2" />
            Envoyer avec PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
