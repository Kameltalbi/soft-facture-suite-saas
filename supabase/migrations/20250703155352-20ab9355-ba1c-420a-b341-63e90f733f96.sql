-- Supprimer le trigger sur les factures (non pertinent)
DROP TRIGGER IF EXISTS check_invoice_limit ON public.invoices;
DROP FUNCTION IF EXISTS public.before_insert_invoice();

-- Mise à jour de la fonction can_access_feature selon votre modèle
CREATE OR REPLACE FUNCTION public.can_access_feature(feature_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan TEXT;
BEGIN
  user_plan := get_user_organization_plan();

  IF user_plan = 'pro' THEN
    RETURN TRUE;
  ELSIF user_plan = 'essential' THEN
    -- Fonctionnalités disponibles pour le plan Essential
    RETURN feature_name IN (
      'invoices', 'quotes', 'clients', 'products', 'credit_notes', 
      'categories', 'pdf_export', 'automatic_statuses', 'basic_reports',
      'client_management', 'standard_taxes', 'discounts', 'standard_pdf_templates',
      'customizable_footer', 'dashboard_stats', 'limited_storage', 'responsive_interface'
    );
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mise à jour des limites pour correspondre à votre modèle
CREATE OR REPLACE FUNCTION public.check_plan_limits(limit_type TEXT)
RETURNS INTEGER AS $$
DECLARE
  user_plan TEXT;
BEGIN
  user_plan := get_user_organization_plan();

  CASE limit_type
    WHEN 'max_users' THEN
      RETURN CASE user_plan 
        WHEN 'essential' THEN 2
        WHEN 'pro' THEN 3
        ELSE 0
      END;
    WHEN 'additional_user_cost' THEN
      -- Coût par utilisateur supplémentaire (20 DT HT/an)
      RETURN 20;
    ELSE
      RETURN 0;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour limiter le nombre d'utilisateurs selon le plan
CREATE OR REPLACE FUNCTION public.before_insert_profile()
RETURNS trigger AS $$
DECLARE
  max_allowed INT;
  current_count INT;
  org_plan TEXT;
BEGIN
  max_allowed := check_plan_limits('max_users');
  
  SELECT COUNT(*) INTO current_count FROM profiles
  WHERE organization_id = NEW.organization_id;

  IF current_count >= max_allowed THEN
    SELECT plan INTO org_plan FROM organizations WHERE id = NEW.organization_id;
    RAISE EXCEPTION 'Limite d''utilisateurs atteinte pour le plan % (% utilisateurs max). Passez au plan Pro ou ajoutez des utilisateurs supplémentaires.', org_plan, max_allowed;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Appliquer le trigger sur la table profiles
DROP TRIGGER IF EXISTS check_user_limit ON public.profiles;
CREATE TRIGGER check_user_limit
BEFORE INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.before_insert_profile();