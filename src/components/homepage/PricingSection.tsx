import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function PricingSection() {
  return (
    <section id="tarifs" className="py-20 bg-[#F5F7F6]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Des tarifs simples et transparents
          </h2>
          <p className="text-xl text-gray-600">
            Essai gratuit 14 jours – Aucun paiement requis
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="rounded-2xl shadow-lg bg-white relative">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#6A9C89]">
              Gratuit
            </Badge>
            <CardHeader className="text-center pt-8">
              <CardTitle className="text-2xl text-gray-900 mb-2">Essai gratuit</CardTitle>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-[#6A9C89]">0 DT</div>
                <div className="text-lg text-gray-600">14 jours</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center mb-6">
                <p className="text-gray-600">1 utilisateur</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#6A9C89] rounded-full mr-3"></span>
                  Factures
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#6A9C89] rounded-full mr-3"></span>
                  Devis
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#6A9C89] rounded-full mr-3"></span>
                  Bons de livraison
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#6A9C89] rounded-full mr-3"></span>
                  Avoirs
                </li>
              </ul>
              <Button className="w-full bg-[#6A9C89] hover:bg-[#5A8A75] text-white mt-6">
                Commencer l'essai gratuit
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg bg-white relative">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#6A9C89]">
              Promotion jusqu'à fin 2025
            </Badge>
            <CardHeader className="text-center pt-8">
              <CardTitle className="text-2xl text-gray-900 mb-2">Plan Essentiel</CardTitle>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-[#6A9C89]">300 DT/an</div>
                <div className="text-sm text-gray-500 line-through">360 DT/an</div>
                <div className="text-lg text-gray-600">ou 250 €/an pour l'étranger</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center mb-6">
                <p className="text-gray-600">3 utilisateurs</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#6A9C89] rounded-full mr-3"></span>
                  Factures
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#6A9C89] rounded-full mr-3"></span>
                  Devis
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#6A9C89] rounded-full mr-3"></span>
                  Bons de livraison
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#6A9C89] rounded-full mr-3"></span>
                  Avoirs
                </li>
              </ul>
              <Button className="w-full bg-[#6A9C89] hover:bg-[#5A8A75] text-white mt-6">
                Commencer avec ce plan
              </Button>
            </CardContent>
          </Card>
          
          <Card className="rounded-2xl shadow-lg bg-white relative border-2 border-[#6A9C89]">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#D96C4F]">
              Promotion jusqu'à fin 2025
            </Badge>
            <CardHeader className="text-center pt-8">
              <CardTitle className="text-2xl text-gray-900 mb-2">Plan Pro</CardTitle>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-[#6A9C89]">490 DT/an</div>
                <div className="text-sm text-gray-500 line-through">650 DT/an</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center mb-6">
                <p className="text-gray-600">5 utilisateurs - Tout le plan Essentiel +</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#6A9C89] rounded-full mr-3"></span>
                  Gestion du stock
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#6A9C89] rounded-full mr-3"></span>
                  Paiements
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#6A9C89] rounded-full mr-3"></span>
                  Fournisseurs
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#6A9C89] rounded-full mr-3"></span>
                  Bons de Commande fournisseurs
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#6A9C89] rounded-full mr-3"></span>
                  Rapports PDF / CSV
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#6A9C89] rounded-full mr-3"></span>
                  Choix des modèles de documents
                </li>
              </ul>
              <Button className="w-full bg-[#D96C4F] hover:bg-[#C25A43] text-white mt-6">
                Contacter l'équipe
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
