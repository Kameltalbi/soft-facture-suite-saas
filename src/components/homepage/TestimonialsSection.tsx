
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const testimonials = [
  {
    quote: "Soft Facture m'a fait gagner un temps précieux. Mes factures sont maintenant professionnelles et je peux me concentrer sur la gestion de mon entreprise.",
    name: "N. Melliti",
    role: "Gérante Effervescence SARL",
    avatar: "NM"
  },
  {
    quote: "Interface simple et intuitive. Parfait pour notre activité de conseil. Les devis se transforment en factures en un clic !",
    name: "Nabil Kasraoui",
    role: "Gérant Findev Advisory",
    avatar: "NK"
  },
  {
    quote: "Excellente solution pour notre entreprise. La gestion avancée nous permet de suivre efficacement nos projets et notre croissance.",
    name: "H. Zouari",
    role: "Directeur Général STS Networks",
    avatar: "HZ"
  }
];

export function TestimonialsSection() {
  return (
    <section id="temoignages" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ils utilisent Soft Facture au quotidien
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="mb-6">
                  <p className="text-gray-700 italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </div>
                <div className="flex items-center">
                  <Avatar className="w-12 h-12 mr-4">
                    <AvatarFallback className="bg-[#6A9C89] text-white font-semibold">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
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
