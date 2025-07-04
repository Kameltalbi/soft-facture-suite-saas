import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Download, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ImportCategoriesModalProps {
  open: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

export function ImportCategoriesModal({ open, onClose, onImportComplete }: ImportCategoriesModalProps) {
  const [step, setStep] = useState<'structure' | 'upload'>('structure');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
      } else {
        toast({
          title: "Format de fichier non supporté",
          description: "Veuillez sélectionner un fichier CSV ou Excel (.xlsx, .xls)",
          variant: "destructive"
        });
      }
    }
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      return obj;
    });
    return rows;
  };

  const handleImport = async () => {
    if (!selectedFile || !user) return;

    setImporting(true);
    try {
      // Récupérer l'organization_id de l'utilisateur
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('user_id', user.id)
        .single();

      if (!profile?.organization_id) {
        throw new Error('Impossible de récupérer votre organisation');
      }

      const text = await selectedFile.text();
      const categories = parseCSV(text);

      // Validation des données
      const validCategories = categories.filter(category => category.name && category.name.trim());
      
      if (validCategories.length === 0) {
        throw new Error('Aucune catégorie valide trouvée dans le fichier');
      }

      // Importer les catégories
      const { error } = await supabase
        .from('categories')
        .insert(validCategories.map(category => ({
          name: category.name,
          description: category.description || null,
          color: category.color || '#3B82F6',
          active: category.active ? category.active.toLowerCase() === 'true' : true,
          organization_id: profile.organization_id
        })));

      if (error) throw error;

      toast({
        title: "Import réussi",
        description: `${validCategories.length} catégorie(s) importée(s) avec succès`
      });

      onImportComplete();
      onClose();
      resetModal();
    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: "Erreur d'import",
        description: error.message || "Une erreur est survenue lors de l'import",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  const resetModal = () => {
    setStep('structure');
    setSelectedFile(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const downloadTemplate = () => {
    const csvContent = `name,description,color,active
"Catégorie Exemple","Description de la catégorie","#3B82F6","true"
"Produits Électroniques","Tous les produits électroniques","#10B981","true"`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modele_categories.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Importer des catégories</DialogTitle>
          <DialogDescription>
            {step === 'structure' 
              ? 'Voici la structure requise pour votre fichier d\'import'
              : 'Sélectionnez votre fichier CSV ou Excel à importer'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'structure' && (
          <div className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Votre fichier doit contenir ces colonnes exactement (respecter les noms) :
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Structure du fichier
                </CardTitle>
                <CardDescription>
                  Format CSV ou Excel avec les colonnes suivantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">name</span>
                      <span className="text-red-500">*Obligatoire</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">description</span>
                      <span className="text-muted-foreground">Facultatif</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">color</span>
                      <span className="text-muted-foreground">Défaut: #3B82F6</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">active</span>
                      <span className="text-muted-foreground">true/false</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button 
                variant="outline" 
                onClick={downloadTemplate}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Télécharger le modèle CSV
              </Button>
            </div>
          </div>
        )}

        {step === 'upload' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="file">Sélectionner le fichier</Label>
              <Input
                id="file"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="cursor-pointer"
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Fichier sélectionné: {selectedFile.name}
                </p>
              )}
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Assurez-vous que votre fichier respecte la structure indiquée à l'étape précédente.
                Seules les catégories avec un nom seront importées.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <DialogFooter>
          {step === 'structure' && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Annuler
              </Button>
              <Button onClick={() => setStep('upload')}>
                Continuer
              </Button>
            </>
          )}
          
          {step === 'upload' && (
            <>
              <Button variant="outline" onClick={() => setStep('structure')}>
                Retour
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Annuler
              </Button>
              <Button 
                onClick={handleImport} 
                disabled={!selectedFile || importing}
              >
                {importing ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                    Import en cours...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Importer
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}