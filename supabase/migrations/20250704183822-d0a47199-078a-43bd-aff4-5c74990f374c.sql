-- Migration pour convertir les prix de centimes vers unités de devise
-- Diviser tous les prix par 100 pour les convertir en unités de devise (DT, Euro, etc.)

UPDATE products 
SET price = price / 100
WHERE price IS NOT NULL;

-- Mettre à jour également les prix dans les autres tables liées
UPDATE invoice_items 
SET unit_price = unit_price / 100,
    total_price = total_price / 100
WHERE unit_price IS NOT NULL OR total_price IS NOT NULL;

UPDATE quote_items 
SET unit_price = unit_price / 100,
    total_price = total_price / 100
WHERE unit_price IS NOT NULL OR total_price IS NOT NULL;

UPDATE credit_note_items 
SET unit_price = unit_price / 100,
    total_price = total_price / 100
WHERE unit_price IS NOT NULL OR total_price IS NOT NULL;

UPDATE purchase_order_items 
SET unit_price = unit_price / 100,
    total_price = total_price / 100
WHERE unit_price IS NOT NULL OR total_price IS NOT NULL;