
import { useAuth } from '@/hooks/useAuth';
import { Dashboard } from '@/components/modules/Dashboard';
import OrganisationsAdminPage from '@/pages/OrganisationsAdminPage';

export const DashboardSelector = () => {
  const { profile } = useAuth();

  // Si l'utilisateur est superadmin, afficher la page de gestion des organisations
  if (profile?.role === 'superadmin') {
    return <OrganisationsAdminPage />;
  }

  // Sinon, afficher le tableau de bord normal
  return <Dashboard />;
};
