
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CustomTax, CreateCustomTaxData } from '@/types/customTax';
import { useCurrencies } from '@/hooks/useCurrencies';

interface CustomTaxModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CreateCustomTaxData) => Promise<void>;
  editingTax?: CustomTax | null;
}

const documentTypes = [
  { id: 'invoice', label: 'Facture' },
  { id: 'quote', label: 'Bon de commande' },
  { id: 'delivery_note', label: 'Bon de livraison' },
  { id: 'credit', label: 'Avoir' },
];

export function CustomTaxModal({ open, onClose, onSave, editingTax }: CustomTaxModalProps) {
  const { currencies } = useCurrencies();
  const [formData, setFormData] = useState<CreateCustomTaxData>({
    name: editingTax?.name || '',
    type: editingTax?.type || 'percentage',
    value: editingTax?.value || 0,
    currency_id: editingTax?.currency_id || '',
    applicable_documents: editingTax?.applicable_documents || [],
    is_fiscal_stamp: editingTax?.is_fiscal_stamp || false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || formData.value <= 0 || formData.applicable_documents.length === 0) {
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      handleClose();
    } catch (error) {
      // Error handled in parent
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      type: 'percentage',
      value: 0,
      currency_id: '',
      applicable_documents: [],
      is_fiscal_stamp: false,
    });
    onClose();
  };

  const handleDocumentToggle = (documentId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      applicable_documents: checked
        ? [...prev.applicable_documents, documentId]
        : prev.applicable_documents.filter(id => id !== documentId)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingTax ? 'Modifier la taxe personnalisée' : 'Créer une taxe personnalisée'}
          </DialogTitle>
          <DialogDescription>
            Créez une taxe supplémentaire à appliquer à vos documents. Elle sera ajoutée après la TVA.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de la taxe</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Taxe spéciale, Écotaxe..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type de taxe</Label>
            <Select
              value={formData.type}
              onValueChange={(value: 'percentage' | 'fixed') => 
                setFormData(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                <SelectItem value="fixed">Valeur Absolue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">
              Valeur {formData.type === 'percentage' ? '(%)' : '(Montant fixe)'}
            </Label>
            <div className="relative">
              <Input
                id="value"
                type="number"
                min="0"
                step="0.01"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                placeholder={formData.type === 'percentage' ? '5.5' : '10.00'}
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                {formData.type === 'percentage' 
                  ? '%' 
                  : currencies.find(c => c.id === formData.currency_id)?.symbol || 'DT'
                }
              </span>
            </div>
          </div>

          {formData.type === 'fixed' && (
            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <Select
                value={formData.currency_id}
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, currency_id: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une devise" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.id} value={currency.id}>
                      {currency.code} ({currency.symbol}) - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-3">
            <Label>Documents concernés</Label>
            <div className="grid grid-cols-2 gap-3">
              {documentTypes.map((doc) => (
                <div key={doc.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={doc.id}
                    checked={formData.applicable_documents.includes(doc.id)}
                    onCheckedChange={(checked) => 
                      handleDocumentToggle(doc.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={doc.id} className="text-sm font-normal">
                    {doc.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_fiscal_stamp"
              checked={formData.is_fiscal_stamp}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, is_fiscal_stamp: checked as boolean }))
              }
            />
            <Label htmlFor="is_fiscal_stamp" className="text-sm font-normal">
              Cette taxe est un timbre fiscal
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.name.trim() || formData.value <= 0 || formData.applicable_documents.length === 0}
              className="bg-[#6C4CF1] hover:bg-[#5A3DE8]"
            >
              {loading ? 'Enregistrement...' : editingTax ? 'Modifier' : 'Ajouter la taxe'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
