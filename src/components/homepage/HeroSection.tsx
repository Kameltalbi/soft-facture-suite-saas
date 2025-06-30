
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight">
                Votre facturation, 
                <span className="text-primary"> simplifiée</span> et 
                <span className="text-primary"> professionnelle</span>.
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed">
                Gagnez du temps, organisez vos documents, et améliorez votre image. 
                Idéal pour artisans, indépendants, TPE et PME.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary-hover text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-primary transition-all duration-200 hover:scale-105"
                onClick={() => navigate('/auth')}
              >
                Commencer l'essai gratuit
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-200"
              >
                Voir les fonctionnalités
              </Button>
            </div>
          </div>
          
          <div className="lg:pl-8">
            <Card className="p-6 shadow-strong bg-white rounded-2xl border border-accent-200">
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
