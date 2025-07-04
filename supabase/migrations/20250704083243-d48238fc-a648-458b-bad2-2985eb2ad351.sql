-- Corriger le trigger before_insert_profile pour gérer les nouvelles inscriptions
CREATE OR REPLACE FUNCTION public.before_insert_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  max_allowed INT;
  current_count INT;
  org_plan TEXT;
BEGIN
  -- Récupérer le plan de l'organisation
  SELECT plan INTO org_plan FROM organizations WHERE id = NEW.organization_id;
  
  -- Définir la limite basée sur le plan
  CASE org_plan
    WHEN 'essential' THEN max_allowed := 1;
    WHEN 'pro' THEN max_allowed := 3;
    ELSE max_allowed := 1; -- Valeur par défaut pour les organisations sans plan défini
  END CASE;
  
  -- Compter les utilisateurs actuels
  SELECT COUNT(*) INTO current_count FROM profiles
  WHERE organization_id = NEW.organization_id;

  -- Vérifier la limite
  IF current_count >= max_allowed THEN
    RAISE EXCEPTION 'Limite d''utilisateurs atteinte pour le plan % (% utilisateurs max). Passez au plan Pro ou ajoutez des utilisateurs supplémentaires.', 
      COALESCE(org_plan, 'essential'), max_allowed;
  END IF;

  RETURN NEW;
END;
$$;