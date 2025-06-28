
-- Vérifier le rôle de l'utilisateur Talbi Kamel
SELECT 
  p.first_name,
  p.last_name,
  p.email,
  p.role,
  p.created_at,
  o.name as organization_name
FROM profiles p
LEFT JOIN organizations o ON p.organization_id = o.id
WHERE p.email = 'kameltalbi.tn@gmail.com';
