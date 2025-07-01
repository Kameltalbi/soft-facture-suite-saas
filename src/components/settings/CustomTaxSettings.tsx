
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Receipt } from 'lucide-react';
import { CustomTaxModal } from '@/components/modals/CustomTaxModal';
import { useCustomTaxes } from '@/hooks/useCustomTaxes';
import { CustomTax, CreateCustomTaxData } from '@/types/customTax';

const documentTypeLabels: Record<string, string> = {
  invoice: 'Facture',
  quote: 'Bon de commande',
  delivery_note: 'Bon de livraison',
  credit: 'Avoir',
};

export function CustomTaxSettings() {
  const { customTaxes, loading, createCustomTax, updateCustomTax, deleteCustomTax } = useCustomTaxes();
  const [showModal, setShowModal] = useState(false);
  const [editingTax, setEditingTax] = useState<CustomTax | null>(null);
  const [deletingTax, setDeletingTax] = useState<CustomTax | null>(null);

  const handleCreateTax = async (data: CreateCustomTaxData) => {
    await createCustomTax(data);
  };

  const handleUpdateTax = async (data: CreateCustomTaxData) => {
    if (editingTax) {
      await updateCustomTax(editingTax.id, data);
    }
  };

  const handleEdit = (tax: CustomTax) => {
    setEditingTax(tax);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (deletingTax) {
      await deleteCustomTax(deletingTax.id);
      setDeletingTax(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTax(null);
  };

  const formatValue = (tax: CustomTax) => {
    return tax.type === 'percentage' 
      ? `${tax.value}%` 
      : `${tax.value} DT`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Taxes personnalisées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Chargement...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Taxes personnalisées
          </CardTitle>
          <CardDescription>
            Créez des taxes supplémentaires à appliquer à vos documents. Les taxes seront ajoutées à la suite de la TVA dans le calcul du total TTC.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-end">
            <Button 
              onClick={() => setShowModal(true)}
              className="bg-[#6C4CF1] hover:bg-[#5A3DE8]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une taxe
            </Button>
          </div>

          {customTaxes.length > 0 ? (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom de la taxe</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Valeur</TableHead>
                    <TableHead>Documents concernés</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customTaxes.map((tax) => (
                    <TableRow key={tax.id}>
                      <TableCell className="font-medium">{tax.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {tax.type === 'percentage' ? 'Pourcentage' : 'Valeur ajoutée'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatValue(tax)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {tax.applicable_documents.map((docType) => (
                            <Badge key={docType} variant="outline" className="text-xs">
                              {documentTypeLabels[docType] || docType}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(tax)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingTax(tax)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune taxe personnalisée créée</p>
              <p className="text-sm">Cliquez sur "Ajouter une taxe" pour commencer</p>
            </div>
          )}
        </CardContent>
      </Card>

      <CustomTaxModal
        open={showModal}
        onClose={closeModal}
        onSave={editingTax ? handleUpdateTax : handleCreateTax}
        editingTax={editingTax}
      />

      <AlertDialog open={!!deletingTax} onOpenChange={() => setDeletingTax(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la taxe personnalisée</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la taxe "{deletingTax?.name}" ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
