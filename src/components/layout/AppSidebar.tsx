
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

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border" style={{ backgroundColor: '#6c4cf1' }}>
      <SidebarHeader className="border-b border-sidebar-border px-6 py-4" style={{ backgroundColor: '#6c4cf1' }}>
        <div className="flex items-center justify-center">
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-lg">
                <span className="text-lg font-bold text-[#6c4cf1]">SF</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">Soft Facture</span>
                <span className="text-xs text-white/70">Gestion moderne</span>
              </div>
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-lg">
              <span className="text-lg font-bold text-[#6c4cf1]">SF</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4" style={{ backgroundColor: '#6c4cf1' }}>
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
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
                      onClick={() => onModuleChange(item.id)}
                      isActive={isActive}
                      tooltip={isCollapsed ? item.label : undefined}
                      className={`h-12 px-4 font-medium transition-all duration-200 rounded-xl group ${
                        isActive 
                          ? 'bg-white text-[#6c4cf1] shadow-lg transform scale-105' 
                          : 'hover:bg-white/10 hover:text-white hover:scale-105 text-white'
                      }`}
                    >
                      <Icon className={`h-5 w-5 stroke-[1.5px] transition-transform duration-200 ${
                        isActive ? 'text-[#6c4cf1] scale-110' : 'text-white group-hover:scale-110'
                      }`} />
                      {!isCollapsed && (
                        <span className="transition-all duration-200">{item.label}</span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/20 px-6 py-4" style={{ backgroundColor: '#6c4cf1' }}>
        {!isCollapsed && (
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
              <p className="text-xs text-white/70">Version 1.0.0</p>
            </div>
            <p className="text-xs text-white/50">© 2024 Soft Facture</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
