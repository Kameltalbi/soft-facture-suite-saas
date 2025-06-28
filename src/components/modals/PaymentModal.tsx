
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Save } from 'lucide-react';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  invoice: {
    id: string;
    invoice_number: string;
    amount_total: number;
    amount_paid?: number;
  } | null;
  onPaymentRecorded: () => void;
}

export function PaymentModal({ open, onClose, invoice, onPaymentRecorded }: PaymentModalProps) {
  if (!invoice) return null;
  
  const remainingAmount = invoice.amount_total - (invoice.amount_paid || 0);

  const [paymentData, setPaymentData] = useState({
    amount: remainingAmount,
    date: new Date().toISOString().split('T')[0],
    method: 'virement',
    reference: '',
    notes: ''
  });

  const handleSave = () => {
    // Simulate saving payment
    console.log('Saving payment:', { ...paymentData, invoiceId: invoice.id });
    onPaymentRecorded();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard size={20} />
            Enregistrer un paiement
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-neutral-50 p-3 rounded-lg">
            <p className="text-sm text-neutral-600">Facture: {invoice.invoice_number}</p>
            <p className="text-sm">
              Montant total: <span className="font-semibold">{invoice.amount_total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
            </p>
            <p className="text-sm">
              Montant restant: <span className="font-semibold text-primary">{remainingAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Montant payé *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                max={remainingAmount}
                value={paymentData.amount}
                onChange={(e) => setPaymentData({...paymentData, amount: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="date">Date de paiement *</Label>
              <Input
                id="date"
                type="date"
                value={paymentData.date}
                onChange={(e) => setPaymentData({...paymentData, date: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="method">Mode de paiement *</Label>
            <Select value={paymentData.method} onValueChange={(value) => setPaymentData({...paymentData, method: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="virement">Virement bancaire</SelectItem>
                <SelectItem value="cheque">Chèque</SelectItem>
                <SelectItem value="especes">Espèces</SelectItem>
                <SelectItem value="carte">Carte bancaire</SelectItem>
                <SelectItem value="prelevement">Prélèvement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="reference">Référence</Label>
            <Input
              id="reference"
              placeholder="Numéro de transaction, chèque..."
              value={paymentData.reference}
              onChange={(e) => setPaymentData({...paymentData, reference: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              placeholder="Notes additionnelles..."
              value={paymentData.notes}
              onChange={(e) => setPaymentData({...paymentData, notes: e.target.value})}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            <Save size={16} className="mr-2" />
            Enregistrer le paiement
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
