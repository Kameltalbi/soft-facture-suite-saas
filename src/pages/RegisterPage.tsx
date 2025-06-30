import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Upload, Eye, EyeOff } from 'lucide-react';
import { resizeImage, validateImageFile } from '@/utils/imageUtils';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  organizationName: string;
  sector: string;
  logo?: FileList;
  acceptTerms: boolean;
}

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [processingLogo, setProcessingLogo] = useState(false);
  const { toast } = useToast();

  const form = useForm<RegisterFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      organizationName: '',
      sector: '',
      acceptTerms: false,
    },
  });

  const sectors = [
    'Consulting',
    'E-commerce',
    'Services',
    'Commerce de détail',
    'BTP / Construction',
    'Santé',
    'Éducation',
    'Finance',
    'Technologie',
    'Restauration',
    'Immobilier',
    'Autre'
  ];

  const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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

    setProcessingLogo(true);
    
    try {
      // Redimensionner l'image automatiquement
      const resizedFile = await resizeImage(file, 600, 200, 0.8);
      
      // Créer l'aperçu
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(resizedFile);
      
      setLogoFile(resizedFile);
      
      toast({
        title: 'Image optimisée',
        description: 'Votre logo a été automatiquement redimensionné pour de meilleures performances.',
      });
    } catch (error) {
      console.error('Error processing logo:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de traiter l\'image.',
        variant: 'destructive',
      });
    } finally {
      setProcessingLogo(false);
    }
  };

  const onSubmit = (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    if (!data.acceptTerms) {
      toast({
        title: "Erreur",
        description: "Vous devez accepter les conditions d'utilisation",
        variant: "destructive",
      });
      return;
    }

    // Simuler l'inscription avec le logo optimisé
    console.log('Données d\'inscription:', { ...data, optimizedLogo: logoFile });
    toast({
      title: "Compte créé avec succès !",
      description: "Bienvenue dans Soft Facture",
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F9FA] flex items-center justify-center p-4">
      <Card className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-md">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Créer mon compte Soft Facture
          </CardTitle>
          <p className="text-gray-600">
            14 jours d'essai gratuit - Sans carte bancaire
          </p>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  rules={{ required: "Le prénom est obligatoire" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom *</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre prénom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  rules={{ required: "Le nom est obligatoire" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom *</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre nom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                rules={{ 
                  required: "L'email est obligatoire",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Format d'email invalide"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="votre@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                rules={{ 
                  required: "Le mot de passe est obligatoire",
                  minLength: {
                    value: 8,
                    message: "Le mot de passe doit contenir au moins 8 caractères"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Votre mot de passe"
                          {...field} 
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                rules={{ required: "Confirmez votre mot de passe" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmer le mot de passe *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showConfirmPassword ? "text" : "password"} 
                          placeholder="Confirmez votre mot de passe"
                          {...field} 
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-4">Informations de votre organisation</h3>
                
                <FormField
                  control={form.control}
                  name="organizationName"
                  rules={{ required: "Le nom de l'organisation est obligatoire" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l'organisation *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom de votre entreprise" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sector"
                  rules={{ required: "Le secteur d'activité est obligatoire" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secteur d'activité *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez votre secteur" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sectors.map((sector) => (
                            <SelectItem key={sector} value={sector}>
                              {sector}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label>Logo (facultatif)</Label>
                  <div className="text-sm text-gray-600 mb-3">
                    Format conseillé : horizontal, minimum 600 x 200 px, PNG ou SVG
                    <br />
                    <span className="text-green-600 font-medium">✨ Redimensionnement automatique</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="logo-container flex items-center justify-center w-48 h-22 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#6A9C89] transition-colors bg-gray-50 p-2">
                      {processingLogo ? (
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#6A9C89] mx-auto mb-2"></div>
                          <span className="text-xs text-gray-500">Optimisation...</span>
                        </div>
                      ) : logoPreview ? (
                        <img 
                          src={logoPreview} 
                          alt="Logo preview" 
                          className="max-w-full max-h-full object-contain rounded-lg" 
                        />
                      ) : (
                        <div className="text-center">
                          <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                          <span className="text-xs text-gray-500">Zone d'affichage</span>
                          <div className="text-xs text-gray-400">192 x 88 px</div>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoChange}
                        disabled={processingLogo}
                      />
                    </label>
                    <div className="text-xs text-gray-500">
                      <div>• PNG, JPG, SVG acceptés</div>
                      <div>• Taille max : 5MB</div>
                      <div className="text-green-600">• Redimensionnement auto</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={form.watch('acceptTerms')}
                  onCheckedChange={(checked) => form.setValue('acceptTerms', checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  J'accepte les conditions d'utilisation
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#6A9C89] hover:bg-[#5c8876] text-white font-semibold py-3"
              >
                Créer mon compte
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Vous avez déjà un compte ?{' '}
                  <Link to="/login" className="text-[#6A9C89] hover:underline font-medium">
                    Connexion
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
