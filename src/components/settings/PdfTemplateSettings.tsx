
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileText, Eye, Check } from 'lucide-react';
import { TemplatePreviewModal } from './TemplatePreviewModal';

interface PdfTemplateSettingsProps {
  settings?: {
    invoice_template: string;
    quote_template: string;
    delivery_note_template: string;
    credit_template: string;
  };
  onSave: (data: any) => void;
}

const templates = [
  { 
    id: 'classic', 
    name: 'Template Classique', 
    description: 'Template standard avec mise en page traditionnelle' 
  },
  { 
    id: 'modern', 
    name: 'Template Moderne', 
    description: 'Design contemporain et épuré' 
  }
];

export function PdfTemplateSettings({ settings, onSave }: PdfTemplateSettingsProps) {
  // Utiliser le premier template trouvé ou 'classic' par défaut
  const currentTemplate = settings?.invoice_template || 
                         settings?.quote_template || 
                         settings?.delivery_note_template || 
                         settings?.credit_template || 
                         'classic';

  const [selectedTemplate, setSelectedTemplate] = useState(currentTemplate);
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    template: '',
    documentType: 'invoice'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Appliquer le template sélectionné à tous les types de documents
    const templateData = {
      invoice_template: selectedTemplate,
      quote_template: selectedTemplate,
      delivery_note_template: selectedTemplate,
      credit_template: selectedTemplate,
    };
    
    onSave(templateData);
  };

  const handleUseTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handlePreview = (templateId: string) => {
    setPreviewModal({
      isOpen: true,
      template: templateId,
      documentType: 'invoice'
    });
  };

  const closePreview = () => {
    setPreviewModal({
      isOpen: false,
      template: '',
      documentType: 'invoice'
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
            Choisissez le template PDF à utiliser pour tous vos documents (factures, devis, bons de livraison, avoirs)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label>Templates disponibles</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <Card 
                    key={template.id} 
                    className={`relative cursor-pointer transition-all ${
                      selectedTemplate === template.id 
                        ? 'ring-2 ring-[#6A9C89] bg-[#6A9C89]/5' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {template.name}
                          </h3>
                          <p className="text-sm text-gray-500 mb-3">
                            {template.description}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handlePreview(template.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Aperçu
                            </Button>
                            {selectedTemplate !== template.id && (
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => handleUseTemplate(template.id)}
                                className="bg-[#6A9C89] hover:bg-[#5A8B7A] text-white"
                              >
                                Utiliser
                              </Button>
                            )}
                          </div>
                        </div>
                        {selectedTemplate === template.id && (
                          <div className="flex items-center gap-2 text-[#6A9C89]">
                            <Check className="h-5 w-5" />
                            <span className="text-sm font-medium">Actuel</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-blue-600 mt-0.5">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-800 mb-1">
                    Template unique
                  </h4>
                  <p className="text-sm text-blue-700">
                    Le template sélectionné sera utilisé pour tous vos documents : factures, devis, bons de livraison et avoirs.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button type="submit" className="bg-[#6A9C89] hover:bg-[#5A8B7A] text-white">
                Enregistrer le template
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
