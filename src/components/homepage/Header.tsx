
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
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SF</span>
          </div>
          <span className="text-xl font-bold text-text-primary">Soft Facture</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-text-secondary hover:text-primary font-medium transition-colors">
            Fonctionnalités
          </a>
          <a href="#pricing" className="text-text-secondary hover:text-primary font-medium transition-colors">
            Tarifs
          </a>
          <a href="#testimonials" className="text-text-secondary hover:text-primary font-medium transition-colors">
            Témoignages
          </a>
        </nav>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <Button 
              variant="outline"
              className="text-primary border-primary hover:bg-primary hover:text-white transition-all"
              onClick={handleSignOut}
            >
              Déconnexion
            </Button>
          ) : (
            <Button 
              className="bg-primary hover:bg-primary-hover text-white font-medium px-6 py-2 rounded-xl transition-all duration-200 hover:scale-105"
              onClick={() => navigate('/auth')}
            >
              Connexion
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
