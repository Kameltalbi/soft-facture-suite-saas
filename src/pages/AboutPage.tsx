
import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/homepage/Footer';

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
              À propos de SoftFacture
            </h1>
            
            <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                SoftFacture est une application SaaS de facturation pensée pour répondre aux besoins des entreprises modernes. 
                Elle permet de créer, suivre et gérer facilement les devis, factures, bons de commande et autres documents commerciaux, 
                tout en restant conforme aux exigences locales.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                SoftFacture est une solution développée par <strong>Archibat Digital</strong>, l'agence digitale de la revue tunisienne 
                d'architecture et de bâtiment Archibat, fondée en 1997. Forte d'une longue expérience dans les domaines de l'édition, 
                de la communication et du digital, Archibat Digital accompagne depuis plusieurs années les professionnels dans leur 
                transformation numérique.
              </p>
              
              <div className="pt-4">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Nos autres solutions
                </h2>
                
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Au-delà de SoftFacture, l'agence a également développé d'autres applications métiers innovantes, dont :
                </p>
                
                <div className="space-y-4 ml-4">
                  <div className="border-l-4 border-[#1E3A8A] pl-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Trezo</h3>
                    <p className="text-gray-700">
                      Un outil de gestion de trésorerie pour suivre les flux financiers avec précision et anticiper 
                      les besoins de financement.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-[#1E3A8A] pl-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">VoxCRM</h3>
                    <p className="text-gray-700">
                      Une solution CRM complète pour piloter la relation client, gérer les opportunités commerciales 
                      et optimiser le suivi des contacts.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Ces applications ont toutes un point commun : aider les entreprises en Tunisie et ailleurs à structurer 
                  leur activité, améliorer leur performance et gagner du temps au quotidien, grâce à des outils intuitifs, 
                  accessibles et puissants.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
