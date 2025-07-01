
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
  const [currentStep, setCurrentStep] = useState(1);
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

  const handleNextStep = async () => {
    if (currentStep === 1) {
      // Valider les champs d'inscription
      const isValid = await form.trigger(['firstName', 'lastName', 'email', 'phone', 'password', 'companyName']);
      if (isValid) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
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
      // Créer le compte utilisateur avec is_active = false
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

      // Rediriger vers la page d'attente de validation
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
              <p><strong>Bénéficiaire :</strong> SoftFacture SARL</p>
              <p><strong>IBAN :</strong> TN59 1234 5678 9012 3456 7890 12</p>
              <p><strong>BIC :</strong> BFTNTNTTXXX</p>
              <p><strong>Banque :</strong> Banque de Financement des PME</p>
              <p><strong>Référence :</strong> {form.watch('email')}</p>
            </div>
          </div>
        );
      case 'check':
        return (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Paiement par chèque</h4>
            <div className="text-sm text-green-800">
              <p><strong>À l'ordre de :</strong> SoftFacture SARL</p>
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
    <div className="min-h-screen bg-[#F7F9FA] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Titre principal */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Créez votre compte et activez votre abonnement
          </h1>
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-[#6A9C89]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-[#6A9C89] text-white' : 'bg-gray-200'}`}>1</div>
              <span>Inscription</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-[#6A9C89]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-[#6A9C89] text-white' : 'bg-gray-200'}`}>2</div>
              <span>Plan</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-[#6A9C89]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-[#6A9C89] text-white' : 'bg-gray-200'}`}>3</div>
              <span>Paiement</span>
            </div>
          </div>
        </div>

        <Card className="bg-white rounded-2xl shadow-md">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Étape 1: Formulaire d'inscription */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations personnelles</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          <FormLabel>Email professionnel *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="votre@email.com" {...field} />
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
                          <FormLabel>Téléphone *</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+216 XX XXX XXX" {...field} />
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
                      name="companyName"
                      rules={{ required: "Le nom de l'entreprise est obligatoire" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom de l'entreprise *</FormLabel>
                          <FormControl>
                            <Input placeholder="Nom de votre entreprise" {...field} />
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
                          <FormLabel>Fonction (facultatif)</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre fonction dans l'entreprise" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Étape 2: Choix du plan */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Choix du plan</h2>
                    
                    <FormField
                      control={form.control}
                      name="plan"
                      render={({ field }) => (
                        <FormItem>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                          >
                            <div className="space-y-4">
                              <Label
                                htmlFor="essential"
                                className={`cursor-pointer rounded-lg border-2 p-6 hover:border-[#6A9C89] ${field.value === 'essential' ? 'border-[#6A9C89] bg-[#6A9C89]/5' : 'border-gray-200'}`}
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
                                className={`cursor-pointer rounded-lg border-2 p-6 hover:border-[#6A9C89] ${field.value === 'pro' ? 'border-[#6A9C89] bg-[#6A9C89]/5' : 'border-gray-200'}`}
                              >
                                <div className="flex items-start space-x-3">
                                  <RadioGroupItem value="pro" id="pro" className="mt-1" />
                                  <div className="space-y-2">
                                    <h3 className="text-lg font-semibold">Plan Pro</h3>
                                    <p className="text-2xl font-bold text-[#6A9C89]">540 DT HT/an</p>
                                    <p className="text-sm text-gray-600">3 utilisateurs inclus</p>
                                    <div className="inline-block bg-[#D96C4F] text-white text-xs px-2 py-1 rounded">
                                      Recommandé
                                    </div>
                                  </div>
                                </div>
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="additionalUsers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Utilisateurs supplémentaires (20 DT HT/utilisateur)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="50"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">Récapitulatif</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Plan {watchedPlan === 'essential' ? 'Essentiel' : 'Pro'}</span>
                          <span>{planPrices[watchedPlan]} DT HT</span>
                        </div>
                        {watchedAdditionalUsers > 0 && (
                          <div className="flex justify-between">
                            <span>{watchedAdditionalUsers} utilisateur(s) supplémentaire(s)</span>
                            <span>{watchedAdditionalUsers * 20} DT HT</span>
                          </div>
                        )}
                        <div className="border-t pt-2 flex justify-between font-bold text-lg text-[#6A9C89]">
                          <span>Total HT à payer</span>
                          <span>{calculateTotal()} DT HT</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Étape 3: Sélection du mode de paiement */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Mode de paiement</h2>
                    
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
                              className={`cursor-pointer rounded-lg border-2 p-4 hover:border-[#6A9C89] ${field.value === 'bank_transfer' ? 'border-[#6A9C89] bg-[#6A9C89]/5' : 'border-gray-200'}`}
                            >
                              <div className="flex items-center space-x-3">
                                <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                                <Building className="w-5 h-5" />
                                <span>Virement bancaire</span>
                              </div>
                            </Label>

                            <Label
                              htmlFor="check"
                              className={`cursor-pointer rounded-lg border-2 p-4 hover:border-[#6A9C89] ${field.value === 'check' ? 'border-[#6A9C89] bg-[#6A9C89]/5' : 'border-gray-200'}`}
                            >
                              <div className="flex items-center space-x-3">
                                <RadioGroupItem value="check" id="check" />
                                <Check className="w-5 h-5" />
                                <span>Paiement par chèque</span>
                              </div>
                            </Label>

                            <Label
                              htmlFor="cash"
                              className={`cursor-pointer rounded-lg border-2 p-4 hover:border-[#6A9C89] ${field.value === 'cash' ? 'border-[#6A9C89] bg-[#6A9C89]/5' : 'border-gray-200'}`}
                            >
                              <div className="flex items-center space-x-3">
                                <RadioGroupItem value="cash" id="cash" />
                                <Banknote className="w-5 h-5" />
                                <span>Paiement en espèces</span>
                              </div>
                            </Label>

                            <Label
                              htmlFor="card"
                              className="cursor-not-allowed rounded-lg border-2 p-4 border-gray-200 bg-gray-50 opacity-50"
                            >
                              <div className="flex items-center space-x-3">
                                <RadioGroupItem value="card" id="card" disabled />
                                <CreditCard className="w-5 h-5" />
                                <span>Carte bancaire (bientôt disponible)</span>
                              </div>
                            </Label>
                          </RadioGroup>
                        </FormItem>
                      )}
                    />

                    {getPaymentInstructions()}

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2 text-[#6A9C89]">Total à payer : {calculateTotal()} DT HT</h3>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="confirmPayment" 
                        checked={form.watch('confirmPayment')}
                        onCheckedChange={(checked) => form.setValue('confirmPayment', checked as boolean)}
                      />
                      <label
                        htmlFor="confirmPayment"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Je confirme avoir effectué ou programmé mon paiement
                      </label>
                    </div>
                  </div>
                )}

                {/* Boutons de navigation */}
                <div className="flex justify-between pt-6 border-t">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePreviousStep}
                      className="px-8"
                    >
                      Précédent
                    </Button>
                  )}
                  
                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="bg-[#6A9C89] hover:bg-[#5c8876] text-white px-8 ml-auto"
                    >
                      Suivant
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting || !form.watch('confirmPayment')}
                      className="bg-[#6A9C89] hover:bg-[#5c8876] text-white px-8 ml-auto"
                    >
                      {isSubmitting ? 'Finalisation...' : 'Finaliser mon inscription'}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutPage;
