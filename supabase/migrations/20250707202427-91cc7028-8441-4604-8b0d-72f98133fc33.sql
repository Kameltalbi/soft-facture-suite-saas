-- Supprimer les colonnes d'acompte de la table quotes car elles ne sont pas nécessaires pour les devis
ALTER TABLE public.quotes DROP COLUMN IF EXISTS has_advance;
ALTER TABLE public.quotes DROP COLUMN IF EXISTS advance_amount;