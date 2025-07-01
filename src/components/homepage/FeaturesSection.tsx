
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ClipboardList, Users, BarChart2, FileImage, UserCheck } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: "Facturation simplifiée",
    description: "Générez vos factures en quelques clics, appliquez automatiquement la TVA et envoyez-les par email en PDF à vos clients. Suivez l'état des paiements en temps réel."
  },
  {
    icon: ClipboardList,
    title: "Devis professionnels",
    description: "Créez des devis clairs et élégants, personnalisés avec votre logo. Transformez-les en factures dès validation du client, sans ressaisie."
  },
  {
    icon: Users,
    title: "Gestion centralisée des clients",
    description: "Regroupez toutes les informations de vos clients : coordonnées, historiques de factures, devis et paiements. Gagnez du temps et restez organisé."
  },
  {
    icon: BarChart2,
    title: "Tableau de bord clair",
    description: "Visualisez votre chiffre d'affaires, vos factures en attente et vos performances mensuelles grâce à un tableau de bord moderne et facile à lire."
  },
  {
    icon: FileImage,
    title: "Documents PDF personnalisables",
    description: "Personnalisez vos factures, devis et avoirs avec vos mentions légales, votre logo et vos préférences. Choisissez parmi plusieurs modèles professionnels (selon le plan)."
  },
  {
    icon: UserCheck,
    title: "Multi-utilisateurs et accès sécurisé",
    description: "Travaillez à plusieurs sur le même compte avec des accès distincts. Gérez les utilisateurs selon votre organisation (2 ou 3 inclus selon le plan, utilisateurs supplémentaires à 20 DT HT/an)."
  }
];

export function FeaturesSection() {
  return (
    <section id="fonctionnalites" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Fonctionnalités principales
          </h2>
          <p className="text-xl text-gray-600">
            Des outils simples, complets et adaptés à votre quotidien
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-gray-100">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-[#6A9C89] rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
