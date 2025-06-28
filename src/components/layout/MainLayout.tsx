
import { useState } from 'react';
import { AppSidebar } from './AppSidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  activeModule: string;
  onModuleChange: (module: string) => void;
}

export function MainLayout({ children, activeModule, onModuleChange }: MainLayoutProps) {
  const [sidebarHovered, setSidebarHovered] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      <div 
        className={`transition-all duration-300 ${sidebarHovered ? 'w-64' : 'w-16'}`}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        <AppSidebar activeModule={activeModule} onModuleChange={onModuleChange} />
      </div>
      
      <main className={`flex-1 transition-all duration-300 ${sidebarHovered ? 'ml-0' : 'ml-0'}`}>
        {children}
      </main>
    </div>
  );
}
