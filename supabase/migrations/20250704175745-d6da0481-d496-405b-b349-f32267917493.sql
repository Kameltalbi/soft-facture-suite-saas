-- Ajouter une politique RLS pour permettre aux superadmins de voir tous les profils
CREATE POLICY "Superadmins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'superadmin'
  )
);