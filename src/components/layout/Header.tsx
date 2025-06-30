
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User, Building } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  activeModule: string;
}

export function Header({ activeModule }: HeaderProps) {
  const { user, profile, organization, signOut } = useAuth();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Mettre à jour l'heure chaque seconde
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="flex items-center justify-between h-24 py-4">
      <div className="flex items-center gap-3">
        {organization?.logo_url ? (
          <img 
            src={organization.logo_url} 
            alt={`${organization.name} logo`}
            className="h-16 w-auto object-contain max-w-[180px]"
          />
        ) : (
          <div className="h-16 w-16 bg-[#6A9C89] rounded-lg flex items-center justify-center">
            <Building className="h-8 w-8 text-white" />
          </div>
        )}
      </div>

      {/* Date et heure en temps réel - centrée */}
      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-2 font-medium text-lg">
          <span className="text-green-600">{formatDate(currentDateTime)}</span>
          <span className="text-orange-600">{formatTime(currentDateTime)}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">
                {profile?.first_name && profile?.last_name 
                  ? `${profile.first_name} ${profile.last_name}`
                  : user?.email
                }
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <User className="mr-2 h-4 w-4" />
              <span>{user?.email}</span>
            </DropdownMenuItem>
            {profile?.role && (
              <DropdownMenuItem disabled>
                <span className="mr-2 text-xs bg-gray-100 px-2 py-1 rounded">
                  {profile.role}
                </span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
