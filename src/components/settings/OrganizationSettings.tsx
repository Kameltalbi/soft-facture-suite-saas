
import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Building } from 'lucide-react';
import { Organization } from '@/types/settings';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { resizeImage, validateImageFile } from '@/utils/imageUtils';

interface OrganizationSettingsProps {
  organization?: Organization;
  onSave: (data: Partial<Organization>) => void;
}

export function OrganizationSettings({ organization, onSave }: OrganizationSettingsProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<Organization>>({
    name: organization?.name || '',
    address: organization?.address || '',
    email: organization?.email || '',
    phone: organization?.phone || '',
    website: organization?.website || '',
    siret: organization?.siret || '',
    fiscal_id: organization?.fiscal_id || '',
    vat_code: organization?.vat_code || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field: keyof Organization, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !organization?.id) return;

    // Validation du fichier
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast({
        title: 'Erreur',
        description: validation.error,
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      // Redimensionner l'image automatiquement
      const resizedFile = await resizeImage(file, 600, 200, 0.8);
      
      toast({
        title: 'Image optimisée',
        description: 'Votre logo a été automatiquement redimensionné pour de meilleures performances.',
      });

      // Generate a unique filename
      const fileExt = resizedFile.name.split('.').pop();
      const fileName = `${organization.id}-${Date.now()}.${fileExt}`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('organization-logos')
        .upload(fileName, resizedFile);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('organization-logos')
        .getPublicUrl(fileName);

      // Update the organization in the database
      const { error: updateError } = await supabase
        .from('organizations')
        .update({ logo_url: publicUrl })
        .eq('id', organization.id);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      onSave({ logo: publicUrl });

      toast({
        title: 'Succès',
        description: 'Logo mis à jour avec succès.',
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors du téléchargement du logo.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Informations de l'Organisation
        </CardTitle>
        <CardDescription>
          Gérez les informations de base de votre organisation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>Logo de l'organisation</Label>
            <div className="text-sm text-gray-600 mb-4">
              Format conseillé : horizontal, minimum 600 x 200 px, PNG ou SVG transparent
              <br />
              <span className="text-green-600 font-medium">✨ Redimensionnement automatique activé</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="logo-container w-80 h-22 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 p-3">
                {organization?.logo ? (
                  <img 
                    src={organization.logo} 
                    alt="Logo" 
                    className="max-w-full max-h-full object-contain" 
                  />
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Zone d'affichage du logo</span>
                    <div className="text-xs text-gray-400 mt-1">320 x 88 px</div>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleLogoClick}
                  disabled={uploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Optimisation...' : 'Changer le logo'}
                </Button>
                <div className="text-xs text-gray-500 max-w-48">
                  Formats acceptés : PNG, JPG, SVG<br/>
                  Taille max : 5MB<br/>
                  <span className="text-green-600">Redimensionnement auto</span>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'organisation *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Site web</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse complète *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={3}
              required
            />
          </div>


          {/* Fiscal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Identifiants fiscaux</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="siret">SIRET / Matricule fiscal</Label>
                <Input
                  id="siret"
                  value={formData.siret}
                  onChange={(e) => handleInputChange('siret', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fiscal_id">Identifiant fiscal</Label>
                <Input
                  id="fiscal_id"
                  value={formData.fiscal_id}
                  onChange={(e) => handleInputChange('fiscal_id', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vat_code">Code TVA</Label>
                <Input
                  id="vat_code"
                  value={formData.vat_code}
                  onChange={(e) => handleInputChange('vat_code', e.target.value)}
                />
              </div>
            </div>
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
