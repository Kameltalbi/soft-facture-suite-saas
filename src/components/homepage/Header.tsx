import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Layout mobile/tablette */}
        <div className="lg:hidden h-16 flex items-center justify-between">
          {/* Logo à gauche */}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <img 
              src="/lovable-uploads/1cb71d3d-89ac-4291-9697-fa30833d05ec.png"
              alt="Soft Facture Logo"
              className="h-[4rem] w-auto"
            />
          </button>
          
          {/* Menu hamburger au centre */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-[#6A9C89]"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Boutons à droite */}
          <div className="flex items-center space-x-2">
            {user ? (
              <Button 
                variant="outline"
                size="sm"
                className="text-[#6A9C89] border-[#6A9C89] hover:bg-[#6A9C89] hover:text-white"
                onClick={handleSignOut}
              >
                Déconnexion
              </Button>
            ) : (
              <>
                <Button 
                  size="sm"
                  className="bg-[#6A9C89] hover:bg-[#5A8A75] text-white"
                  onClick={() => navigate('/auth')}
                >
                  Connexion
                </Button>
                <Button 
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => navigate('/demo')}
                >
                  Démo
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Layout desktop (lg et plus) */}
        <div className="hidden lg:flex h-20 items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <img 
              src="/lovable-uploads/1cb71d3d-89ac-4291-9697-fa30833d05ec.png"
              alt="Soft Facture Logo"
              className="h-[5rem] w-auto"
            />
          </button>
          
          <nav className="flex items-center space-x-8">
            <button 
              onClick={() => navigate('/features')}
              className="text-gray-600 hover:text-[#6A9C89] font-medium"
            >
              Fonctionnalités
            </button>
            <button 
              onClick={() => navigate('/about')}
              className="text-gray-600 hover:text-[#6A9C89] font-medium"
            >
              À propos
            </button>
            <button 
              onClick={() => navigate('/pricing')}
              className="text-gray-600 hover:text-[#6A9C89] font-medium"
            >
              Tarifs
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')}
              className="text-gray-600 hover:text-[#6A9C89] font-medium"
            >
              Témoignages
            </button>
            <button 
              onClick={() => navigate('/demo')}
              className="text-gray-600 hover:text-[#6A9C89] font-medium"
            >
              Démo
            </button>
          </nav>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <Button 
                variant="outline"
                className="text-[#6A9C89] border-[#6A9C89] hover:bg-[#6A9C89] hover:text-white"
                onClick={handleSignOut}
              >
                Déconnexion
              </Button>
            ) : (
              <>
                <Button 
                  className="bg-[#6A9C89] hover:bg-[#5A8A75] text-white"
                  onClick={() => navigate('/auth')}
                >
                  Connexion
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => navigate('/demo')}
                >
                  Réserver votre démo gratuite
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Menu mobile/tablette déroulant */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-white/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <button 
              onClick={() => {
                navigate('/features');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-gray-600 hover:text-[#6A9C89] font-medium py-2"
            >
              Fonctionnalités
            </button>
            <button 
              onClick={() => {
                navigate('/about');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-gray-600 hover:text-[#6A9C89] font-medium py-2"
            >
              À propos
            </button>
            <button 
              onClick={() => {
                navigate('/pricing');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-gray-600 hover:text-[#6A9C89] font-medium py-2"
            >
              Tarifs
            </button>
            <button 
              onClick={() => {
                scrollToSection('testimonials');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-gray-600 hover:text-[#6A9C89] font-medium py-2"
            >
              Témoignages
            </button>
            <button 
              onClick={() => {
                navigate('/demo');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-gray-600 hover:text-[#6A9C89] font-medium py-2"
            >
              Démo
            </button>
          </div>
        </div>
      )}
    </header>
  );
}