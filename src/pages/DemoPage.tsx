
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/homepage/Footer';
import { CheckCircle, Clock, Users, Zap, Mail, Phone, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DemoPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    message: '',
    wantsCallback: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      wantsCallback: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Demo request submitted:', formData);
    setIsSubmitted(true);
    toast({
      title: "Demande envoyée !",
      description: "Nous vous contacterons dans les 24h pour planifier votre démonstration.",
    });
  };

  const scrollToForm = () => {
    document.getElementById('demo-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-white to-[#F7F9FA]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Découvrez SoftFacture 
                  <span className="text-[#6A9C89]"> en action</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Une démonstration rapide, personnalisée, sans engagement pour voir comment 
                  SoftFacture peut simplifier votre gestion commerciale.
                </p>
              </div>
              
              <Button 
                size="lg"
                className="bg-[#6A9C89] hover:bg-[#5A8A75] text-white px-8 py-3 text-lg"
                onClick={scrollToForm}
              >
                Réservez votre démo
              </Button>
            </div>
            
            <div className="lg:pl-8">
              <Card className="p-6 shadow-2xl bg-white rounded-2xl">
                <div className="aspect-video bg-white rounded-xl overflow-hidden">
                  <img 
                    src="/lovable-uploads/aa6d5b72-4a25-4522-94b2-7dfd5d462531.png" 
                    alt="Interface SoftFacture - Démonstration"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Request Demo Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi réserver une démo ?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="mx-auto w-16 h-16 bg-[#6A9C89] rounded-full flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg">Fonctionnalités adaptées</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Découvrez les fonctionnalités adaptées à votre activité
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="mx-auto w-16 h-16 bg-[#6A9C89] rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg">Questions en direct</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Posez vos questions en direct à notre équipe
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="mx-auto w-16 h-16 bg-[#6A9C89] rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg">Interface réelle</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Visualisez l'interface et les flux en conditions réelles
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="mx-auto w-16 h-16 bg-[#6A9C89] rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg">Rapide et efficace</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Gagnez du temps : la démo dure entre 15 et 30 minutes
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Request Form */}
      <section id="demo-form" className="py-20 bg-[#F5F7F6]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Remplissez le formulaire
              </h2>
              <p className="text-xl text-gray-600">
                Notre équipe vous recontactera dans les plus brefs délais
              </p>
            </div>

            {isSubmitted ? (
              <Card className="p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Merci !</h3>
                <p className="text-gray-600 text-lg">
                  Nous vous contacterons dans les 24h pour planifier votre démonstration.
                </p>
              </Card>
            ) : (
              <Card className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nom complet *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email professionnel *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Nom de l'entreprise *</Label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        required
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Fonction</Label>
                    <Input
                      id="position"
                      name="position"
                      type="text"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message ou besoin spécifique (facultatif)</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full"
                      placeholder="Décrivez vos besoins spécifiques ou posez vos questions..."
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="callback"
                      checked={formData.wantsCallback}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <Label htmlFor="callback" className="text-sm">
                      Je souhaite être rappelé pour fixer un rendez-vous
                    </Label>
                  </div>

                  <Button 
                    type="submit"
                    className="w-full bg-[#6A9C89] hover:bg-[#5A8A75] text-white py-3 text-lg"
                  >
                    Envoyer ma demande
                  </Button>
                </form>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Direct Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Vous préférez nous contacter directement ?
              </h2>
              <p className="text-xl text-gray-600">
                Vous pouvez aussi nous écrire, nous appeler ou discuter sur WhatsApp. 
                Nous nous ferons un plaisir de répondre à vos questions ou de fixer un rendez-vous.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="mx-auto w-16 h-16 bg-[#6A9C89] rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Email</h3>
                <a 
                  href="mailto:contact@softfacture.com"
                  className="text-[#6A9C89] hover:underline"
                >
                  contact@softfacture.com
                </a>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="mx-auto w-16 h-16 bg-[#6A9C89] rounded-full flex items-center justify-center mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Téléphone</h3>
                <a 
                  href="tel:+21655053505"
                  className="text-[#6A9C89] hover:underline"
                >
                  +216 55 053 505
                </a>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="mx-auto w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">WhatsApp</h3>
                <a 
                  href="https://wa.me/21655053055"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg hover:bg-[#128C7E] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Lancer WhatsApp
                </a>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-[#F5F7F6]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#6A9C89] rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Hébergement sécurisé</h3>
                <p className="text-gray-600">Vos données sont protégées</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#6A9C89] rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">100% Cloud tunisien</h3>
                <p className="text-gray-600">Solution locale et adaptée</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#6A9C89] rounded-full flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Support réactif</h3>
                <p className="text-gray-600">Accompagnement personnalisé</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DemoPage;
