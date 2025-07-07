-- Mettre à jour la fonction check_plan_limits pour corriger les limites utilisateurs
CREATE OR REPLACE FUNCTION public.check_plan_limits(limit_type text)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  user_plan TEXT;
BEGIN
  user_plan := get_user_organization_plan();

  CASE limit_type
    WHEN 'max_users' THEN
      RETURN CASE user_plan 
        WHEN 'essential' THEN 2  -- 2 utilisateurs pour le plan essential (correction)
        WHEN 'pro' THEN 3        -- 3 utilisateurs pour le plan pro
        ELSE 2                   -- Valeur par défaut 2 utilisateurs
      END;
    WHEN 'additional_user_cost' THEN
      -- Coût par utilisateur supplémentaire (20 DT HT/an)
      RETURN 20;
    ELSE
      RETURN 0;
  END CASE;
END;
$function$;