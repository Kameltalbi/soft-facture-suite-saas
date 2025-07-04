

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

export function PricingSection() {
  const features = [
    { name: "Devis, factures, avoirs", essential: true, pro: true },
    { name: "Paiements partiels et recouvrement", essential: true, pro: true },
    { name: "Bons de livraison", essential: true, pro: true },
    { name: "Gestion du stock", essential: true, pro: true },
    { name: "Fiches clients, produits, services", essential: true, pro: true },
    { name: "Rapports : CA par mois et par client", essential: true, pro: true },
    { name: "TVA et taxes personnalisées (%) ou VA", essential: true, pro: true },
    { name: "Mentions et pied de page", essential: true, pro: true },
    { name: "Archivage des documents", essential: "12 mois après la fin de l'année", pro: "Illimité" },
    { name: "Fiches fournisseurs", essential: false, pro: true },
    { name: "Bons de commande fournisseurs", essential: false, pro: true },
    { name: "Templates PDF personnalisés", essential: false, pro: true },
    { name: "Rapports avancés (produits, impayés, etc.)", essential: false, pro: true },
    { name: "Support prioritaire (WhatsApp, téléphone)", essential: false, pro: true },
  ];

  return (
    <section id="tarifs" className="py-20 bg-[#F5F7F6]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Des tarifs simples et transparents
          </h2>
          <p className="text-xl text-gray-600">
            Choisissez le plan qui correspond à vos besoins
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {/* Plan Essentiel */}
          <Card className="rounded-2xl shadow-lg bg-white relative">
            <CardHeader className="text-center pt-8">
              <CardTitle className="text-2xl text-gray-900 mb-2">Plan Essentiel</CardTitle>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-[#6A9C89]">35 DT/mois</div>
                <div className="text-lg text-gray-600">Payable par an : 420 DT HT/an</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center mb-6">
                <p className="text-gray-600">2 utilisateurs inclus</p>
                <p className="text-sm text-gray-500">Utilisateur supplémentaire : 20 DT/mois</p>
              </div>
              
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{feature.name}</span>
                    {feature.essential === true || typeof feature.essential === "string" ? (
                      typeof feature.essential === "string" ? (
                        <span className="text-xs text-gray-600">{feature.essential}</span>
                      ) : (
                        <Check className="w-4 h-4 text-[#6A9C89]" />
                      )
                    ) : (
                      <X className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">Support : Email (48h)</p>
                <Button 
                  className="w-full bg-[#6A9C89] hover:bg-[#5A8A75] text-white"
                  onClick={() => window.location.href = '/checkout'}
                >
                  Commencer avec Essentiel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Plan Pro */}
          <Card className="rounded-2xl shadow-lg bg-white relative border-2 border-[#6A9C89]">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#D96C4F]">
              Recommandé
            </Badge>
            <CardHeader className="text-center pt-8">
              <CardTitle className="text-2xl text-gray-900 mb-2">Plan Pro</CardTitle>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-[#6A9C89]">45 DT/mois</div>
                <div className="text-lg text-gray-600">Payable par an : 540 DT HT/an</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center mb-6">
                <p className="text-gray-600">3 utilisateurs inclus</p>
                <p className="text-sm text-gray-500">Utilisateur supplémentaire : 20 DT/mois</p>
              </div>
              
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{feature.name}</span>
                    {feature.pro === true || typeof feature.pro === "string" ? (
                      typeof feature.pro === "string" ? (
                        <span className="text-xs text-gray-600">{feature.pro}</span>
                      ) : (
                        <Check className="w-4 h-4 text-[#6A9C89]" />
                      )
                    ) : (
                      <X className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">Support : Prioritaire (24h)</p>
                <Button 
                  className="w-full bg-[#D96C4F] hover:bg-[#C25A43] text-white"
                  onClick={() => window.location.href = '/checkout'}
                >
                  Commencer avec Pro
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message de démo */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="text-center">
              <div className="text-2xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Vous souhaitez découvrir SoftFacture avant de vous engager ?
              </h3>
              <p className="text-gray-600 mb-6">
                Réservez votre démonstration gratuite et visualisez comment notre solution peut s'adapter à votre activité.
              </p>
               <Button 
                 className="bg-[#6A9C89] hover:bg-[#5A8A75] text-white px-8 py-3"
                 onClick={() => window.location.href = '/demo'}
               >
                 Réserver une démonstration gratuite
               </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
