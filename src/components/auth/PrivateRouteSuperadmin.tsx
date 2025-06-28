
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface PrivateRouteSuperadminProps {
  children: React.ReactNode;
}

export const PrivateRouteSuperadmin = ({ children }: PrivateRouteSuperadminProps) => {
  const { user, loading, profile } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6A9C89]"></div>
      </div>
    );
  }

  if (!user || profile?.role !== 'superadmin') {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
