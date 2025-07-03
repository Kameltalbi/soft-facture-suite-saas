import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/homepage/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, Building, User, Server, Copyright } from 'lucide-react';

const MentionsLegalesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#6A9C89]/10 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Mentions légales
          </h1>
        </div>
      </section>

      {/* Legal Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Éditeur du site */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-4">
                  <Building className="h-6 w-6 text-[#6A9C89] mt-1" />
                  <h2 className="text-2xl font-bold">Éditeur du site</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  SoftFacture est une solution de facturation en ligne éditée par la société <strong>ABC Archibat</strong>, 
                  société à responsabilité limitée (SARL) au capital de 10 000 DT, immatriculée au Registre de Commerce 
                  de Tunis sous le numéro <strong>B1234562024</strong>.
                </p>
              </CardContent>
            </Card>

            {/* Siège social */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-4">
                  <Building className="h-6 w-6 text-[#6A9C89] mt-1" />
                  <h2 className="text-2xl font-bold">Siège social</h2>
                </div>
                <address className="text-muted-foreground not-italic leading-relaxed">
                  Espace Tunis – Immeuble H – Bureau B3-1<br />
                  1073 Montplaisir – Tunis – Tunisie
                </address>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <Mail className="h-6 w-6 text-[#6A9C89] mt-1" />
                  <h2 className="text-2xl font-bold">Contact</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-[#6A9C89]" />
                    <a href="mailto:contact@softfacture.com" className="text-[#6A9C89] hover:underline">
                      contact@softfacture.com
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-[#6A9C89]" />
                    <a href="tel:+21655053505" className="text-[#6A9C89] hover:underline">
                      +216 55 053 505
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Responsable de la publication */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-4">
                  <User className="h-6 w-6 text-[#6A9C89] mt-1" />
                  <h2 className="text-2xl font-bold">Responsable de la publication</h2>
                </div>
                <p className="text-muted-foreground">
                  <strong>Kamel Talbi</strong>, en qualité de gérant.
                </p>
              </CardContent>
            </Card>

            {/* Hébergement */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-4">
                  <Server className="h-6 w-6 text-[#6A9C89] mt-1" />
                  <h2 className="text-2xl font-bold">Hébergement</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Le site et l'application SoftFacture sont hébergés sur un serveur sécurisé situé dans 
                  l'Union Européenne, administré par un prestataire professionnel.
                </p>
              </CardContent>
            </Card>

            {/* Droits d'auteur */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-4">
                  <Copyright className="h-6 w-6 text-[#6A9C89] mt-1" />
                  <h2 className="text-2xl font-bold">Droits d'auteur</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Tous les éléments présents sur le site softfacture.com, y compris les textes, visuels, logos, 
                  interfaces et codes, sont la propriété exclusive de ABC Archibat, sauf mention contraire. 
                  Toute reproduction, distribution ou usage non autorisé est strictement interdit.
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MentionsLegalesPage;