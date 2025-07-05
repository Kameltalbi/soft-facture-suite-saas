-- Nettoyer les organisations orphelines créées par erreur
-- (organisations sans utilisateurs ou avec seulement des utilisateurs supprimés)
DELETE FROM public.organizations 
WHERE id NOT IN (
  SELECT DISTINCT organization_id 
  FROM public.profiles 
  WHERE organization_id IS NOT NULL
)
AND status = 'pending'
AND created_at > '2025-07-05 14:00:00';