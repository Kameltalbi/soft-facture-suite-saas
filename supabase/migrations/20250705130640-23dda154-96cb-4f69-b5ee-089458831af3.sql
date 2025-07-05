-- Ajouter la colonne tax_rate à la table products
ALTER TABLE public.products 
ADD COLUMN tax_rate NUMERIC DEFAULT 20;

-- Ajouter un commentaire pour documenter la colonne
COMMENT ON COLUMN public.products.tax_rate IS 'Taux de TVA en pourcentage (ex: 20 pour 20%)';

-- Ajouter une contrainte pour s'assurer que le taux de TVA est valide (entre 0 et 100)
ALTER TABLE public.products 
ADD CONSTRAINT tax_rate_valid CHECK (tax_rate >= 0 AND tax_rate <= 100);