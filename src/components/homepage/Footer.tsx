
import { Facebook, Linkedin, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Footer() {
  const navigate = useNavigate();
  
  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };
  
  return (
    <footer className="bg-[#1E3A8A] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Colonne 1 - Identité */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/3928f24a-1fb2-4bf0-8e69-dafa665eddc0.png"
                alt="SoftFacture Logo"
                className="h-16 w-auto"
              />
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              La solution de facturation intuitive pensée pour les entreprises tunisiennes et africaines.
            </p>
          </div>

          {/* Colonne 2 - Navigation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleNavigation('/')}
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Accueil
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/features')}
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Fonctionnalités
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/pricing')}
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Tarifs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/demo')}
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Démo
                </button>
              </li>
            </ul>
          </div>

          {/* Colonne 3 - Ressources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Ressources</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleNavigation('/mentions-legales')}
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Mentions légales
                </button>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/cgu')}
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Conditions générales d'utilisation
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/contact')}
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Contact support
                </button>
              </li>
            </ul>
          </div>

          {/* Colonne 4 - Restez connecté */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Restez connecté</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-300" />
                <a 
                  href="mailto:contact@softfacture.com" 
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  contact@softfacture.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-300" />
                <span className="text-sm text-gray-300">+216 55 053 505</span>
              </div>
            </div>
            
            <div className="flex space-x-4 pt-2">
              <a 
                href="#" 
                className="text-gray-300 hover:text-white transition-colors hover:scale-110 transform"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-white transition-colors hover:scale-110 transform"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bande inférieure */}
      <div className="border-t border-blue-800 bg-[#1E3A8A]">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center">
            <p className="text-xs text-gray-400">
              © 2025 SoftFacture. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
