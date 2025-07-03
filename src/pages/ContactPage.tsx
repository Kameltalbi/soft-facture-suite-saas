import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/homepage/Footer';
import { Mail, Phone, MessageCircle, MapPin, Clock, Send } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message envoyé",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });
    setFormData({ name: '', email: '', company: '', phone: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#6A9C89]/10 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Contactez-nous
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Notre équipe est là pour répondre à vos questions et vous accompagner dans votre projet de digitalisation.
          </p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Send className="h-5 w-5 text-[#6A9C89]" />
                  <span>Envoyez-nous un message</span>
                </CardTitle>
                <CardDescription>
                  Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Votre nom"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Entreprise</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Nom de votre entreprise"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+216 XX XXX XXX"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Décrivez votre projet ou posez vos questions..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#6A9C89] hover:bg-[#5A8A75] text-white"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer le message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Contact Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Nos coordonnées</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="h-5 w-5 text-[#6A9C89] mt-1" />
                    <div>
                      <h4 className="font-semibold">Email</h4>
                      <a 
                        href="mailto:contact@softfacture.com" 
                        className="text-[#6A9C89] hover:underline"
                      >
                        contact@softfacture.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="h-5 w-5 text-[#6A9C89] mt-1" />
                    <div>
                      <h4 className="font-semibold">Téléphone</h4>
                      <a 
                        href="tel:+21655053505" 
                        className="text-[#6A9C89] hover:underline"
                      >
                        +216 55 053 505
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <MessageCircle className="h-5 w-5 text-[#6A9C89] mt-1" />
                    <div>
                      <h4 className="font-semibold">WhatsApp</h4>
                      <a 
                        href="https://wa.me/21655053505" 
                        className="text-[#6A9C89] hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        +216 55 053 505
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <MapPin className="h-5 w-5 text-[#6A9C89] mt-1" />
                    <div>
                      <h4 className="font-semibold">Adresse</h4>
                      <p className="text-muted-foreground">
                        Archibat Digital<br />
                        Tunis, Tunisie
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Clock className="h-5 w-5 text-[#6A9C89] mt-1" />
                    <div>
                      <h4 className="font-semibold">Horaires</h4>
                      <p className="text-muted-foreground">
                        Lundi - Vendredi : 9h00 - 18h00<br />
                        Samedi : 9h00 - 13h00
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Demo CTA */}
              <Card className="bg-gradient-to-br from-[#6A9C89]/5 to-background">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-4">Préférez une démonstration ?</h3>
                  <p className="text-muted-foreground mb-6">
                    Réservez un créneau pour une démonstration personnalisée de SoftFacture.
                  </p>
                  <Button 
                    className="bg-[#6A9C89] hover:bg-[#5A8A75] text-white"
                    onClick={() => window.location.href = '/demo'}
                  >
                    Réserver une démo
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;