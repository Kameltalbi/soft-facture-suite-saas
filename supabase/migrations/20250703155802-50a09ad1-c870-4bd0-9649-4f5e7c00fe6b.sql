-- Ajouter la gestion des devises au plan Essential
CREATE OR REPLACE FUNCTION public.can_access_feature(feature_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan TEXT;
BEGIN
  user_plan := get_user_organization_plan();

  IF user_plan = 'pro' THEN
    RETURN TRUE;
  ELSIF user_plan = 'essential' THEN
    -- Fonctionnalités disponibles pour le plan Essential (incluant taxes personnalisées et gestion des devises)
    RETURN feature_name IN (
      'invoices', 'quotes', 'clients', 'products', 'credit_notes', 
      'categories', 'pdf_export', 'automatic_statuses', 'basic_reports',
      'client_management', 'standard_taxes', 'custom_taxes', 'discounts', 
      'standard_pdf_templates', 'customizable_footer', 'dashboard_stats', 
      'limited_storage', 'responsive_interface', 'currencies'
    );
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;