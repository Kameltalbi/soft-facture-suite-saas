-- Permettre aux superadmins de supprimer tous les paiements
CREATE POLICY "Superadmins can delete all payments" 
ON public.payments 
FOR DELETE 
USING (is_superadmin());

-- Permettre aux superadmins de voir tous les paiements pour faciliter la suppression
CREATE POLICY "Superadmins can view all payments" 
ON public.payments 
FOR SELECT 
USING (is_superadmin());