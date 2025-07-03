import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CreditCard, Building, Banknote, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  companyName: string;
  position?: string;
  plan: 'essential' | 'pro';
  additionalUsers: number;
  paymentMethod: 'bank_transfer' | 'check' | 'cash' | 'card';
  confirmPayment: boolean;
}

const CheckoutPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const form = useForm<CheckoutFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      companyName: '',
      position: '',
      plan: 'essential',
      additionalUsers: 0,
      paymentMethod: 'bank_transfer',
      confirmPayment: false,
    },
  });

  const watchedPlan = form.watch('plan');
  const watchedAdditionalUsers = form.watch('additionalUsers');
  const watchedPaymentMethod = form.watch('paymentMethod');

  const planPrices = {
    essential: 348,
    pro: 540
  };

  const calculateTotal = () => {
    const basePlan = planPrices[watchedPlan];
    const additionalUsersCost = watchedAdditionalUsers * 20;
    return basePlan + additionalUsersCost;
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (!data.confirmPayment) {
      toast({
        title: "Erreur",
        description: "Vous devez confirmer avoir effectué le paiement",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await signUp(
        data.email,
        data.password,
        data.firstName,
        data.lastName,
        data.companyName,
        {
          plan: data.plan,
          additional_users: data.additionalUsers,
          payment_method: data.paymentMethod,
          total_amount: calculateTotal(),
          position: data.position,
          phone: data.phone,
          is_active: false
        }
      );

      if (error) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Inscription réussie !",
        description: "Votre compte a été créé. Vous allez être redirigé vers la page de validation.",
      });

      navigate('/en-attente-validation');
    } catch (error) {
      console.error('Error during signup:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPaymentInstructions = () => {
    switch (watchedPaymentMethod) {
      case 'bank_transfer':
        return (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Virement bancaire</h4>
            <div className="text-sm text-blue-800">
              <p><strong>Bénéficiaire :</strong> ABC SARL</p>
              <p><strong>Banque :</strong> BIAT</p>
              <p><strong>RIB :</strong> 0804 3013 0 710 0000 8645</p>
              <p><strong>IBAN :</strong> TN59 0804 3013 0710 0000 8645</p>
              <p><strong>SWIFT :</strong> BIATTNTT</p>
              <p>{form.watch('email')}</p>
            </div>
          </div>
        );
      case 'check':
        return (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Paiement par chèque</h4>
            <div className="text-sm text-green-800">
              <p><strong>À l'ordre de :</strong> ABC SARL</p>
              <p><strong>Adresse :</strong> 123 Avenue de la République, 1001 Tunis, Tunisie</p>
              <p><strong>Note :</strong> Inscrivez votre email ({form.watch('email')}) au dos du chèque</p>
            </div>
          </div>
        );
      case 'cash':
        return (
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-semibold text-orange-900 mb-2">Paiement en espèces</h4>
            <div className="text-sm text-orange-800">
              <p><strong>Adresse :</strong> 123 Avenue de la République, 1001 Tunis</p>
              <p><strong>Horaires :</strong> Lundi-Vendredi 9h-17h</p>
              <p><strong>Contact :</strong> +216 55 053 505</p>
              <p><strong>Note :</strong> Munissez-vous d'une pièce d'identité</p>
            </div>
          </div>
        );
      case 'card':
        return (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Paiement par carte bancaire</h4>
            <p className="text-sm text-gray-600">Cette option sera bientôt disponible.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F9FA] to-[#E8F3F1] py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Créez votre compte et activez votre abonnement
          </h1>
          <p className="text-gray-600">
            Remplissez toutes les informations ci-dessous pour créer votre compte
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Sections 1 et 2 côte à côte */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Section 1: Informations personnelles */}
              <Card className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border-2 border-[#6A9C89]/20 hover:border-[#6A9C89]/40 transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-[#6A9C89] to-[#5A8A75] text-white rounded-t-2xl">
                  <CardTitle className="text-xl font-bold">
                    1. Informations personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      rules={{ required: "Le prénom est obligatoire" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-semibold">Prénom *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Votre prénom" 
                              className="border-2 border-gray-200 focus:border-[#6A9C89] transition-colors" 
                              {...field} 
                            />
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
                          <FormLabel className="text-gray-700 font-semibold">Nom *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Votre nom" 
                              className="border-2 border-gray-200 focus:border-[#6A9C89] transition-colors" 
                              {...field} 
                            />
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
                        <FormLabel className="text-gray-700 font-semibold">Email professionnel *</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="votre@email.com" 
                            className="border-2 border-gray-200 focus:border-[#6A9C89] transition-colors" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    rules={{ required: "Le téléphone est obligatoire" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold">Téléphone *</FormLabel>
                        <FormControl>
                          <Input 
                            type="tel" 
                            placeholder="+216 XX XXX XXX" 
                            className="border-2 border-gray-200 focus:border-[#6A9C89] transition-colors" 
                            {...field} 
                          />
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
                        <FormLabel className="text-gray-700 font-semibold">Mot de passe *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Votre mot de passe"
                              className="border-2 border-gray-200 focus:border-[#6A9C89] transition-colors pr-10"
                              {...field} 
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#6A9C89] transition-colors"
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
                    name="companyName"
                    rules={{ required: "Le nom de l'entreprise est obligatoire" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold">Nom de l'entreprise *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Nom de votre entreprise" 
                            className="border-2 border-gray-200 focus:border-[#6A9C89] transition-colors" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold">Fonction (facultatif)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Votre fonction dans l'entreprise" 
                            className="border-2 border-gray-200 focus:border-[#6A9C89] transition-colors" 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Section 2: Choix du plan */}
              <Card className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border-2 border-[#D96C4F]/20 hover:border-[#D96C4F]/40 transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-[#D96C4F] to-[#C85A43] text-white rounded-t-2xl">
                  <CardTitle className="text-xl font-bold">
                    2. Choix du plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <FormField
                    control={form.control}
                    name="plan"
                    render={({ field }) => (
                      <FormItem>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-4"
                        >
                          <Label
                            htmlFor="essential"
                            className={`cursor-pointer rounded-xl border-2 p-6 hover:border-[#6A9C89] hover:shadow-md transition-all duration-300 ${field.value === 'essential' ? 'border-[#6A9C89] bg-[#6A9C89]/5 shadow-md' : 'border-gray-200'}`}
                          >
                            <div className="flex items-start space-x-3">
                              <RadioGroupItem value="essential" id="essential" className="mt-1" />
                              <div className="space-y-2">
                                <h3 className="text-lg font-semibold">Plan Essentiel</h3>
                                <p className="text-2xl font-bold text-[#6A9C89]">348 DT HT/an</p>
                                <p className="text-sm text-gray-600">2 utilisateurs inclus</p>
                              </div>
                            </div>
                          </Label>
                          
                          <Label
                            htmlFor="pro"
                            className={`cursor-pointer rounded-xl border-2 p-6 hover:border-[#6A9C89] hover:shadow-md transition-all duration-300 ${field.value === 'pro' ? 'border-[#6A9C89] bg-[#6A9C89]/5 shadow-md' : 'border-gray-200'}`}
                          >
                            <div className="flex items-start space-x-3">
                              <RadioGroupItem value="pro" id="pro" className="mt-1" />
                              <div className="space-y-2">
                                <h3 className="text-lg font-semibold">Plan Pro</h3>
                                <p className="text-2xl font-bold text-[#6A9C89]">540 DT HT/an</p>
                                <p className="text-sm text-gray-600">3 utilisateurs inclus</p>
                                <div className="inline-block bg-[#D96C4F] text-white text-xs px-3 py-1 rounded-full">
                                  Recommandé
                                </div>
                              </div>
                            </div>
                          </Label>
                        </RadioGroup>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="additionalUsers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold">Utilisateurs supplémentaires (20 DT HT/utilisateur)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="50"
                            placeholder="0"
                            className="border-2 border-gray-200 focus:border-[#6A9C89] transition-colors"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="bg-gradient-to-r from-[#6A9C89]/10 to-[#D96C4F]/10 p-6 rounded-xl border border-[#6A9C89]/20">
                    <h3 className="font-semibold text-lg mb-3 text-gray-800">Récapitulatif</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Plan {watchedPlan === 'essential' ? 'Essentiel' : 'Pro'}</span>
                        <span className="font-semibold">{planPrices[watchedPlan]} DT HT</span>
                      </div>
                      {watchedAdditionalUsers > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-700">{watchedAdditionalUsers} utilisateur(s) supplémentaire(s)</span>
                          <span className="font-semibold">{watchedAdditionalUsers * 20} DT HT</span>
                        </div>
                      )}
                      <div className="border-t pt-3 flex justify-between font-bold text-lg text-[#6A9C89]">
                        <span>Total HT à payer</span>
                        <span className="text-xl">{calculateTotal()} DT HT</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Section 3: Mode de paiement en pleine largeur */}
            <Card className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border-2 border-blue-200 hover:border-blue-400 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl">
                <CardTitle className="text-2xl font-bold">
                  3. Mode de paiement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <Label
                          htmlFor="bank_transfer"
                          className={`cursor-pointer rounded-xl border-2 p-4 hover:border-[#6A9C89] hover:shadow-md transition-all duration-300 ${field.value === 'bank_transfer' ? 'border-[#6A9C89] bg-[#6A9C89]/5 shadow-md' : 'border-gray-200'}`}
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                            <Building className="w-5 h-5 text-[#6A9C89]" />
                            <span className="font-medium">Virement bancaire</span>
                          </div>
                        </Label>

                        <Label
                          htmlFor="check"
                          className={`cursor-pointer rounded-xl border-2 p-4 hover:border-[#6A9C89] hover:shadow-md transition-all duration-300 ${field.value === 'check' ? 'border-[#6A9C89] bg-[#6A9C89]/5 shadow-md' : 'border-gray-200'}`}
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="check" id="check" />
                            <Check className="w-5 h-5 text-[#6A9C89]" />
                            <span className="font-medium">Paiement par chèque</span>
                          </div>
                        </Label>

                        <Label
                          htmlFor="cash"
                          className={`cursor-pointer rounded-xl border-2 p-4 hover:border-[#6A9C89] hover:shadow-md transition-all duration-300 ${field.value === 'cash' ? 'border-[#6A9C89] bg-[#6A9C89]/5 shadow-md' : 'border-gray-200'}`}
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="cash" id="cash" />
                            <Banknote className="w-5 h-5 text-[#6A9C89]" />
                            <span className="font-medium">Paiement en espèces</span>
                          </div>
                        </Label>

                        <Label
                          htmlFor="card"
                          className="cursor-not-allowed rounded-xl border-2 p-4 border-gray-200 bg-gray-50 opacity-50"
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="card" id="card" disabled />
                            <CreditCard className="w-5 h-5" />
                            <span className="font-medium">Carte bancaire (bientôt disponible)</span>
                          </div>
                        </Label>
                      </RadioGroup>
                    </FormItem>
                  )}
                />

                {getPaymentInstructions()}

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
                  <h3 className="font-bold text-xl mb-2 text-[#6A9C89]">Total à payer : {calculateTotal()} DT HT</h3>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <Checkbox 
                    id="confirmPayment" 
                    checked={form.watch('confirmPayment')}
                    onCheckedChange={(checked) => form.setValue('confirmPayment', checked as boolean)}
                    className="border-2 border-[#6A9C89]"
                  />
                  <label
                    htmlFor="confirmPayment"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Je confirme avoir effectué ou programmé mon paiement
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Bouton de soumission */}
            <div className="text-center">
              <Button
                type="submit"
                disabled={isSubmitting || !form.watch('confirmPayment')}
                className="bg-gradient-to-r from-[#6A9C89] to-[#5A8A75] hover:from-[#5c8876] hover:to-[#4e7a67] text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                {isSubmitting ? 'Finalisation...' : 'Finaliser mon inscription'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CheckoutPage;