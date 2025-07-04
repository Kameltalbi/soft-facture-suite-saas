-- Mettre à jour les organisations actives qui n'ont pas de subscription_end
-- En définissant subscription_end à subscription_start + 1 an
UPDATE public.organizations 
SET subscription_end = (subscription_start::date + INTERVAL '1 year')::date,
    updated_at = now()
WHERE status = 'active' 
  AND subscription_start IS NOT NULL 
  AND subscription_end IS NULL;