
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category;
  onSave: (category: Omit<Category, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) => void;
}

// Fonction pour convertir HSL en HEX
const hslToHex = (h: number, s: number, l: number) => {
  const hDecimal = h / 360;
  const sDecimal = s / 100;
  const lDecimal = l / 100;

  const c = (1 - Math.abs(2 * lDecimal - 1)) * sDecimal;
  const x = c * (1 - Math.abs((hDecimal * 6) % 2 - 1));
  const m = lDecimal - c / 2;

  let r, g, b;

  if (hDecimal >= 0 && hDecimal < 1/6) {
    r = c; g = x; b = 0;
  } else if (hDecimal >= 1/6 && hDecimal < 2/6) {
    r = x; g = c; b = 0;
  } else if (hDecimal >= 2/6 && hDecimal < 3/6) {
    r = 0; g = c; b = x;
  } else if (hDecimal >= 3/6 && hDecimal < 4/6) {
    r = 0; g = x; b = c;
  } else if (hDecimal >= 4/6 && hDecimal < 5/6) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Fonction pour convertir HEX en HSL
const hexToHsl = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l;

  l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};

export function CategoryModal({ isOpen, onClose, category, onSave }: CategoryModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Omit<Category, 'id' | 'organization_id' | 'created_at' | 'updated_at'>>({
    name: '',
    description: '',
    color: '#3B82F6',
    active: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hue, setHue] = useState([220]); // Valeur initiale pour le bleu
  const [saturation, setSaturation] = useState([80]);
  const [lightness, setLightness] = useState([50]);

  // Validation en temps réel
  const isFormValid = formData.name.trim().length > 0;

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        color: category.color || '#3B82F6',
        active: category.active ?? true
      });
      
      // Convertir la couleur hex en HSL pour les sliders
      const [h, s, l] = hexToHsl(category.color || '#3B82F6');
      setHue([h]);
      setSaturation([s]);
      setLightness([l]);
    } else {
      setFormData({
        name: '',
        description: '',
        color: '#3B82F6',
        active: true
      });
      setHue([220]);
      setSaturation([80]);
      setLightness([50]);
    }
  }, [category, isOpen]);

  // Mettre à jour la couleur quand les sliders changent
  useEffect(() => {
    const newColor = hslToHex(hue[0], saturation[0], lightness[0]);
    setFormData(prev => ({ ...prev, color: newColor }));
  }, [hue, saturation, lightness]);

  const handleColorInputChange = (value: string) => {
    if (value.match(/^#[0-9A-F]{6}$/i)) {
      const [h, s, l] = hexToHsl(value);
      setHue([h]);
      setSaturation([s]);
      setLightness([l]);
    }
    setFormData(prev => ({ ...prev, color: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast({
        title: "Erreur de validation",
        description: "Le nom de la catégorie est requis.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      
      toast({
        title: category ? "Catégorie modifiée" : "Catégorie créée",
        description: `La catégorie "${formData.name}" a été ${category ? 'modifiée' : 'créée'} avec succès.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom de la catégorie */}
          <div>
            <Label htmlFor="name">Nom de la catégorie *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
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
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Description ou remarque sur cette catégorie..."
              rows={3}
            />
          </div>

          {/* Sélecteur de couleur avec curseurs */}
          <div>
            <Label htmlFor="color">Couleur de la catégorie</Label>
            <div className="space-y-4">
              {/* Couleur actuelle avec preview */}
              <div className="flex items-center space-x-3 p-3 border rounded-lg bg-neutral-50">
                <div 
                  className="w-12 h-12 rounded-full border-2 border-gray-300 shadow-sm transition-colors duration-200"
                  style={{ backgroundColor: formData.color }}
                />
                <div className="flex-1">
                  <Input
                    type="text"
                    value={formData.color}
                    onChange={(e) => handleColorInputChange(e.target.value)}
                    placeholder="#3B82F6"
                    className="font-mono text-sm"
                  />
                </div>
              </div>
              
              {/* Curseurs HSL */}
              <div className="space-y-4 p-4 border rounded-lg bg-white">
                <div>
                  <Label className="text-sm text-neutral-600 mb-2 block">
                    Teinte ({hue[0]}°)
                  </Label>
                  <div className="relative">
                    <div 
                      className="h-6 w-full rounded-md mb-2"
                      style={{
                        background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
                      }}
                    />
                    <Slider
                      value={hue}
                      onValueChange={setHue}
                      max={360}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-neutral-600 mb-2 block">
                    Saturation ({saturation[0]}%)
                  </Label>
                  <div className="relative">
                    <div 
                      className="h-6 w-full rounded-md mb-2"
                      style={{
                        background: `linear-gradient(to right, hsl(${hue[0]}, 0%, ${lightness[0]}%), hsl(${hue[0]}, 100%, ${lightness[0]}%))`
                      }}
                    />
                    <Slider
                      value={saturation}
                      onValueChange={setSaturation}
                      max={100}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-neutral-600 mb-2 block">
                    Luminosité ({lightness[0]}%)
                  </Label>
                  <div className="relative">
                    <div 
                      className="h-6 w-full rounded-md mb-2"
                      style={{
                        background: `linear-gradient(to right, hsl(${hue[0]}, ${saturation[0]}%, 0%), hsl(${hue[0]}, ${saturation[0]}%, 50%), hsl(${hue[0]}, ${saturation[0]}%, 100%))`
                      }}
                    />
                    <Slider
                      value={lightness}
                      onValueChange={setLightness}
                      max={100}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

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
              onCheckedChange={(checked) => setFormData({...formData, active: checked})}
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-2 pt-4">
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
              className="bg-[#6A9C89] hover:bg-[#5a8473]"
              disabled={!isFormValid || isSubmitting}
            >
              <Save size={16} className="mr-2" />
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
