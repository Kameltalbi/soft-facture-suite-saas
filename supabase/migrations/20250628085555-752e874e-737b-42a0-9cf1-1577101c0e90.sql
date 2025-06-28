
-- Vérifier la contrainte existante sur la colonne plan
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.organizations'::regclass 
AND contype = 'c';

-- Créer l'organisation système avec un plan valide (premium par exemple)
INSERT INTO public.organizations (name, email, status, plan)
VALUES ('SOFTFACTURE SUPERADMIN', 'admin@softfacture.com', 'active', 'premium');

-- Récupérer l'ID de l'organisation système nouvellement créée et mettre à jour le profil
WITH system_org AS (
  SELECT id FROM public.organizations WHERE name = 'SOFTFACTURE SUPERADMIN'
)
UPDATE public.profiles 
SET 
  organization_id = (SELECT id FROM system_org),
  role = 'superadmin'
WHERE email = 'kameltalbi.tn@gmail.com';

-- Vérifier la mise à jour
SELECT 
  p.first_name,
  p.last_name,
  p.email,
  p.role,
  p.created_at,
  o.name as organization_name,
  o.plan as organization_plan
FROM profiles p
LEFT JOIN organizations o ON p.organization_id = o.id
WHERE p.email = 'kameltalbi.tn@gmail.com';
