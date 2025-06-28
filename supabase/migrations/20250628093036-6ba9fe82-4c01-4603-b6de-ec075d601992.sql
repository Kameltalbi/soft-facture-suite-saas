
-- Créer une fonction pour récupérer les emails des utilisateurs
CREATE OR REPLACE FUNCTION public.get_user_emails(user_ids uuid[])
RETURNS TABLE(id uuid, email text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT au.id, au.email::text
  FROM auth.users au
  WHERE au.id = ANY(user_ids);
$$;
