
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#F7F9FA]">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Votre facturation, 
                <span className="text-[#6A9C89]"> simplifiée</span> et 
                <span className="text-[#6A9C89]"> professionnelle</span>.
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Gagnez du temps, organisez vos documents, et améliorez votre image. 
                Idéal pour artisans, indépendants, TPE et PME.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-[#6A9C89] hover:bg-[#5A8A75] text-white px-8 py-3 text-lg"
                onClick={() => navigate('/auth')}
              >
                Commencer l'essai gratuit
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-[#6A9C89] text-[#6A9C89] hover:bg-[#6A9C89] hover:text-white px-8 py-3 text-lg"
                onClick={() => navigate('/checkout')}
              >
                Créer mon compte
              </Button>
            </div>
          </div>
          
          <div className="lg:pl-8">
            <Card className="p-6 shadow-2xl bg-white rounded-2xl">
              <div className="aspect-video bg-white rounded-xl overflow-hidden">
                <img 
                  src="/lovable-uploads/aa6d5b72-4a25-4522-94b2-7dfd5d462531.png" 
                  alt="Dashboard Soft Facture - Aperçu de votre application de facturation"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
