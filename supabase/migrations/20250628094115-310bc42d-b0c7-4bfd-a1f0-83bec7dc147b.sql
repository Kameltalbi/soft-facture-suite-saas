
-- Ajouter les colonnes de dates d'abonnement si elles n'existent pas déjà
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS subscription_start DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS subscription_end DATE;

-- Créer une fonction pour prolonger les abonnements
CREATE OR REPLACE FUNCTION extend_subscription(org_id uuid, months integer)
RETURNS void AS $$
BEGIN
  UPDATE public.organizations
  SET subscription_end = COALESCE(subscription_end, CURRENT_DATE) + (months || ' months')::interval,
      updated_at = now()
  WHERE id = org_id;
END;
$$ LANGUAGE plpgsql;

-- Créer une fonction pour calculer le statut d'abonnement
CREATE OR REPLACE FUNCTION get_subscription_status(start_date date, end_date date)
RETURNS text AS $$
BEGIN
  IF end_date IS NULL THEN
    RETURN 'unlimited';
  ELSIF end_date < CURRENT_DATE THEN
    RETURN 'expired';
  ELSIF end_date <= CURRENT_DATE + INTERVAL '7 days' THEN
    RETURN 'expiring_soon';
  ELSE
    RETURN 'active';
  END IF;
END;
$$ LANGUAGE plpgsql;
