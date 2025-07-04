import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/homepage/Footer';
import { Check, X, Users, Mail, Phone, MessageCircle, CreditCard, Building, FileText } from 'lucide-react';

const PricingPage = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Plan Essentiel",
      price: "35 DT",
      period: "/ mois",
      yearlyPrice: "420 DT HT",
      description: "Pour les indépendants, microentreprises et petites structures.",
      features: [
        "Création illimitée de devis et de factures",
        "Pieds de page et mentions légales personnalisables",
        "Gestion des clients et produits",
        "Suivi des paiements",
        "Gestion des taxes personnalisées (% ou VA)",
        "Statistiques de ventes mensuelles",
        "Jusqu'à 2 utilisateurs inclus",
        "Utilisateur supplémentaire : 20 DT HT / an"
      ],
      excluded: [
        "Bons de commande fournisseurs",
        "Bons de livraison"
      ],
      popular: false
    },
    {
      name: "Plan Avancé",
      price: "45 DT",
      period: "/ mois",
      yearlyPrice: "540 DT HT",
      description: "Pour les entreprises structurées avec plusieurs documents commerciaux.",
      features: [
        "Toutes les fonctionnalités du Plan Essentiel",
        "Gestion des bons de commande fournisseurs",
        "Gestion des bons de livraison",
        "Export comptable avancé",
        "Jusqu'à 3 utilisateurs inclus",
        "Utilisateur supplémentaire : 20 DT HT / an"
      ],
      excluded: [],
      popular: true
    }
  ];

  const paymentMethods = [
    {
      title: "Virement bancaire",
      details: [
        "RIB : 0804 30130 710 0000 8645",
        "IBAN : TN59 0804 3013 0710 0000 8645",
        "SWIFT : BIATTNTT",
        "Bénéficiaire : ABC Archibat"
      ]
    },
    {
      title: "Paiement physique",
      details: [
        "Paiement par chèque dans nos bureaux",
        "Paiement en espèces dans nos bureaux"
      ]
    },
    {
      title: "Paiement en ligne",
      details: [
        "Paiement par carte bancaire",
        "(prochainement disponible)"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#6A9C89]/10 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Des plans simples et transparents adaptés à vos besoins
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            Gérez facilement vos devis, factures, paiements, taxes et documents comptables avec une solution professionnelle conçue pour les entreprises tunisiennes. Aucun engagement, aucun frais caché.
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nos abonnements</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-[#6A9C89] shadow-lg' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#6A9C89] text-white px-4 py-1 rounded-full text-sm font-medium">
                      Recommandé
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-4xl font-bold text-[#6A9C89]">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">payable annuellement ({plan.yearlyPrice})</p>
                  <CardDescription className="mt-4">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Fonctionnalités incluses :</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <Check className="h-4 w-4 text-[#6A9C89] mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {plan.excluded.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 text-muted-foreground">Non inclus :</h4>
                      <ul className="space-y-2">
                        {plan.excluded.map((feature, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <X className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-[#6A9C89] hover:bg-[#5A8A75]' : 'variant="outline" border-[#6A9C89] text-[#6A9C89] hover:bg-[#6A9C89] hover:text-white'}`}
                    onClick={() => navigate('/auth')}
                  >
                    Commencer avec {plan.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-gradient-to-br from-[#6A9C89]/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Démo gratuite</h2>
            <Card>
              <CardContent className="p-8">
                <p className="text-lg text-muted-foreground mb-6">
                  <strong>Vous souhaitez voir SoftFacture en action ?</strong>
                </p>
                <p className="text-muted-foreground mb-8">
                  Testez l'outil gratuitement lors d'une démonstration personnalisée. Notre équipe vous contacte pour vous accompagner et répondre à toutes vos questions.
                </p>
                <Button 
                  size="lg"
                  className="bg-[#6A9C89] hover:bg-[#5A8A75] text-white"
                  onClick={() => navigate('/demo')}
                >
                  Réserver une démo
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Moyens de paiement</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {paymentMethods.map((method, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      {index === 0 && <Building className="h-5 w-5 text-[#6A9C89]" />}
                      {index === 1 && <FileText className="h-5 w-5 text-[#6A9C89]" />}
                      {index === 2 && <CreditCard className="h-5 w-5 text-[#6A9C89]" />}
                      <span>{method.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {method.details.map((detail, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground">
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-[#6A9C89]/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Besoin d'aide pour choisir ?</h2>
            <Card>
              <CardContent className="p-8">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-center space-x-3">
                    <Mail className="h-5 w-5 text-[#6A9C89]" />
                    <a href="mailto:contact@softfacture.com" className="text-[#6A9C89] hover:underline">
                      contact@softfacture.com
                    </a>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <MessageCircle className="h-5 w-5 text-[#6A9C89]" />
                    <span className="text-muted-foreground">WhatsApp / Téléphone :</span>
                    <a href="https://wa.me/21655053505" className="text-[#6A9C89] hover:underline">
                      +216 55 053 505
                    </a>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">
                  Ou laissez vos coordonnées, nous vous rappelons pour fixer un rendez-vous.
                </p>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-[#6A9C89] text-[#6A9C89] hover:bg-[#6A9C89] hover:text-white"
                  onClick={() => navigate('/demo')}
                >
                  Nous contacter
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PricingPage;