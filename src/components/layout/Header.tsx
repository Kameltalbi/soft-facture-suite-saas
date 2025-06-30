
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

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex items-center justify-between h-24 py-4 bg-background border-b border-border">
      <div className="flex items-center gap-3">
        {organization?.logo_url ? (
          <img 
            src={organization.logo_url} 
            alt={`${organization.name} logo`}
            className="h-16 w-auto object-contain max-w-[180px]"
          />
        ) : (
          <div className="h-16 w-16 bg-primary rounded-xl flex items-center justify-center shadow-primary">
            <Building className="h-8 w-8 text-white" />
          </div>
        )}
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 hover:bg-accent transition-colors">
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="hidden sm:inline text-text-primary font-medium">
              {profile?.first_name && profile?.last_name 
                ? `${profile.first_name} ${profile.last_name}`
                : user?.email
              }
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white border border-border shadow-medium">
          <DropdownMenuLabel className="text-text-primary">Mon compte</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled className="text-text-secondary">
            <User className="mr-2 h-4 w-4" />
            <span>{user?.email}</span>
          </DropdownMenuItem>
          {profile?.role && (
            <DropdownMenuItem disabled className="text-text-secondary">
              <span className="mr-2 text-xs bg-accent px-2 py-1 rounded text-text-primary">
                {profile.role}
              </span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="text-destructive hover:bg-destructive/10">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Déconnexion</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
