
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <img 
              src="/lovable-uploads/a37d1d26-1551-481a-a7cd-1f8b9cbbe869.png" 
              alt="Soft Facture Logo" 
              className="h-12 w-12"
            />
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#fonctionnalites" className="text-gray-600 hover:text-[#6A9C89] transition-colors">
                Fonctionnalités
              </a>
              <a href="#tarifs" className="text-gray-600 hover:text-[#6A9C89] transition-colors">
                Tarifs
              </a>
              <a href="#contact" className="text-gray-600 hover:text-[#6A9C89] transition-colors">
                Contact
              </a>
            </nav>
          </div>
          
          <div className="flex items-center">
            <Link to="/login">
              <Button 
                className="bg-[#6A9C89] hover:bg-[#5A8A75] text-white"
              >
                Connexion
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
