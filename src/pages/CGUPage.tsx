import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/homepage/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Shield, Lock, AlertTriangle, RefreshCw, Gavel, Eye } from 'lucide-react';

const CGUPage = () => {
  const sections = [
    {
      icon: <Eye className="h-6 w-6 text-[#6A9C89] mt-1" />,
      title: "1. Objet",
      content: "Les présentes CGU définissent les conditions d'accès et d'utilisation de l'application SoftFacture par ses utilisateurs."
    },
    {
      icon: <Lock className="h-6 w-6 text-[#6A9C89] mt-1" />,
      title: "2. Accès à la plateforme",
      content: "L'accès au service se fait via une inscription validée manuellement après réception du paiement. Toute tentative d'accès non autorisé est interdite."
    },
    {
      icon: <Shield className="h-6 w-6 text-[#6A9C89] mt-1" />,
      title: "3. Utilisation du service",
      content: "L'utilisateur s'engage à utiliser SoftFacture dans le respect de la législation tunisienne. Toute utilisation abusive, frauduleuse ou détournée entraînera la suspension immédiate du compte. SoftFacture se réserve le droit de limiter l'espace de stockage si l'usage met en péril la stabilité du service."
    },
    {
      icon: <FileText className="h-6 w-6 text-[#6A9C89] mt-1" />,
      title: "4. Propriété intellectuelle",
      content: "Le code source, les fonctionnalités, les interfaces et tous les contenus sont protégés par le droit d'auteur et restent la propriété exclusive d'ABC Archibat."
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-[#6A9C89] mt-1" />,
      title: "5. Responsabilités",
      content: "SoftFacture est une plateforme professionnelle fournie en l'état. L'éditeur ne saurait être tenu pour responsable d'une mauvaise utilisation ou d'un défaut de sauvegarde imputable à l'utilisateur."
    },
    {
      icon: <Gavel className="h-6 w-6 text-[#6A9C89] mt-1" />,
      title: "6. Suspension ou résiliation",
      content: "ABC Archibat se réserve le droit de suspendre ou résilier l'accès d'un utilisateur en cas de non-respect des présentes CGU ou en cas de non-paiement."
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-[#6A9C89] mt-1" />,
      title: "7. Modifications",
      content: "Les présentes CGU peuvent être mises à jour à tout moment. L'utilisateur sera informé des modifications via son espace personnel ou par email."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#6A9C89]/10 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Conditions Générales d'Utilisation
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Les conditions d'accès et d'utilisation de l'application SoftFacture
          </p>
        </div>
      </section>

      {/* CGU Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {sections.map((section, index) => (
              <Card key={index}>
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4 mb-4">
                    {section.icon}
                    <h2 className="text-2xl font-bold">{section.title}</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed pl-10">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CGUPage;