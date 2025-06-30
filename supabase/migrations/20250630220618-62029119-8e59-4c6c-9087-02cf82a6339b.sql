
-- Ajouter les colonnes unified_template et use_unified_template à la table global_settings
ALTER TABLE global_settings 
ADD COLUMN unified_template text DEFAULT 'classic',
ADD COLUMN use_unified_template boolean DEFAULT false;
