-- Supprimer la politique problématique
DROP POLICY IF EXISTS "Superadmins can view all profiles" ON public.profiles;

-- Créer une fonction security definer pour vérifier le rôle superadmin
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'superadmin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Créer la politique correcte en utilisant la fonction
CREATE POLICY "Superadmins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_superadmin());