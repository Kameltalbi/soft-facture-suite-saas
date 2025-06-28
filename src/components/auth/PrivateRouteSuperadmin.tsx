
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';

interface PrivateRouteSuperadminProps {
  children: React.ReactNode;
  activeModule?: string;
}

export function PrivateRouteSuperadmin({ children, activeModule }: PrivateRouteSuperadminProps) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (profile?.role !== 'superadmin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AppLayout activeModule={activeModule}>
      {children}
    </AppLayout>
  );
}
