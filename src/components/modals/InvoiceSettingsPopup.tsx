import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Check } from 'lucide-react';
import { useCustomTaxes } from '@/hooks/useCustomTaxes';
import { useCurrencies } from '@/hooks/useCurrencies';

interface InvoiceSettings {
  useVat: boolean;
  customTaxesUsed: string[];
  hasAdvance: boolean;
  advanceAmount: number;
  currencyId: string;
  useDiscount: boolean;
  salesChannel: string;
}

interface InvoiceSettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (settings: InvoiceSettings) => void;
  currentSettings: InvoiceSettings;
  totalAmount: number;
}

export function InvoiceSettingsPopup({ 
  isOpen, 
  onClose, 
  onApply, 
  currentSettings, 
  totalAmount 
}: InvoiceSettingsPopupProps) {
  const { customTaxes } = useCustomTaxes();
  const { currencies } = useCurrencies();
  
  const [settings, setSettings] = useState<InvoiceSettings>(currentSettings);

  useEffect(() => {
    setSettings(currentSettings);
  }, [currentSettings, isOpen]);

  const handleCustomTaxToggle = (taxId: string, enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      customTaxesUsed: enabled 
        ? [...prev.customTaxesUsed, taxId]
        : prev.customTaxesUsed.filter(id => id !== taxId)
    }));
  };

  const handleAdvanceAmountChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    // Permettre la saisie libre, la validation se fait juste visuellement
    setSettings(prev => ({ ...prev, advanceAmount: amount }));
  };

  const handleApply = () => {
    onApply(settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div className="relative bg-background border rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Paramètres de la facture</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Section TVA */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">TVA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch
                  id="use-vat"
                  checked={settings.useVat}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, useVat: checked }))}
                />
                <Label htmlFor="use-vat">Utiliser la TVA</Label>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Si désactivée, la ligne TVA n'apparaîtra pas dans la facture
              </p>
            </CardContent>
          </Card>

          {/* Section Taxes personnalisées */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Taxes personnalisées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {customTaxes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucune taxe personnalisée définie. Rendez-vous dans Paramètres {'>'} Taxes personnalisées pour en créer.
                </p>
              ) : (
                customTaxes.map((tax) => (
                  <div key={tax.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{tax.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {tax.type === 'percentage' ? `${tax.value}%` : `${tax.value} DT`}
                      </div>
                    </div>
                    <Switch
                      checked={settings.customTaxesUsed.includes(tax.id)}
                      onCheckedChange={(checked) => handleCustomTaxToggle(tax.id, checked)}
                    />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Section Avance perçue */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Avance perçue</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="has-advance"
                  checked={settings.hasAdvance}
                  onCheckedChange={(checked) => setSettings(prev => ({ 
                    ...prev, 
                    hasAdvance: checked,
                    advanceAmount: checked ? prev.advanceAmount : 0
                  }))}
                />
                <Label htmlFor="has-advance">Avance perçue</Label>
              </div>
              
              {settings.hasAdvance && (
                <div>
                  <Label htmlFor="advance-amount">Montant de l'avance</Label>
                  <Input
                    id="advance-amount"
                    type="number"
                    min="0"
                    max={totalAmount}
                    step="0.01"
                    value={settings.advanceAmount}
                    onChange={(e) => handleAdvanceAmountChange(e.target.value)}
                    placeholder="0.00"
                    className="mt-1"
                  />
                  <p className={`text-sm mt-1 ${settings.advanceAmount > totalAmount ? 'text-red-500' : 'text-muted-foreground'}`}>
                    Maximum recommandé : {totalAmount.toFixed(2)} DT
                    {settings.advanceAmount > totalAmount && (
                      <span className="block text-red-500 font-medium">
                        ⚠️ L'avance dépasse le total de la facture
                      </span>
                    )}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section Remises */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Remises</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch
                  id="use-discount"
                  checked={settings.useDiscount}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, useDiscount: checked }))}
                />
                <Label htmlFor="use-discount">Activer les remises</Label>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Si désactivée, la colonne "Remise %" n'apparaîtra pas dans le tableau
              </p>
            </CardContent>
          </Card>

          {/* Section Devise */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Devise</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="currency-select">Choisir la devise</Label>
                <Select 
                  value={settings.currencyId} 
                  onValueChange={(value) => setSettings(prev => ({ ...prev, currencyId: value }))}
                >
                  <SelectTrigger className="mt-1">
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
            </CardContent>
          </Card>

          {/* Section Canal de vente */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Canal de vente</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="sales-channel-select">Type de vente</Label>
                <Select 
                  value={settings.salesChannel} 
                  onValueChange={(value) => setSettings(prev => ({ ...prev, salesChannel: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionner le canal de vente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="export">Export</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-2">
                  Classifie cette vente comme locale ou à l'export pour l'analyse des données
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t bg-muted/30">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleApply} className="bg-blue-600 hover:bg-blue-700">
            <Check className="h-4 w-4 mr-2" />
            Appliquer
          </Button>
        </div>
      </div>
    </div>
  );
}