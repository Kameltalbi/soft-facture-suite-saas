
import { 
  LayoutDashboard, 
  FileText, 
  ClipboardList, 
  Truck,
  Package, 
  Folders, 
  Warehouse, 
  UsersRound, 
  Receipt, 
  Settings2,
  BarChart3,
  Building2,
  CreditCard
} from 'lucide-react';
import { usePlanAccess } from '@/hooks/usePlanAccess';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const menuItems = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: LayoutDashboard 
  },
  { 
    id: 'quotes', 
    label: 'Devis', 
    icon: ClipboardList 
  },
  { 
    id: 'invoices', 
    label: 'Factures', 
    icon: FileText 
  },
  { 
    id: 'delivery-notes', 
    label: 'Bons de livraison', 
    icon: Truck 
  },
  { 
    id: 'credits', 
    label: 'Avoirs', 
    icon: Receipt 
  },
  { 
    id: 'recouvrement', 
    label: 'Recouvrement', 
    icon: CreditCard 
  },
  { 
    id: 'clients', 
    label: 'Clients', 
    icon: UsersRound 
  },
  { 
    id: 'products', 
    label: 'Produits & Services', 
    icon: Package 
  },
  { 
    id: 'categories', 
    label: 'Catégories', 
    icon: Folders 
  },
  { 
    id: 'stock', 
    label: 'Gestion des stocks', 
    icon: Warehouse 
  },
  { 
    id: 'fournisseurs', 
    label: 'Fournisseurs', 
    icon: Building2 
  },
  { 
    id: 'bons-commande', 
    label: 'Bons de commande', 
    icon: Receipt 
  },
  { 
    id: 'reports', 
    label: 'Rapports', 
    icon: BarChart3 
  },
  { 
    id: 'settings', 
    label: 'Paramètres', 
    icon: Settings2 
  },
];

export function AppSidebar({ activeModule, onModuleChange }: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const { sidebarAccess } = usePlanAccess();

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200 bg-[#F6F7F9]">
      <SidebarHeader className="border-b border-gray-200 px-6 py-4 bg-[#F6F7F9]">
        <div className="flex items-center justify-center">
          {!isCollapsed ? (
            <img 
              src="/lovable-uploads/08d9951e-3fa8-43fa-a62f-a57515e31a4a.png" 
              alt="Soft Facture Logo" 
              className="h-24 w-auto"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6A9C89] text-white">
              <span className="text-sm font-bold">SF</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 bg-[#F6F7F9]">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {!isCollapsed && 'Navigation'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.filter(item => sidebarAccess[item.id as keyof typeof sidebarAccess]).map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onModuleChange(item.id)}
                      isActive={isActive}
                      tooltip={isCollapsed ? item.label : undefined}
                      className="h-10 px-3 font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-[#6A9C89] data-[active=true]:text-white data-[active=true]:shadow-sm"
                    >
                      <Icon className={`h-5 w-5 stroke-[1.5px] ${isActive ? 'text-white' : 'text-[#6A9C89]'}`} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 px-6 py-4 bg-[#F6F7F9]">
        {!isCollapsed && (
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Version 1.0.0</p>
            <p className="text-xs text-muted-foreground mt-1">© 2024 Soft Facture</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
