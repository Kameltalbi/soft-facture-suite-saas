
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ClipboardList, Truck, Package, CreditCard, BarChart2 } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: "Factures",
    description: "Générez des factures propres en un clic"
  },
  {
    icon: ClipboardList,
    title: "Devis",
    description: "Éditez et convertissez vos devis facilement"
  },
  {
    icon: Truck,
    title: "Bons de livraison",
    description: "Suivez vos livraisons simplement"
  },
  {
    icon: Package,
    title: "Stock (Pro)",
    description: "Gérez vos entrées et sorties de produit"
  },
  {
    icon: CreditCard,
    title: "Paiements (Pro)",
    description: "Suivi des règlements reçus"
  },
  {
    icon: BarChart2,
    title: "Rapports (Pro)",
    description: "Export PDF et CSV pour mieux décider"
  }
];

export function FeaturesSection() {
  return (
    <section id="fonctionnalites" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Tout ce dont vous avez besoin pour bien gérer
          </h2>
          <p className="text-xl text-text-secondary">
            Des outils simples, complets et adaptés à votre quotidien
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-accent-200">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-text-primary">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-text-secondary">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
