
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const testimonials = [
  {
    quote: "Soft Facture m'a fait gagner un temps précieux. Mes factures sont maintenant professionnelles et je peux me concentrer sur mon métier d'artisan.",
    name: "Marie Dubois",
    role: "Artisan Menuisière",
    avatar: "MD"
  },
  {
    quote: "Interface simple et intuitive. Perfect pour mon activité de coaching. Les devis se transforment en factures en un clic !",
    name: "Thomas Martin",
    role: "Coach Professionnel",
    avatar: "TM"
  },
  {
    quote: "Excellente solution pour ma boutique. La gestion du stock Pro est un vrai plus pour suivre mes ventes et réapprovisionnements.",
    name: "Sophie Laurent",
    role: "Gérante Boutique",
    avatar: "SL"
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
