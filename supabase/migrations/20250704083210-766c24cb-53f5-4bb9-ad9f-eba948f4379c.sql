-- Corriger définitivement la fonction check_plan_limits pour les bonnes limites
CREATE OR REPLACE FUNCTION public.check_plan_limits(limit_type TEXT)
RETURNS INTEGER AS $$
DECLARE
  user_plan TEXT;
BEGIN
  user_plan := get_user_organization_plan();

  CASE limit_type
    WHEN 'max_users' THEN
      RETURN CASE user_plan 
        WHEN 'essential' THEN 1  -- 1 utilisateur pour le plan essential
        WHEN 'pro' THEN 3        -- 3 utilisateurs pour le plan pro
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