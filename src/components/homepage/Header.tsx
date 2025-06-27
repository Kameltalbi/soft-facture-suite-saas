

import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-[#6A9C89]">Soft Facture</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#fonctionnalites" className="text-gray-600 hover:text-[#6A9C89] transition-colors">
              Fonctionnalités
            </a>
            <a href="#tarifs" className="text-gray-600 hover:text-[#6A9C89] transition-colors">
              Tarifs
            </a>
            <Link to="/login">
              <Button 
                className="bg-[#6A9C89] hover:bg-[#5A8A75] text-white"
              >
                Connexion
              </Button>
            </Link>
          </nav>
          
          <div className="md:hidden">
            <Link to="/login">
              <Button 
                className="bg-[#6A9C89] hover:bg-[#5A8A75] text-white"
                size="sm"
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

