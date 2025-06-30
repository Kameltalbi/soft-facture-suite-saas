
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { FileText, Eye } from 'lucide-react';
import { TemplatePreviewModal } from './TemplatePreviewModal';

interface PdfTemplateSettingsProps {
  settings?: {
    invoice_template: string;
    quote_template: string;
    delivery_note_template: string;
    credit_template: string;
    unified_template?: string;
    use_unified_template?: boolean;
  };
  onSave: (data: any) => void;
}

const templates = [
  { id: 'classic', name: 'Classique', description: 'Template standard avec en-tête simple' },
  { id: 'modern', name: 'Moderne', description: 'Design contemporain avec couleurs' },
  { id: 'minimal', name: 'Minimal', description: 'Design épuré et minimaliste' },
  { id: 'professional', name: 'Professionnel', description: 'Template formel pour entreprises' },
];

export function PdfTemplateSettings({ settings, onSave }: PdfTemplateSettingsProps) {
  const [formData, setFormData] = useState({
    invoice_template: settings?.invoice_template || 'classic',
    quote_template: settings?.quote_template || 'classic',
    delivery_note_template: settings?.delivery_note_template || 'classic',
    credit_template: settings?.credit_template || 'classic',
    unified_template: settings?.unified_template || 'classic',
    use_unified_template: settings?.use_unified_template || false,
  });

  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    template: '',
    documentType: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handlePreview = (documentType: string, templateId: string) => {
    console.log(`Aperçu du template ${templateId} pour le type ${documentType}`);
    setPreviewModal({
      isOpen: true,
      template: templateId,
      documentType: documentType
    });
  };

  const closePreview = () => {
    setPreviewModal({
      isOpen: false,
      template: '',
      documentType: ''
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Templates PDF
          </CardTitle>
          <CardDescription>
            Choisissez le template PDF à utiliser pour chaque type de document
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Option template unifié */}
            <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="use_unified_template" className="text-base font-medium">
                    Template unifié pour tous les documents
                  </Label>
                  <p className="text-sm text-gray-600">
                    Utilisez le même template pour tous vos documents (factures, devis, bons de livraison, etc.)
                  </p>
                </div>
                <Switch
                  id="use_unified_template"
                  checked={formData.use_unified_template}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, use_unified_template: checked }))}
                />
              </div>

              {formData.use_unified_template && (
                <div className="space-y-3">
                  <Label htmlFor="unified_template">Template principal</Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.unified_template}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, unified_template: value }))}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            <div>
                              <div className="font-medium">{template.name}</div>
                              <div className="text-sm text-gray-500">{template.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview('unified', formData.unified_template)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Templates individuels - masqués si template unifié activé */}
            {!formData.use_unified_template && (
              <>
                {/* Template pour les factures */}
                <div className="space-y-3">
                  <Label htmlFor="invoice_template">Template pour les factures</Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.invoice_template}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, invoice_template: value }))}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            <div>
                              <div className="font-medium">{template.name}</div>
                              <div className="text-sm text-gray-500">{template.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview('invoice', formData.invoice_template)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Template pour les devis */}
                <div className="space-y-3">
                  <Label htmlFor="quote_template">Template pour les devis</Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.quote_template}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, quote_template: value }))}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            <div>
                              <div className="font-medium">{template.name}</div>
                              <div className="text-sm text-gray-500">{template.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview('quote', formData.quote_template)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Template pour les bons de livraison */}
                <div className="space-y-3">
                  <Label htmlFor="delivery_note_template">Template pour les bons de livraison</Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.delivery_note_template}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, delivery_note_template: value }))}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            <div>
                              <div className="font-medium">{template.name}</div>
                              <div className="text-sm text-gray-500">{template.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview('delivery_note', formData.delivery_note_template)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Template pour les avoirs */}
                <div className="space-y-3">
                  <Label htmlFor="credit_template">Template pour les avoirs</Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.credit_template}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, credit_template: value }))}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            <div>
                              <div className="font-medium">{template.name}</div>
                              <div className="text-sm text-gray-500">{template.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview('credit', formData.credit_template)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end pt-4 border-t">
              <Button type="submit">
                Enregistrer les templates
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <TemplatePreviewModal
        isOpen={previewModal.isOpen}
        onClose={closePreview}
        template={previewModal.template}
        documentType={previewModal.documentType}
      />
    </>
  );
}
