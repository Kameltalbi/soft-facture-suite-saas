import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff } from 'lucide-react';

export const ProfileSettings = () => {
  const { toast } = useToast();
  const { profile, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation des mots de passe
      if (formData.newPassword !== formData.confirmPassword) {
        toast({
          title: 'Erreur',
          description: 'Les nouveaux mots de passe ne correspondent pas',
          variant: 'destructive',
        });
        return;
      }

      if (formData.newPassword.length < 8) {
        toast({
          title: 'Erreur',
          description: 'Le nouveau mot de passe doit contenir au moins 8 caractères',
          variant: 'destructive',
        });
        return;
      }

      // Changer le mot de passe avec Supabase
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword
      });

      if (error) throw error;

      // Réinitialiser le formulaire
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      toast({
        title: 'Succès',
        description: 'Votre mot de passe a été mis à jour avec succès',
      });

    } catch (error: any) {
      console.error('Erreur lors du changement de mot de passe:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors du changement de mot de passe',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    // Cette fonctionnalité peut être ajoutée plus tard si nécessaire
    toast({
      title: 'Information',
      description: 'La mise à jour du profil sera disponible prochainement',
    });
  };

  return (
    <div className="space-y-6">
      {/* Informations du profil */}
      <Card>
        <CardHeader>
          <CardTitle>Informations du profil</CardTitle>
          <CardDescription>
            Informations de votre compte utilisateur
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Prénom</Label>
              <Input 
                value={profile?.first_name || ''} 
                disabled
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label>Nom</Label>
              <Input 
                value={profile?.last_name || ''} 
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>
          <div>
            <Label>Email</Label>
            <Input 
              value={user?.email || ''} 
              disabled
              className="bg-gray-50"
            />
          </div>
          <div>
            <Label>Rôle</Label>
            <Input 
              value={profile?.role || ''} 
              disabled
              className="bg-gray-50"
            />
          </div>
          <p className="text-sm text-gray-500">
            Pour modifier ces informations, contactez votre administrateur.
          </p>
        </CardContent>
      </Card>

      {/* Changement de mot de passe */}
      <Card>
        <CardHeader>
          <CardTitle>Changer le mot de passe</CardTitle>
          <CardDescription>
            Mettez à jour votre mot de passe pour sécuriser votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  placeholder="Entrez votre nouveau mot de passe"
                  required
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirmez votre nouveau mot de passe"
                  required
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={loading || !formData.newPassword || !formData.confirmPassword}
                className="w-full"
              >
                {loading ? 'Mise à jour...' : 'Changer le mot de passe'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};