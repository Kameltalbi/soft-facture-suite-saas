-- Ajouter les paramètres manquants à la table quotes pour avoir les mêmes options que les factures
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS use_vat boolean DEFAULT true;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS has_advance boolean DEFAULT false;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS advance_amount numeric DEFAULT 0;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS custom_taxes_used text[] DEFAULT '{}';
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS currency_id uuid REFERENCES public.currencies(id);
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS subject text;

-- Commentaire pour expliquer les nouveaux champs
COMMENT ON COLUMN public.quotes.use_vat IS 'Détermine si la TVA est utilisée pour ce devis';
COMMENT ON COLUMN public.quotes.has_advance IS 'Indique si le devis inclut un acompte';
COMMENT ON COLUMN public.quotes.advance_amount IS 'Montant de l''acompte si applicable';
COMMENT ON COLUMN public.quotes.custom_taxes_used IS 'Liste des IDs des taxes personnalisées utilisées';
COMMENT ON COLUMN public.quotes.currency_id IS 'Devise utilisée pour ce devis';
COMMENT ON COLUMN public.quotes.subject IS 'Objet/référence du devis';