-- Créer une politique RLS pour permettre aux superadmins de créer des organisations
CREATE POLICY "Superadmins can create organizations" 
ON public.organizations 
FOR INSERT 
TO authenticated
WITH CHECK (is_superadmin());