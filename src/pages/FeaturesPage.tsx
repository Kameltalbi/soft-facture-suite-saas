import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/homepage/Footer';
import { 
  FileText, 
  Users, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  BarChart3, 
  Calculator, 
  Globe, 
  UserCheck, 
  Shield, 
  Settings, 
  TrendingUp 
} from 'lucide-react';

const FeaturesPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: "quotes-invoices",
      icon: <FileText className="h-6 w-6 text-[#6A9C89]" />,
      title: "Gestion des devis & factures",
      items: [
        "Création illimitée de devis et factures professionnelles",
        "Modèles PDF personnalisables (logo, couleurs, mentions légales…)",
        "Insertion automatique des coordonnées clients, taux de TVA, remises",
        "Génération automatique du montant en lettres",
        "Suivi du statut (brouillon, envoyé, validé, payé, partiellement payé)",
        "Ajout de conditions de paiement et mentions spécifiques"
      ]
    },
    {
      id: "clients",
      icon: <Users className="h-6 w-6 text-[#6A9C89]" />,
      title: "Gestion des clients et prospects",
      items: [
        "Fiches clients complètes avec historique de facturation",
        "Ajout manuel ou automatique via formulaire",
        "Recherche intelligente",
        "Affectation de documents par client",
        "Segmentation possible pour relancer ou filtrer"
      ]
    },
    {
      id: "products",
      icon: <Package className="h-6 w-6 text-[#6A9C89]" />,
      title: "Gestion des produits & services",
      items: [
        "Création illimitée de produits ou prestations",
        "Tarifs TTC et HT avec unité personnalisée",
        "Affectation de catégories ou familles",
        "Gestion des descriptions longues"
      ]
    },
    {
      id: "orders",
      icon: <ShoppingCart className="h-6 w-6 text-[#6A9C89]" />,
      title: "Bons de commande & bons de livraison",
      items: [
        "Création de bons de commande fournisseurs",
        "Création de bons de livraison pour les clients",
        "Documents téléchargeables et imprimables",
        "Intégration avec les factures correspondantes"
      ]
    },
    {
      id: "payments",
      icon: <CreditCard className="h-6 w-6 text-[#6A9C89]" />,
      title: "Paiements & encaissements",
      items: [
        "Suivi des paiements clients",
        "Saisie de paiements partiels",
        "Téléversement des justificatifs de paiement",
        "Calcul automatique du reste à payer",
        "Export comptable"
      ]
    },
    {
      id: "dashboard",
      icon: <BarChart3 className="h-6 w-6 text-[#6A9C89]" />,
      title: "Tableaux de bord & indicateurs",
      items: [
        "Tableau de bord global avec graphiques dynamiques",
        "Suivi des ventes par mois, par client ou produit",
        "Indicateurs clés (CA HT, TTC, reste à encaisser, nombre de documents)",
        "Export des données"
      ]
    },
    {
      id: "taxes",
      icon: <Calculator className="h-6 w-6 text-[#6A9C89]" />,
      title: "Taxes personnalisées & gestion multi-TVA",
      items: [
        "Création de taxes personnalisées : TVA, timbres, redevances",
        "Choix entre % ou montant fixe",
        "Application par type de document (facture, devis, bon, etc.)",
        "Inclusion automatique dans les totaux TTC",
        "Modifiables à tout moment"
      ]
    },
    {
      id: "multi-currency",
      icon: <Globe className="h-6 w-6 text-[#6A9C89]" />,
      title: "Multi-devise & mentions légales",
      items: [
        "Choix de la devise principale",
        "Affichage des documents dans toutes les monnaies",
        "Personnalisation des pieds de page (mentions légales, RIB, IBAN, etc.)"
      ]
    },
    {
      id: "users",
      icon: <UserCheck className="h-6 w-6 text-[#6A9C89]" />,
      title: "Utilisateurs et permissions",
      items: [
        "Jusqu'à 3 utilisateurs inclus selon le plan",
        "Ajout d'utilisateurs supplémentaires",
        "Gestion des accès par rôle",
        "Sécurité et confidentialité des données isolées"
      ]
    },
    {
      id: "security",
      icon: <Shield className="h-6 w-6 text-[#6A9C89]" />,
      title: "Sécurité & confidentialité",
      items: [
        "Données hébergées en Europe",
        "Sauvegardes automatiques",
        "Accès sécurisé avec authentification",
        "Validations manuelles des comptes par l'administrateur"
      ]
    },
    {
      id: "settings",
      icon: <Settings className="h-6 w-6 text-[#6A9C89]" />,
      title: "Paramétrage avancé",
      items: [
        "Configuration des modèles PDF",
        "Activation ou non des modules (bons de commande, livraison…)",
        "Personnalisation des couleurs et logos",
        "Choix des taux et taxes par défaut"
      ]
    },
    {
      id: "evolution",
      icon: <TrendingUp className="h-6 w-6 text-[#6A9C89]" />,
      title: "Évolutivité",
      items: [
        "Nouveaux modules prévus : CRM, gestion des dépenses, rappels clients",
        "Intégrations futures (paiement en ligne, connecteurs comptables, API)"
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
            Toutes les fonctionnalités dont vous avez besoin pour simplifier la facturation de votre entreprise
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            SoftFacture centralise vos devis, factures, paiements, clients, taxes, et documents en un seul espace fluide, sécurisé et 100 % en ligne.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Accordion type="multiple" className="space-y-4">
              {features.map((feature) => (
                <AccordionItem key={feature.id} value={feature.id} className="border rounded-lg">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center space-x-4">
                      {feature.icon}
                      <h3 className="text-lg font-semibold text-left">{feature.title}</h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <ul className="space-y-2">
                      {feature.items.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-[#6A9C89] mt-1.5">•</span>
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#6A9C89]/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Découvrez SoftFacture en action
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Demandez votre démonstration personnalisée ou créez votre compte dès maintenant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-[#6A9C89] hover:bg-[#5A8A75] text-white"
                onClick={() => navigate('/')}
              >
                Voir les tarifs
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-[#6A9C89] text-[#6A9C89] hover:bg-[#6A9C89] hover:text-white"
                onClick={() => navigate('/demo')}
              >
                Demander une démo
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeaturesPage;