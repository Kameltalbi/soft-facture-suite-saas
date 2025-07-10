import { useAuth } from './useAuth';

export const usePlanAccess = () => {
  const { organization, profile } = useAuth();
  
  const plan = organization?.plan || 'essential';
  const isEssential = plan === 'essential';
  const isPro = plan === 'pro';
  const isAdmin = profile?.role === 'admin' || profile?.role === 'superadmin';

  // Sidebar pages access
  const sidebarAccess = {
    dashboard: true,
    invoices: true,
    quotes: true,
    'delivery-notes': true,
    credits: true,
    recouvrement: true,
    clients: true,
    products: true,
    categories: true,
    stock: true,
    reports: true,
    settings: isAdmin, // Seuls les admins peuvent accéder aux paramètres
    // Pro only features
    fournisseurs: isPro,
    'bons-commande': isPro,
  };

  // Reports access
  const reportsAccess = {
    'product-revenue': true,   // CA par produit/service
    'client-revenue': true,    // CA par client
    'monthly-revenue': true,   // CA mensuel
    // Pro only reports
    'invoices': isPro,
    'year-comparison': isPro,
    'product-ranking': isPro,
  };

  // Settings sections access
  const settingsAccess = {
    organization: true,
    currencies: true,
    footer: true,
    taxes: true,
    numbering: true,
    users: true,
    roles: true,
    // Pro only settings
    templates: isPro,  // Templates PDF personnalisés
  };

  return {
    plan,
    isEssential,
    isPro,
    isAdmin,
    sidebarAccess,
    reportsAccess,
    settingsAccess,
  };
};