
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, ArrowLeft, Upload } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  organizationName: string;
  organizationAddress: string;
  organizationEmail: string;
  organizationPhone: string;
  organizationWebsite: string;
  organizationVatNumber: string;
  organizationLogo?: FileList;
}

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const { signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();

  const loginForm = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerForm = useForm<RegisterFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      organizationName: '',
      organizationAddress: '',
      organizationEmail: '',
      organizationPhone: '',
      organizationWebsite: '',
      organizationVatNumber: '',
    },
  });

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onLogin = async (data: LoginFormData) => {
    const { error } = await signIn(data.email, data.password);
    
    if (error) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Email ou mot de passe incorrect",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Connexion réussie !",
      description: "Bienvenue dans Soft Facture",
    });
    
    navigate('/');
  };

  const onRegister = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    // Préparer les métadonnées de l'organisation
    const organizationData = {
      organization_name: data.organizationName,
      organization_address: data.organizationAddress,
      organization_email: data.organizationEmail,
      organization_phone: data.organizationPhone,
      organization_website: data.organizationWebsite,
      organization_vat_number: data.organizationVatNumber,
    };

    const { error } = await signUp(
      data.email,
      data.password,
      data.firstName,
      data.lastName,
      data.organizationName,
      organizationData,
      data.organizationLogo?.[0]
    );

    if (error) {
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Inscription réussie !",
      description: "Vérifiez votre email pour confirmer votre compte",
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F7F6] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/home')}
              className="absolute left-4 top-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Connexion' : 'Créer un compte'}
          </CardTitle>
          <p className="text-gray-600">
            {isLogin 
              ? 'Gérez votre facturation en toute simplicité'
              : 'Commencez votre essai gratuit'
            }
          </p>
        </CardHeader>
        
        <CardContent>
          {isLogin ? (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                <FormField
                  control={loginForm.control}
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="votre@email.com" 
                          className="h-12"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  rules={{ required: "Le mot de passe est obligatoire" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Votre mot de passe"
                            className="h-12 pr-10"
                            {...field} 
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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

                <Button 
                  type="submit" 
                  className="w-full bg-[#6A9C89] hover:bg-[#5c8876] text-white font-semibold py-3 h-12"
                  disabled={loading}
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-6">
                {/* Informations personnelles */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Informations personnelles</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={registerForm.control}
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
                      control={registerForm.control}
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
                    control={registerForm.control}
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
                    control={registerForm.control}
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
                    control={registerForm.control}
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
                </div>

                {/* Informations de l'organisation */}
                <div className="border-t pt-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Informations de l'organisation</h3>
                  
                  <FormField
                    control={registerForm.control}
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
                    control={registerForm.control}
                    name="organizationAddress"
                    rules={{ required: "L'adresse est obligatoire" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse complète *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Adresse de votre entreprise" 
                            rows={3}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={registerForm.control}
                      name="organizationEmail"
                      rules={{ 
                        required: "L'email de l'organisation est obligatoire",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Format d'email invalide"
                        }
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email de l'organisation *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="contact@entreprise.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="organizationPhone"
                      rules={{ required: "Le téléphone est obligatoire" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone *</FormLabel>
                          <FormControl>
                            <Input placeholder="+33 1 23 45 67 89" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={registerForm.control}
                      name="organizationWebsite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site web</FormLabel>
                          <FormControl>
                            <Input placeholder="https://www.entreprise.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="organizationVatNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numéro de TVA</FormLabel>
                          <FormControl>
                            <Input placeholder="FR12345678901" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Logo upload */}
                  <div className="space-y-2">
                    <FormLabel>Logo de l'organisation</FormLabel>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#6A9C89] transition-colors">
                        {logoPreview ? (
                          <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain rounded-lg" />
                        ) : (
                          <div className="text-center">
                            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">Ajouter un logo</span>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoChange}
                          {...registerForm.register('organizationLogo')}
                        />
                      </label>
                    </div>
                    <p className="text-sm text-gray-500">Formats acceptés: JPG, PNG, GIF, WebP (max 5MB)</p>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#6A9C89] hover:bg-[#5c8876] text-white font-semibold py-3"
                  disabled={loading}
                >
                  {loading ? 'Création...' : 'Créer mon compte'}
                </Button>
              </form>
            </Form>
          )}

          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              {isLogin ? "Vous n'avez pas encore de compte ?" : "Vous avez déjà un compte ?"}{' '}
              <Button 
                variant="link" 
                className="text-[#6A9C89] hover:underline font-medium p-0"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Créez un compte' : 'Connexion'}
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
