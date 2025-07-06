-- Créer un bucket storage pour les signatures
INSERT INTO storage.buckets (id, name, public) VALUES ('organization-signatures', 'organization-signatures', true);

-- Créer les politiques pour le bucket signatures
CREATE POLICY "Signature images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'organization-signatures');

CREATE POLICY "Users can upload their organization signature" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'organization-signatures' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their organization signature" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'organization-signatures' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their organization signature" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'organization-signatures' AND auth.uid() IS NOT NULL);

-- Ajouter une colonne signature_url à la table organizations
ALTER TABLE public.organizations ADD COLUMN signature_url TEXT;