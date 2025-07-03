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
      title: "Simplicité",
      description: "Une interface claire, rapide et sans jargon"
    },
    {
      icon: <Shield className="h-8 w-8 text-[#6A9C89]" />,
      title: "Fiabilité",
      description: "Des données sécurisées et sauvegardées"
    },
    {
      icon: <Settings className="h-8 w-8 text-[#6A9C89]" />,
      title: "Adaptabilité",
      description: "Des fonctionnalités activables selon les besoins"
    },
    {
      icon: <Heart className="h-8 w-8 text-[#6A9C89]" />,
      title: "Accompagnement",
      description: "Une équipe disponible pour vous guider"
    }
  ];

  const products = [
    {
      name: "Trezo",
      description: "Application de gestion de trésorerie"
    },
    {
      name: "VoxCRM",
      description: "Outil de gestion de la relation client"
    },
    {
      name: "SoftFacture",
      description: "Plateforme de facturation moderne et conforme"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#6A9C89]/10 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            SoftFacture, la solution de facturation pensée pour les entrepreneurs exigeants
          </h1>
          <div className="max-w-4xl mx-auto space-y-6 text-lg text-muted-foreground">
            <p>
              SoftFacture est une application de facturation en ligne conçue pour répondre aux besoins spécifiques des entrepreneurs, TPE, PME et indépendants en Tunisie et ailleurs. Notre solution allie simplicité d'utilisation, puissance fonctionnelle et conformité, tout en offrant une expérience moderne et intuitive.
            </p>
            <p>
              SoftFacture est développée par <strong className="text-[#6A9C89]">Archibat Digital</strong>, l'agence digitale de la revue tunisienne <strong className="text-[#6A9C89]">Archibat</strong>, référence dans l'univers de l'architecture et de la construction depuis 1997.
            </p>
          </div>
        </div>
      </section>

      {/* Notre origine */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Notre origine</h2>
            <Card>
              <CardContent className="p-8">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  La revue Archibat accompagne depuis plus de 25 ans les acteurs du bâtiment et de la ville en Tunisie. Face aux besoins croissants de digitalisation dans les métiers de la construction, Archibat a fondé <strong className="text-[#6A9C89]">Archibat Digital</strong> en 2017. Cette agence est dédiée à la création de solutions numériques adaptées aux professionnels : sites web, campagnes digitales, et désormais des applications métier innovantes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Suite logicielle */}
      <section className="py-20 bg-gradient-to-br from-[#6A9C89]/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Une suite logicielle dédiée aux besoins réels</h2>
            <p className="text-lg text-muted-foreground text-center mb-12">
              SoftFacture fait partie d'une gamme d'outils métiers développés par Archibat Digital pour faciliter la gestion quotidienne des entreprises :
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-[#6A9C89] mb-2">{product.name}</h3>
                    <p className="text-muted-foreground">{product.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-center text-muted-foreground mt-8">
              Chaque solution a été pensée en lien direct avec le terrain, en collaboration avec des utilisateurs issus de différents secteurs (bâtiment, industrie, services...).
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Notre mission</h2>
            <Card>
              <CardContent className="p-8">
                <blockquote className="text-2xl text-[#6A9C89] font-medium mb-6">
                  "Aider les entreprises à structurer leur activité, à mieux gérer leurs revenus et à rester conformes aux exigences comptables locales et internationales."
                </blockquote>
                <p className="text-lg text-muted-foreground">
                  SoftFacture permet de gagner du temps, de réduire les erreurs manuelles et d'améliorer la traçabilité et la fiabilité des documents financiers.
                </p>
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