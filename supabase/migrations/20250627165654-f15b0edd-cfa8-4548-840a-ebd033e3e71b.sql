
-- Ajouter les colonnes manquantes à la table organizations
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS vat_number TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Créer un bucket pour les logos des organisations
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'organization-logos',
  'organization-logos',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- Politique de storage pour permettre aux utilisateurs de télécharger des logos
CREATE POLICY "Users can upload organization logos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'organization-logos');

CREATE POLICY "Anyone can view organization logos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'organization-logos');

CREATE POLICY "Users can update their organization logos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'organization-logos');

CREATE POLICY "Users can delete their organization logos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'organization-logos');
