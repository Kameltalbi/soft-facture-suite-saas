
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Building } from 'lucide-react';
import { Organization } from '@/types/settings';

interface OrganizationSettingsProps {
  organization?: Organization;
  onSave: (data: Partial<Organization>) => void;
}

export function OrganizationSettings({ organization, onSave }: OrganizationSettingsProps) {
  const [formData, setFormData] = useState<Partial<Organization>>({
    name: organization?.name || '',
    address: organization?.address || '',
    email: organization?.email || '',
    phone: organization?.phone || '',
    website: organization?.website || '',
    rib: organization?.rib || '',
    iban: organization?.iban || '',
    swift: organization?.swift || '',
    bank: organization?.bank || '',
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
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                {organization?.logo ? (
                  <img src={organization.logo} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                ) : (
                  <Upload className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <Button type="button" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Changer le logo
              </Button>
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

          {/* Banking Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informations bancaires</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rib">RIB</Label>
                <Input
                  id="rib"
                  value={formData.rib}
                  onChange={(e) => handleInputChange('rib', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="iban">IBAN</Label>
                <Input
                  id="iban"
                  value={formData.iban}
                  onChange={(e) => handleInputChange('iban', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="swift">Code SWIFT</Label>
                <Input
                  id="swift"
                  value={formData.swift}
                  onChange={(e) => handleInputChange('swift', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank">Banque</Label>
                <Input
                  id="bank"
                  value={formData.bank}
                  onChange={(e) => handleInputChange('bank', e.target.value)}
                />
              </div>
            </div>
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
