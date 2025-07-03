-- Fonction pour récupérer le plan de l'organisation de l'utilisateur
CREATE OR REPLACE FUNCTION public.get_user_organization_plan()
RETURNS TEXT AS $$
  SELECT plan FROM public.organizations 
  WHERE id = get_user_organization_id() 
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Fonction pour vérifier l'accès aux fonctionnalités selon le plan
CREATE OR REPLACE FUNCTION public.can_access_feature(feature_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan TEXT;
BEGIN
  user_plan := get_user_organization_plan();

  IF user_plan = 'pro' THEN
    RETURN TRUE;
  ELSIF user_plan = 'essential' THEN
    RETURN feature_name IN (
      'invoices', 'quotes', 'clients', 'products',
      'credit_notes', 'categories', 'basic_reports'
    );
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour gérer les limites quantitatives selon le plan
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
        WHEN 'pro' THEN 10
        ELSE 0
      END;
    WHEN 'max_invoices_per_month' THEN
      RETURN CASE user_plan 
        WHEN 'essential' THEN 100
        WHEN 'pro' THEN -1 -- illimité
        ELSE 0
      END;
    WHEN 'max_storage_mb' THEN
      RETURN CASE user_plan 
        WHEN 'essential' THEN 500
        WHEN 'pro' THEN 5000
        ELSE 0
      END;
    ELSE
      RETURN 0;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour limiter les factures selon le plan
CREATE OR REPLACE FUNCTION public.before_insert_invoice()
RETURNS trigger AS $$
DECLARE
  max_allowed INT;
  current_count INT;
BEGIN
  max_allowed := check_plan_limits('max_invoices_per_month');
  IF max_allowed = -1 THEN
    RETURN NEW;
  END IF;

  SELECT COUNT(*) INTO current_count FROM invoices
  WHERE organization_id = NEW.organization_id
    AND created_at >= date_trunc('month', CURRENT_DATE);

  IF current_count >= max_allowed THEN
    RAISE EXCEPTION 'Limite de factures atteinte pour ce mois (% factures max pour le plan %).', max_allowed, get_user_organization_plan();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Appliquer le trigger sur la table invoices
DROP TRIGGER IF EXISTS check_invoice_limit ON public.invoices;
CREATE TRIGGER check_invoice_limit
BEFORE INSERT ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.before_insert_invoice();