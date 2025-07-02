-- Ajouter une politique RLS pour permettre aux superadmins de supprimer des organisations
CREATE POLICY "Superadmins can delete organizations" 
ON public.organizations 
FOR DELETE 
USING (true);