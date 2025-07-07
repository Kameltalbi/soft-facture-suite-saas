-- Ajouter la colonne show_discount aux paramètres globaux
ALTER TABLE global_settings 
ADD COLUMN show_discount BOOLEAN DEFAULT true;