
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Quote } from '@/types/quote';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote?: Quote | null;
  onSave: (data: Partial<Quote>) => void;
}

export function QuoteModal({ isOpen, onClose, quote, onSave }: QuoteModalProps) {
  const [formData, setFormData] = useState({
    clientNom: '',
    objet: '',
    remarques: '',
    dateValidite: ''
  });

  useEffect(() => {
    if (quote) {
      setFormData({
        clientNom: quote.clientNom,
        objet: quote.objet,
        remarques: quote.remarques,
        dateValidite: quote.dateValidite
      });
    } else {
      setFormData({
        clientNom: '',
        objet: '',
        remarques: '',
        dateValidite: ''
      });
    }
  }, [quote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {quote ? 'Modifier le devis' : 'Créer un nouveau devis'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientNom">Client</Label>
              <Input
                id="clientNom"
                value={formData.clientNom}
                onChange={(e) => setFormData(prev => ({ ...prev, clientNom: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="dateValidite">Date de validité</Label>
              <Input
                id="dateValidite"
                type="date"
                value={formData.dateValidite}
                onChange={(e) => setFormData(prev => ({ ...prev, dateValidite: e.target.value }))}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="objet">Objet</Label>
            <Input
              id="objet"
              value={formData.objet}
              onChange={(e) => setFormData(prev => ({ ...prev, objet: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="remarques">Remarques</Label>
            <Textarea
              id="remarques"
              value={formData.remarques}
              onChange={(e) => setFormData(prev => ({ ...prev, remarques: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-[#6A9C89] hover:bg-[#5A8B7A]">
              {quote ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
