

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

export function PricingSection() {
  const features = [
    { name: "Utilisateurs inclus", essential: "2", pro: "3" },
    { name: "Utilisateur supplémentaire", essential: "20 DT/mois", pro: "20 DT/mois" },
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
            Tableau comparatif des plans
          </h2>
          <p className="text-xl text-gray-600">
            Voici un tableau comparatif professionnel, clair et respectueux des deux plans de SoftFacture, avec une présentation côte à côte utilisant les codes 🟢 (Essentiel) et 🔴 (Pro), et indiquant bien que le paiement est annuel.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-lg font-semibold text-gray-900">Fonctionnalité</th>
                  <th className="px-6 py-4 text-center text-lg font-semibold text-gray-900">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      <span>Essentiel (35 DT/mois, 420 DT/an)</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-lg font-semibold text-gray-900">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                      <span>Pro (45 DT/mois, 540 DT/an)</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-4 text-gray-900 font-medium">{feature.name}</td>
                    <td className="px-6 py-4 text-center">
                      {feature.essential === true ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : feature.essential === false ? (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      ) : (
                        <span className="text-sm text-gray-700">{feature.essential}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {feature.pro === true ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : feature.pro === false ? (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      ) : (
                        <span className="text-sm text-gray-700">{feature.pro}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="bg-gray-50 px-6 py-4">
              <div className="flex items-center gap-2 text-sm text-red-600 mb-2">
                <span>♦</span>
                <span>Tous les plans sont payables annuellement.</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>→</span>
                <span>Pas d'engagement mensuel.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6 mb-12">
          <Button 
            className="bg-[#6A9C89] hover:bg-[#5A8A75] text-white px-8 py-3"
            onClick={() => window.location.href = '/checkout'}
          >
            Commencer avec Essentiel
          </Button>
          <Button 
            className="bg-[#D96C4F] hover:bg-[#C25A43] text-white px-8 py-3"
            onClick={() => window.location.href = '/checkout'}
          >
            Commencer avec Pro
          </Button>
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
