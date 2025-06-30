
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';
import { ColorSelector } from './ColorSelector';
import { CategoryDeleteDialog } from './CategoryDeleteDialog';

interface Category {
  id?: string;
  name: string;
  description: string;
  color: string;
  active: boolean;
  organization_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface CategoryFormProps {
  formData: Category;
  onFormDataChange: (data: Category) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  onDelete?: () => void;
  isSubmitting: boolean;
  isFormValid: boolean;
  category?: Category;
}

export function CategoryForm({ 
  formData, 
  onFormDataChange, 
  onSubmit, 
  onClose, 
  onDelete,
  isSubmitting, 
  isFormValid, 
  category 
}: CategoryFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Nom de la catégorie */}
      <div>
        <Label htmlFor="name">Nom de la catégorie *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onFormDataChange({...formData, name: e.target.value})}
          placeholder="Ex: Sanitaires, Matériaux, Prestations..."
          required
          className={!isFormValid && formData.name.length > 0 ? 'border-red-500' : ''}
        />
        {!isFormValid && formData.name.length === 0 && (
          <p className="text-xs text-red-500 mt-1">Le nom est requis</p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onFormDataChange({...formData, description: e.target.value})}
          placeholder="Description ou remarque sur cette catégorie..."
          rows={3}
        />
      </div>

      {/* Couleur */}
      <ColorSelector 
        selectedColor={formData.color}
        onColorChange={(color) => onFormDataChange({...formData, color})}
      />

      {/* Statut actif */}
      <div className="flex items-center justify-between p-3 border rounded-lg bg-neutral-50">
        <div>
          <Label htmlFor="active" className="text-sm font-medium">
            Catégorie active
          </Label>
          <p className="text-xs text-neutral-500">
            Les catégories inactives n'apparaissent pas dans les listes
          </p>
        </div>
        <Switch
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) => onFormDataChange({...formData, active: checked})}
        />
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-between pt-4">
        <div>
          {category?.id && onDelete && (
            <CategoryDeleteDialog 
              category={category}
              isSubmitting={isSubmitting}
              onDelete={onDelete}
            />
          )}
        </div>

        <div className="flex space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            <X size={16} className="mr-2" />
            Annuler
          </Button>
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary/90"
            disabled={!isFormValid || isSubmitting}
          >
            <Save size={16} className="mr-2" />
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </div>
    </form>
  );
}
