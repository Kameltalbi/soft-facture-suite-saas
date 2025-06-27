
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  FolderOpen,
  Receipt,
  FileCheck,
  Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const modules = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'invoices', label: 'Factures', icon: FileText },
  { id: 'quotes', label: 'Devis', icon: FileCheck },
  { id: 'delivery-notes', label: 'Bons de livraison', icon: Truck },
  { id: 'sales', label: 'Tous les documents', icon: Receipt },
  { id: 'products', label: 'Produits & Services', icon: Package },
  { id: 'categories', label: 'Catégories', icon: FolderOpen },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'credits', label: 'Avoirs', icon: Receipt },
  { id: 'settings', label: 'Paramètres', icon: Settings },
];

export function Sidebar({ activeModule, onModuleChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "bg-white border-r border-neutral-200 transition-all duration-300 flex flex-col h-screen",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SF</span>
            </div>
            <span className="font-semibold text-neutral-900">Soft Facture</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 h-auto"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {modules.map((module) => {
          const Icon = module.icon;
          const isActive = activeModule === module.id;
          
          return (
            <button
              key={module.id}
              onClick={() => onModuleChange(module.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200",
                isActive 
                  ? "bg-primary text-white shadow-sm" 
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              )}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && (
                <span className="font-medium">{module.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-200">
        {!collapsed && (
          <div className="text-xs text-neutral-500 text-center">
            Version 1.0.0
          </div>
        )}
      </div>
    </div>
  );
}
