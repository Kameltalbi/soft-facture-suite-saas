
-- Supprimer les données de test de l'ancienne organisation pour éviter les conflits
-- On garde seulement les données de l'organisation actuelle (2371a260-53af-48df-a4a2-114cb6e7d604)

-- Supprimer les éléments liés aux documents d'abord (pour éviter les contraintes de clés étrangères)
DELETE FROM quote_items WHERE organization_id != '2371a260-53af-48df-a4a2-114cb6e7d604';
DELETE FROM invoice_items WHERE organization_id != '2371a260-53af-48df-a4a2-114cb6e7d604';
DELETE FROM delivery_note_items WHERE organization_id != '2371a260-53af-48df-a4a2-114cb6e7d604';
DELETE FROM purchase_order_items WHERE organization_id != '2371a260-53af-48df-a4a2-114cb6e7d604';
DELETE FROM credit_note_items WHERE organization_id != '2371a260-53af-48df-a4a2-114cb6e7d604';

-- Supprimer les documents principaux
DELETE FROM quotes WHERE organization_id != '2371a260-53af-48df-a4a2-114cb6e7d604';
DELETE FROM invoices WHERE organization_id != '2371a260-53af-48df-a4a2-114cb6e7d604';
DELETE FROM delivery_notes WHERE organization_id != '2371a260-53af-48df-a4a2-114cb6e7d604';
DELETE FROM purchase_orders WHERE organization_id != '2371a260-53af-48df-a4a2-114cb6e7d604';
DELETE FROM credit_notes WHERE organization_id != '2371a260-53af-48df-a4a2-114cb6e7d604';

-- Supprimer les données de base
DELETE FROM products WHERE organization_id != '2371a260-53af-48df-a4a2-114cb6e7d604';
DELETE FROM categories WHERE organization_id != '2371a260-53af-48df-a4a2-114cb6e7d604';
DELETE FROM clients WHERE organization_id != '2371a260-53af-48df-a4a2-114cb6e7d604';
DELETE FROM suppliers WHERE organization_id != '2371a260-53af-48df-a4a2-114cb6e7d604';

-- Supprimer les autres données
DELETE FROM currencies WHERE organization_id != '2371a260-53af-48df-a4a2-114cb6e7d604';
DELETE FROM stock_movements WHERE organization_id != '2371a260-53af-48df-a4a2-114cb6e7d604';
