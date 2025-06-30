
import { Facebook, Linkedin, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1E3A8A] text-white border-t border-gray-700 shadow-lg">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Colonne 1 - Logo + Présentation */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">SoftFacture</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                La solution de facturation intuitive pour les entreprises modernes.
              </p>
            </div>
            <a 
              href="#about" 
              className="inline-block text-sm text-gray-300 hover:text-white transition-colors duration-200 underline-offset-4 hover:underline"
            >
              À propos de nous
            </a>
          </div>

          {/* Colonne 2 - Navigation */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Navigation</h4>
            <nav className="space-y-3">
              <a 
                href="/dashboard" 
                className="block text-gray-300 hover:text-white transition-colors duration-200 text-sm"
              >
                Tableau de bord
              </a>
              <a 
                href="/invoices" 
                className="block text-gray-300 hover:text-white transition-colors duration-200 text-sm"
              >
                Factures
              </a>
              <a 
                href="/clients" 
                className="block text-gray-300 hover:text-white transition-colors duration-200 text-sm"
              >
                Clients
              </a>
              <a 
                href="/settings" 
                className="block text-gray-300 hover:text-white transition-colors duration-200 text-sm"
              >
                Paramètres
              </a>
            </nav>
          </div>

          {/* Colonne 3 - Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <nav className="space-y-3">
              <a 
                href="#faq" 
                className="block text-gray-300 hover:text-white transition-colors duration-200 text-sm"
              >
                FAQ
              </a>
              <a 
                href="#help" 
                className="block text-gray-300 hover:text-white transition-colors duration-200 text-sm"
              >
                Centre d'aide
              </a>
              <a 
                href="#contact" 
                className="block text-gray-300 hover:text-white transition-colors duration-200 text-sm"
              >
                Nous contacter
              </a>
              <a 
                href="#legal" 
                className="block text-gray-300 hover:text-white transition-colors duration-200 text-sm"
              >
                Mentions légales
              </a>
            </nav>
          </div>

          {/* Colonne 4 - Contact & Réseaux */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-300" />
                <a 
                  href="mailto:contact@softfacture.tn" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  contact@softfacture.tn
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-300" />
                <span className="text-gray-300 text-sm">+216 XX XX XX XX</span>
              </div>
            </div>
            
            {/* Réseaux sociaux */}
            <div className="pt-4">
              <div className="flex space-x-4">
                <a 
                  href="#linkedin" 
                  className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4 text-white" />
                </a>
                <a 
                  href="#facebook" 
                  className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4 text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bas de footer */}
      <div className="border-t border-gray-600">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-300">
              © 2025 SoftFacture. Tous droits réservés.
            </p>
            <a 
              href="#terms" 
              className="text-xs text-gray-400 hover:text-gray-300 transition-colors duration-200 underline-offset-4 hover:underline"
            >
              Conditions générales d'utilisation
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
