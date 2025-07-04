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

interface ImportStockModalProps {
  open: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

export function ImportStockModal({ open, onClose, onImportComplete }: ImportStockModalProps) {
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
      const movements = parseCSV(text);

      // Validation des données
      const validMovements = movements.filter(movement => 
        movement.product_name && 
        movement.movement_type && 
        movement.quantity && 
        !isNaN(parseFloat(movement.quantity))
      );
      
      if (validMovements.length === 0) {
        throw new Error('Aucun mouvement de stock valide trouvé dans le fichier');
      }

      // Pour chaque mouvement, trouver le produit correspondant
      const processedMovements = [];
      for (const movement of validMovements) {
        // Chercher le produit par nom ou SKU
        const { data: products } = await supabase
          .from('products')
          .select('id, name, sku')
          .eq('organization_id', profile.organization_id)
          .or(`name.ilike.%${movement.product_name}%,sku.ilike.%${movement.product_name}%`);

        const product = products?.[0];
        if (product) {
          processedMovements.push({
            product_id: product.id,
            movement_type: movement.movement_type.toLowerCase() === 'sortie' ? 'out' : 'in',
            quantity: movement.movement_type.toLowerCase() === 'sortie' ? 
              -Math.abs(parseFloat(movement.quantity)) : 
              Math.abs(parseFloat(movement.quantity)),
            unit_cost: movement.unit_cost ? parseFloat(movement.unit_cost) : 0,
            reason: movement.reason || null,
            notes: movement.notes || null,
            organization_id: profile.organization_id,
            created_by: user.id
          });
        }
      }

      if (processedMovements.length === 0) {
        throw new Error('Aucun produit correspondant trouvé pour les mouvements');
      }

      // Importer les mouvements de stock
      const { error } = await supabase
        .from('stock_movements')
        .insert(processedMovements);

      if (error) throw error;

      toast({
        title: "Import réussi",
        description: `${processedMovements.length} mouvement(s) de stock importé(s) avec succès`
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
    const csvContent = `product_name,movement_type,quantity,unit_cost,reason,notes
"Produit Exemple","entrée","50","10.50","Réapprovisionnement","Commande fournisseur ABC"
"Service Test","sortie","5","0","Vente","Commande client #123"
"Produit SKU001","entrée","100","8.75","Inventaire","Ajustement stock physique"`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modele_mouvements_stock.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Importer des mouvements de stock</DialogTitle>
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
                      <span className="font-medium">product_name</span>
                      <span className="text-red-500">*Obligatoire</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">movement_type</span>
                      <span className="text-red-500">*entrée/sortie</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">quantity</span>
                      <span className="text-red-500">*Obligatoire (nombre)</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">unit_cost</span>
                      <span className="text-muted-foreground">Facultatif (coût unitaire)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">reason</span>
                      <span className="text-muted-foreground">Facultatif</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">notes</span>
                      <span className="text-muted-foreground">Facultatif</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Notes importantes :</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Le <strong>product_name</strong> doit correspondre exactement au nom ou SKU d'un produit existant</li>
                    <li>• Le <strong>movement_type</strong> doit être "entrée" ou "sortie"</li>
                    <li>• La <strong>quantity</strong> doit être un nombre positif</li>
                    <li>• Les produits doivent avoir le suivi de stock activé</li>
                  </ul>
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
                Seuls les mouvements avec des produits existants seront importés.
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