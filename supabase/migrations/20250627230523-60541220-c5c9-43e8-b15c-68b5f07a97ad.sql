
-- Ajouter la colonne email à la table profiles
ALTER TABLE public.profiles ADD COLUMN email text;

-- Créer un index pour optimiser les recherches par email
CREATE INDEX idx_profiles_email ON public.profiles(email);
