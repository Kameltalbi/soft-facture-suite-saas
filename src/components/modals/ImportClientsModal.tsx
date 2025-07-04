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

interface ImportClientsModalProps {
  open: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

export function ImportClientsModal({ open, onClose, onImportComplete }: ImportClientsModalProps) {
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
      const clients = parseCSV(text);

      // Validation des données
      const validClients = clients.filter(client => client.name && client.name.trim());
      
      if (validClients.length === 0) {
        throw new Error('Aucun client valide trouvé dans le fichier');
      }

      // Importer les clients
      const { error } = await supabase
        .from('clients')
        .insert(validClients.map(client => ({
          name: client.name,
          email: client.email || null,
          phone: client.phone || null,
          company: client.company || null,
          address: client.address || null,
          city: client.city || null,
          postal_code: client.postal_code || null,
          country: client.country || 'France',
          vat_number: client.vat_number || null,
          payment_terms: client.payment_terms ? parseInt(client.payment_terms) : 30,
          status: 'active',
          organization_id: profile.organization_id
        })));

      if (error) throw error;

      toast({
        title: "Import réussi",
        description: `${validClients.length} client(s) importé(s) avec succès`
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
    const csvContent = `name,email,phone,company,address,city,postal_code,country,vat_number,payment_terms
"John Doe","john@example.com","0123456789","Ma Société","123 Rue de la Paix","Paris","75001","France","FR12345678901","30"
"Jane Smith","jane@company.com","0987654321","Autre Société","456 Avenue du Commerce","Lyon","69000","France","","45"`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modele_clients.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Importer des clients</DialogTitle>
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
                      <span className="font-medium">email</span>
                      <span className="text-muted-foreground">Facultatif</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">phone</span>
                      <span className="text-muted-foreground">Facultatif</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">company</span>
                      <span className="text-muted-foreground">Facultatif</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">address</span>
                      <span className="text-muted-foreground">Facultatif</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">city</span>
                      <span className="text-muted-foreground">Facultatif</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">postal_code</span>
                      <span className="text-muted-foreground">Facultatif</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">country</span>
                      <span className="text-muted-foreground">Défaut: France</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">vat_number</span>
                      <span className="text-muted-foreground">Facultatif</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">payment_terms</span>
                      <span className="text-muted-foreground">Défaut: 30</span>
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
                Télécharger le modèle CSV ou Excel
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
                Seuls les clients avec un nom seront importés.
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