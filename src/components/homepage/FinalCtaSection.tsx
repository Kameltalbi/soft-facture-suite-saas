
import { Button } from '@/components/ui/button';

export function FinalCtaSection() {
  return (
    <section className="py-20 bg-[#6A9C89] text-white">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Rejoignez les pros qui gagnent du temps chaque jour
          </h2>
          <p className="text-xl opacity-90">
            Soft Facture vous accompagne dès aujourd'hui
          </p>
          <Button 
            size="lg"
            className="bg-white text-[#6A9C89] hover:bg-gray-100 px-12 py-4 text-lg font-semibold"
          >
            Essayer Soft Facture gratuitement
          </Button>
        </div>
      </div>
    </section>
  );
}
