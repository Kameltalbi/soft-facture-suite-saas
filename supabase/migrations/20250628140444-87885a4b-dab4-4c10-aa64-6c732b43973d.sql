
-- Ajouter le champ tax_rate à la table products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS tax_rate NUMERIC DEFAULT 0;

-- Ajouter un commentaire pour documenter le champ
COMMENT ON COLUMN public.products.tax_rate IS 'Taux de TVA en pourcentage (ex: 20.00 pour 20%)';
