import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/hooks/useSettings';
import { useToast } from '@/hooks/use-toast';

export function InvoiceDisplaySettings() {
  const { globalSettings, saveGlobalSettings, loading } = useSettings();
  const { toast } = useToast();
  const [showDiscount, setShowDiscount] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (globalSettings) {
      setShowDiscount(globalSettings.show_discount ?? false);
    }
  }, [globalSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveGlobalSettings({
        ...globalSettings,
        show_discount: showDiscount
      });
      toast({
        title: 'Succès',
        description: 'Paramètres d\'affichage mis à jour.',
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la sauvegarde des paramètres.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Affichage des colonnes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Affichage des colonnes</CardTitle>
        <p className="text-sm text-muted-foreground">
          Configurez quelles colonnes afficher dans vos documents PDF
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-discount" className="text-base">
                Colonne Remise
              </Label>
              <p className="text-sm text-muted-foreground">
                Afficher la colonne remise dans les factures, devis et autres documents
              </p>
            </div>
            <Switch
              id="show-discount"
              checked={showDiscount}
              onCheckedChange={setShowDiscount}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90"
          >
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}