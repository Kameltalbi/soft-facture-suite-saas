-- Mettre à jour les organisations existantes qui n'ont pas de subscription_start pour les passer en "pending"
UPDATE public.organizations 
SET status = 'pending', 
    subscription_start = NULL,
    subscription_end = NULL
WHERE subscription_start IS NULL OR subscription_start = CURRENT_DATE;