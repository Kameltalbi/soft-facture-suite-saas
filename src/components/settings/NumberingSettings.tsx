
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Hash } from 'lucide-react';
import { DocumentNumbering } from '@/types/settings';

interface NumberingSettingsProps {
  numberings: DocumentNumbering[];
  onUpdateNumbering: (id: string, data: Partial<DocumentNumbering>) => void;
}

const DOCUMENT_TYPES = [
  { key: 'invoice', label: 'Factures', defaultPrefix: 'FACT-' },
  { key: 'quote', label: 'Devis', defaultPrefix: 'DEVIS-' },
  { key: 'delivery_note', label: 'Bons de livraison', defaultPrefix: 'BON-' },
  { key: 'credit', label: 'Avoirs', defaultPrefix: 'AVOIR-' },
];

const FORMAT_OPTIONS = [
  { value: 'incremental', label: 'Incrémental simple (1, 2, 3...)' },
  { value: 'yearly', label: 'Format annuel (2024-0001)' },
  { value: 'monthly', label: 'Format mensuel (202401-001)' },
];

const RESET_OPTIONS = [
  { value: 'never', label: 'Jamais' },
  { value: 'monthly', label: 'Mensuelle' },
  { value: 'yearly', label: 'Annuelle' },
];

export function NumberingSettings({ numberings, onUpdateNumbering }: NumberingSettingsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<DocumentNumbering>>({});

  const startEditing = (numbering: DocumentNumbering) => {
    setEditingId(numbering.id);
    setFormData(numbering);
  };

  const handleSave = () => {
    if (editingId && formData) {
      onUpdateNumbering(editingId, formData);
      setEditingId(null);
      setFormData({});
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const getDocumentTypeLabel = (type: string) => {
    return DOCUMENT_TYPES.find(t => t.key === type)?.label || type;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hash className="h-5 w-5" />
          Numérotation des documents
        </CardTitle>
        <CardDescription>
          Configurez les préfixes et formats de numérotation pour chaque type de document
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type de document</TableHead>
              <TableHead>Préfixe</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Prochain numéro</TableHead>
              <TableHead>Réinitialisation</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {numberings.map((numbering) => (
              <TableRow key={numbering.id}>
                <TableCell className="font-medium">
                  {getDocumentTypeLabel(numbering.document_type)}
                </TableCell>
                <TableCell>
                  {editingId === numbering.id ? (
                    <Input
                      value={formData.prefix || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, prefix: e.target.value }))}
                      className="w-24"
                    />
                  ) : (
                    numbering.prefix
                  )}
                </TableCell>
                <TableCell>
                  {editingId === numbering.id ? (
                    <Select
                      value={formData.format}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, format: value as any }))}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FORMAT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    FORMAT_OPTIONS.find(o => o.value === numbering.format)?.label
                  )}
                </TableCell>
                <TableCell>
                  {editingId === numbering.id ? (
                    <Input
                      type="number"
                      value={formData.next_number || 0}
                      onChange={(e) => setFormData(prev => ({ ...prev, next_number: parseInt(e.target.value) }))}
                      className="w-20"
                    />
                  ) : (
                    numbering.next_number
                  )}
                </TableCell>
                <TableCell>
                  {editingId === numbering.id ? (
                    <Select
                      value={formData.reset_frequency}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, reset_frequency: value as any }))}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RESET_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    RESET_OPTIONS.find(o => o.value === numbering.reset_frequency)?.label
                  )}
                </TableCell>
                <TableCell>
                  {editingId === numbering.id ? (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSave}>
                        Sauver
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        Annuler
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => startEditing(numbering)}>
                      Modifier
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
