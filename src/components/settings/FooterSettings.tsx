
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText } from 'lucide-react';
import { GlobalSettings } from '@/types/settings';

interface FooterSettingsProps {
  settings?: GlobalSettings;
  onSave: (data: Partial<GlobalSettings>) => void;
}

export function FooterSettings({ settings, onSave }: FooterSettingsProps) {
  const [formData, setFormData] = useState({
    footer_content: settings?.footer_content || '',
    footer_display: settings?.footer_display || 'all',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Pied de page global (PDF)
        </CardTitle>
        <CardDescription>
          Configurez le pied de page qui apparaîtra sur vos documents PDF
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="footer_content">Contenu du pied de page</Label>
            <Textarea
              id="footer_content"
              value={formData.footer_content}
              onChange={(e) => setFormData(prev => ({ ...prev, footer_content: e.target.value }))}
              rows={6}
              placeholder="Mentions légales, coordonnées bancaires, site web, etc."
            />
            <p className="text-sm text-gray-500">
              Vous pouvez inclure des informations comme vos mentions légales, coordonnées bancaires, site web, etc.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="footer_display">Affichage</Label>
            <Select
              value={formData.footer_display}
              onValueChange={(value) => setFormData(prev => ({ ...prev, footer_display: value as any }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les documents</SelectItem>
                <SelectItem value="invoices_only">Uniquement les factures</SelectItem>
                <SelectItem value="none">Aucun (désactivé)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              Enregistrer les modifications
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
