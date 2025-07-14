-- Ajouter le paramètre show_fiscal_stamp à la table global_settings
ALTER TABLE public.global_settings 
ADD COLUMN show_fiscal_stamp boolean DEFAULT true;