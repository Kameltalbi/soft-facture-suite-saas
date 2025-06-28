
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
  Building2
} from 'lucide-react';

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

import { useNavigate } from 'react-router-dom';

interface AppSidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const menuItems = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: LayoutDashboard,
    route: '/dashboard'
  },
  { 
    id: 'quotes', 
    label: 'Devis', 
    icon: ClipboardList,
    route: '/dashboard/quotes'
  },
  { 
    id: 'invoices', 
    label: 'Factures', 
    icon: FileText,
    route: '/dashboard/invoices'
  },
  { 
    id: 'delivery-notes', 
    label: 'Bons de livraison', 
    icon: Truck,
    route: '/dashboard/delivery-notes'
  },
  { 
    id: 'credits', 
    label: 'Avoirs', 
    icon: Receipt,
    route: '/dashboard/credits'
  },
  { 
    id: 'clients', 
    label: 'Clients', 
    icon: UsersRound,
    route: '/dashboard/clients'
  },
  { 
    id: 'products', 
    label: 'Produits & Services', 
    icon: Package,
    route: '/dashboard/products'
  },
  { 
    id: 'categories', 
    label: 'Catégories', 
    icon: Folders,
    route: '/dashboard/categories'
  },
  { 
    id: 'stock', 
    label: 'Gestion des stocks', 
    icon: Warehouse,
    route: '/dashboard/stock'
  },
  { 
    id: 'fournisseurs', 
    label: 'Fournisseurs', 
    icon: Building2,
    route: '/dashboard/fournisseurs'
  },
  { 
    id: 'bons-commande', 
    label: 'Bons de commande', 
    icon: Receipt,
    route: '/dashboard/bons-commande'
  },
  { 
    id: 'reports', 
    label: 'Rapports', 
    icon: BarChart3,
    route: '/dashboard/reports'
  },
  { 
    id: 'settings', 
    label: 'Paramètres', 
    icon: Settings2,
    route: '/dashboard/settings'
  },
];

export function AppSidebar({ activeModule, onModuleChange }: AppSidebarProps) {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const isCollapsed = state === 'collapsed';

  const handleNavigation = (item: typeof menuItems[0]) => {
    onModuleChange(item.id);
    navigate(item.route);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200 bg-[#F6F7F9]">
      <SidebarHeader className="border-b border-gray-200 px-6 py-4 bg-[#F6F7F9]">
        <div className="flex items-center justify-center">
          {!isCollapsed ? (
            <img 
              src="/lovable-uploads/f37e617b-8bbf-4d56-a0ee-52cf7a0f9b1a.png" 
              alt="Soft Facture Logo" 
              className="h-20 w-auto"
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
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => handleNavigation(item)}
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
