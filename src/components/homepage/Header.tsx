
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

  return (
    <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-[#6A9C89] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SF</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Soft Facture</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-600 hover:text-[#6A9C89] font-medium">
            Fonctionnalités
          </a>
          <a href="#pricing" className="text-gray-600 hover:text-[#6A9C89] font-medium">
            Tarifs
          </a>
          <a href="#testimonials" className="text-gray-600 hover:text-[#6A9C89] font-medium">
            Témoignages
          </a>
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
                variant="outline"
                className="text-[#6A9C89] border-[#6A9C89] hover:bg-[#6A9C89] hover:text-white"
              >
                Réserver votre démo gratuite
              </Button>
              <Button 
                className="bg-[#D96C4F] hover:bg-[#C25A43] text-white"
                onClick={() => navigate('/auth')}
              >
                Connexion
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
