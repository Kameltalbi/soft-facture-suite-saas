
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const testimonials = [
  {
    quote: "Soft Facture nous a permis de digitaliser complètement notre processus de facturation. L'interface est intuitive et nous fait gagner un temps précieux au quotidien.",
    name: "Hamadi Zouari",
    role: "Gérant STS Networks",
    avatar: "HZ"
  },
  {
    quote: "Excellente solution pour notre entreprise. La gestion des devis et leur conversion en factures est très fluide. Je recommande vivement !",
    name: "Wahid Ben Taher",
    role: "Gérant MDA Networks",
    avatar: "WB"
  },
  {
    quote: "Un outil professionnel qui nous aide à mieux suivre nos ventes et nos clients. L'équipe de support est très réactive et à l'écoute.",
    name: "Hakima Boubakri",
    role: "Responsable commerciale Grain de Sens",
    avatar: "HB"
  }
];

export function TestimonialsSection() {
  return (
    <section id="temoignages" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Ils utilisent Soft Facture au quotidien
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="mb-6">
                  <p className="text-text-secondary italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </div>
                <div className="flex items-center">
                  <Avatar className="w-12 h-12 mr-4">
                    <AvatarFallback className="bg-primary text-white font-semibold">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-text-primary">{testimonial.name}</p>
                    <p className="text-sm text-text-secondary">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
