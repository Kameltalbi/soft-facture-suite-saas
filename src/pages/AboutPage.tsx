import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/homepage/Footer';
import { Target, Shield, Settings, Heart, Mail, Phone, MessageCircle } from 'lucide-react';

const AboutPage = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: <Target className="h-8 w-8 text-[#6A9C89]" />,
      title: "Accessibilité",
      description: "Une solution intuitive, sans jargon technique, adaptée aux non-spécialistes"
    },
    {
      icon: <Shield className="h-8 w-8 text-[#6A9C89]" />,
      title: "Fiabilité",
      description: "Des données sécurisées, une infrastructure robuste"
    },
    {
      icon: <Heart className="h-8 w-8 text-[#6A9C89]" />,
      title: "Proximité",
      description: "Un support humain, basé en Tunisie, à l'écoute de vos besoins"
    },
    {
      icon: <Settings className="h-8 w-8 text-[#6A9C89]" />,
      title: "Évolution continue",
      description: "De nouvelles fonctionnalités sont régulièrement déployées selon les retours utilisateurs"
    }
  ];

  const expertiseAreas = [
    "La transformation digitale",
    "Le développement commercial", 
    "La transition climatique"
  ];

  const features = [
    "Créer et envoyer des factures, devis, avoirs, bons de commande et bons de livraison en quelques clics",
    "Suivre les paiements et gérer les recouvrements",
    "Organiser ses produits et services",
    "Gérer ses clients et catégories d'articles",
    "Générer des rapports pour piloter son activité",
    "Personnaliser les documents (mentions, logos, taxes, devises, templates PDF...)"
  ];

  const targetUsers = [
    {
      title: "Aux entrepreneurs",
      description: "qui veulent garder le contrôle facilement"
    },
    {
      title: "Aux commerciaux", 
      description: "qui souhaitent gagner du temps dans le suivi client"
    },
    {
      title: "Aux dirigeants",
      description: "qui ont besoin d'indicateurs fiables pour piloter"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#6A9C89]/10 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            À propos de SoftFacture
          </h1>
          <div className="max-w-4xl mx-auto space-y-6 text-lg text-muted-foreground">
            <p>
              SoftFacture est une solution de facturation et de gestion commerciale conçue et développée par <strong className="text-[#6A9C89]">KT Consulting & Co</strong>, une société tunisienne de conseil aux entreprises spécialisée dans trois domaines clés :
            </p>
            <div className="grid md:grid-cols-3 gap-4 my-8">
              {expertiseAreas.map((area, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-4">
                    <p className="text-[#6A9C89] font-medium">{area}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Notre expertise */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Notre expertise au service des entreprises</h2>
            <Card>
              <CardContent className="p-8">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Depuis sa création, KT Consulting & Co accompagne les TPE, PME et organisations dans la modernisation de leurs outils, la structuration de leurs processus commerciaux, et la mise en œuvre de solutions durables, efficaces et conformes aux standards actuels.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  SoftFacture est née de cette expérience terrain, avec pour objectif de fournir une application simple, robuste et performante pour aider les entreprises à mieux gérer leur activité quotidienne.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Qu'est-ce que SoftFacture */}
      <section className="py-20 bg-gradient-to-br from-[#6A9C89]/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Qu'est-ce que SoftFacture ?</h2>
            <p className="text-lg text-muted-foreground text-center mb-8">
              SoftFacture est une application SaaS de gestion de facturation pensée pour les entreprises de toutes tailles. Elle permet de :
            </p>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <p className="text-muted-foreground">• {feature}</p>
                  </CardContent>
                </Card>
              ))}
              <Card>
                <CardContent className="p-4">
                  <p className="text-muted-foreground">• Et bien plus encore…</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi SoftFacture */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Pourquoi SoftFacture ?</h2>
            <Card className="mb-8">
              <CardContent className="p-8">
                <p className="text-lg text-muted-foreground leading-relaxed text-center">
                  Parce que nous savons que la gestion administrative est souvent chronophage, SoftFacture automatise les tâches répétitives et améliore la visibilité financière. Elle s'adresse :
                </p>
              </CardContent>
            </Card>
            <div className="grid md:grid-cols-3 gap-6">
              {targetUsers.map((user, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-[#6A9C89] mb-2">{user.title}</h3>
                    <p className="text-muted-foreground">{user.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="mt-8">
              <CardContent className="p-8">
                <p className="text-lg text-muted-foreground leading-relaxed text-center">
                  Accessible en ligne, sans installation, SoftFacture est pensée pour fonctionner partout, en toute sécurité, et pour s'adapter aux besoins concrets du tissu économique tunisien et africain.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-gradient-to-br from-[#6A9C89]/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Notre mission</h2>
            <Card>
              <CardContent className="p-8">
                <blockquote className="text-2xl text-[#6A9C89] font-medium mb-6">
                  "Aider les entreprises à structurer leur activité commerciale, à gagner en efficacité, et à préparer l'avenir grâce à des outils numériques simples, adaptés et évolutifs."
                </blockquote>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-20 bg-gradient-to-br from-[#6A9C89]/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Nos valeurs</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {value.icon}
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                        <p className="text-muted-foreground">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Nous contacter</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Vous avez des questions ou souhaitez une démonstration ?
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-3">
                <Mail className="h-5 w-5 text-[#6A9C89]" />
                <a href="mailto:contact@softfacture.com" className="text-[#6A9C89] hover:underline">
                  contact@softfacture.com
                </a>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Phone className="h-5 w-5 text-[#6A9C89]" />
                <a href="tel:+21655053505" className="text-[#6A9C89] hover:underline">
                  +216 55 053 505
                </a>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <MessageCircle className="h-5 w-5 text-[#6A9C89]" />
                <a href="https://wa.me/21655053505" className="text-[#6A9C89] hover:underline">
                  WhatsApp : +216 55 053 505
                </a>
              </div>
            </div>
            <div className="mt-8">
              <Button 
                size="lg"
                className="bg-[#6A9C89] hover:bg-[#5A8A75] text-white"
                onClick={() => navigate('/demo')}
              >
                Demander une démonstration
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;