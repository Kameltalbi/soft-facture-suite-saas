-- Ajouter la colonne discount à la table quote_items
ALTER TABLE public.quote_items
ADD COLUMN discount numeric DEFAULT 0;

-- Ajouter un commentaire pour clarifier l'utilisation
COMMENT ON COLUMN public.quote_items.discount IS 'Remise appliquée à l''article (pourcentage)';

-- Ajouter aussi une colonne pour le type de remise (optionnel)
ALTER TABLE public.quote_items
ADD COLUMN discount_type text DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'amount'));

COMMENT ON COLUMN public.quote_items.discount_type IS 'Type de remise: percentage (%) ou amount (montant fixe)';