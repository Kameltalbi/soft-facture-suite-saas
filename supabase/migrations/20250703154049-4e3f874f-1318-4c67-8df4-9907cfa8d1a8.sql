-- Supprimer l'ancienne contrainte sur les plans
ALTER TABLE public.organizations 
DROP CONSTRAINT IF EXISTS organizations_plan_check;

-- Mettre à jour tous les plans existants vers les nouveaux plans
UPDATE public.organizations 
SET plan = CASE 
  WHEN plan = 'free' THEN 'essential'
  WHEN plan = 'standard' THEN 'essential' 
  WHEN plan = 'premium' THEN 'pro'
  ELSE plan 
END
WHERE plan IN ('free', 'standard', 'premium');

-- Mettre à jour la valeur par défaut de la colonne plan
ALTER TABLE public.organizations 
ALTER COLUMN plan SET DEFAULT 'essential';

-- Ajouter une contrainte pour s'assurer que seuls les plans 'essential' et 'pro' sont autorisés
ALTER TABLE public.organizations 
ADD CONSTRAINT organizations_plan_check 
CHECK (plan IN ('essential', 'pro'));