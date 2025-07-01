
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
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
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
        
        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => scrollToSection('features')}
            className="text-gray-600 hover:text-[#6A9C89] font-medium"
          >
            Fonctionnalités
          </button>
          <button 
            onClick={() => scrollToSection('pricing')}
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
        
        {/* Menu hamburger pour mobile/tablette */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-[#6A9C89]"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
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

      {/* Menu mobile/tablette */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <button 
              onClick={() => {
                scrollToSection('features');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-gray-600 hover:text-[#6A9C89] font-medium py-2"
            >
              Fonctionnalités
            </button>
            <button 
              onClick={() => {
                scrollToSection('pricing');
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
            
            <div className="pt-4 border-t space-y-2">
              {user ? (
                <Button 
                  variant="outline"
                  className="w-full text-[#6A9C89] border-[#6A9C89] hover:bg-[#6A9C89] hover:text-white"
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Déconnexion
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-[#6A9C89] hover:bg-[#5A8A75] text-white"
                    onClick={() => {
                      navigate('/auth');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Connexion
                  </Button>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      navigate('/demo');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Réserver votre démo gratuite
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
