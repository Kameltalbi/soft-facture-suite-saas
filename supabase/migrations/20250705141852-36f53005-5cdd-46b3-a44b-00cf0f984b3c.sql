-- Mettre à jour les politiques RLS pour la table profiles pour permettre aux admins de gérer les utilisateurs

-- Supprimer les anciennes politiques restrictives
DROP POLICY IF EXISTS "Allow profile creation during user signup" ON public.profiles;

-- Permettre aux admins de créer des profils pour leur organisation
CREATE POLICY "Admins can create profiles in their organization"
ON public.profiles
FOR INSERT
WITH CHECK (
  organization_id = get_user_organization_id() AND
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() 
    AND p.organization_id = get_user_organization_id()
    AND p.role IN ('admin', 'superadmin')
  )
);

-- Permettre la création de profils lors de l'inscription (par le trigger)
CREATE POLICY "Allow profile creation during signup"
ON public.profiles
FOR INSERT
WITH CHECK (
  -- Permet l'insertion par le trigger (SECURITY DEFINER)
  true
);

-- Permettre aux admins de supprimer des profils de leur organisation
CREATE POLICY "Admins can delete profiles in their organization"
ON public.profiles
FOR DELETE
USING (
  organization_id = get_user_organization_id() AND
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() 
    AND p.organization_id = get_user_organization_id()
    AND p.role IN ('admin', 'superadmin')
  )
);