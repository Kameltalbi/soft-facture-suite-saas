
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function Header() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

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
            className="h-16 w-auto"
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
    </header>
  );
}
