
-- Insertion de données de test pour l'organisation (version finale corrigée)

-- Insertion des catégories
INSERT INTO categories (name, description, color, organization_id) VALUES
('Électronique', 'Produits électroniques et informatiques', '#3B82F6', (SELECT id FROM organizations LIMIT 1)),
('Mobilier', 'Meubles et équipements de bureau', '#10B981', (SELECT id FROM organizations LIMIT 1)),
('Papeterie', 'Fournitures de bureau et papeterie', '#F59E0B', (SELECT id FROM organizations LIMIT 1)),
('Logiciels', 'Licences et abonnements logiciels', '#8B5CF6', (SELECT id FROM organizations LIMIT 1)),
('Services', 'Prestations de services', '#EF4444', (SELECT id FROM organizations LIMIT 1)),
('Formation', 'Formations et coaching', '#06B6D4', (SELECT id FROM organizations LIMIT 1)),
('Maintenance', 'Services de maintenance et réparation', '#84CC16', (SELECT id FROM organizations LIMIT 1));

-- Insertion des produits
INSERT INTO products (name, description, price, unit, stock_quantity, category, sku, organization_id) VALUES
('Ordinateur portable Dell', 'Laptop professionnel 15 pouces', 899.99, 'pièce', 25, 'Électronique', 'DELL-LAP-001', (SELECT id FROM organizations LIMIT 1)),
('Écran 24 pouces', 'Moniteur LED Full HD', 249.99, 'pièce', 40, 'Électronique', 'MON-24-001', (SELECT id FROM organizations LIMIT 1)),
('Bureau ergonomique', 'Bureau réglable en hauteur', 449.99, 'pièce', 15, 'Mobilier', 'BUR-ERG-001', (SELECT id FROM organizations LIMIT 1)),
('Chaise de bureau', 'Siège ergonomique avec support lombaire', 189.99, 'pièce', 30, 'Mobilier', 'CHA-ERG-001', (SELECT id FROM organizations LIMIT 1)),
('Ramette papier A4', 'Papier blanc 80g, 500 feuilles', 4.99, 'ramette', 200, 'Papeterie', 'PAP-A4-001', (SELECT id FROM organizations LIMIT 1)),
('Stylos gel', 'Lot de 10 stylos gel noirs', 12.99, 'lot', 50, 'Papeterie', 'STY-GEL-001', (SELECT id FROM organizations LIMIT 1)),
('Licence Office 365', 'Abonnement annuel Office 365', 89.99, 'licence', 100, 'Logiciels', 'OFF-365-001', (SELECT id FROM organizations LIMIT 1)),
('Formation Excel', 'Formation Excel niveau avancé', 299.99, 'session', 20, 'Formation', 'FOR-EXC-001', (SELECT id FROM organizations LIMIT 1)),
('Maintenance PC', 'Service de maintenance préventive', 79.99, 'intervention', 50, 'Maintenance', 'MAI-PC-001', (SELECT id FROM organizations LIMIT 1)),
('Consultation IT', 'Conseil en système d''information', 150.00, 'heure', 100, 'Services', 'CON-IT-001', (SELECT id FROM organizations LIMIT 1));

-- Insertion des clients
INSERT INTO clients (name, company, email, phone, address, city, postal_code, country, organization_id) VALUES
('Martin Dubois', 'SARL Dubois', 'martin.dubois@email.com', '01.23.45.67.89', '123 Rue de la Paix', 'Paris', '75001', 'France', (SELECT id FROM organizations LIMIT 1)),
('Sophie Laurent', 'Laurent Consulting', 'sophie.laurent@email.com', '01.34.56.78.90', '456 Avenue des Champs', 'Lyon', '69001', 'France', (SELECT id FROM organizations LIMIT 1)),
('Pierre Moreau', 'Moreau & Associés', 'pierre.moreau@email.com', '01.45.67.89.01', '789 Boulevard Saint-Germain', 'Marseille', '13001', 'France', (SELECT id FROM organizations LIMIT 1)),
('Marie Leroy', 'Entreprise Leroy', 'marie.leroy@email.com', '01.56.78.90.12', '321 Rue Victor Hugo', 'Toulouse', '31000', 'France', (SELECT id FROM organizations LIMIT 1)),
('Jean Bernard', 'Bernard Solutions', 'jean.bernard@email.com', '01.67.89.01.23', '654 Place de la République', 'Nice', '06000', 'France', (SELECT id FROM organizations LIMIT 1)),
('Claire Petit', 'Petit Industries', 'claire.petit@email.com', '01.78.90.12.34', '987 Cours Mirabeau', 'Aix-en-Provence', '13100', 'France', (SELECT id FROM organizations LIMIT 1)),
('Paul Girard', 'Girard & Co', 'paul.girard@email.com', '01.89.01.23.45', '147 Rue de Rivoli', 'Paris', '75004', 'France', (SELECT id FROM organizations LIMIT 1)),
('Lucie Roux', 'Roux Développement', 'lucie.roux@email.com', '01.90.12.34.56', '258 Avenue de la Liberté', 'Strasbourg', '67000', 'France', (SELECT id FROM organizations LIMIT 1)),
('Marc Blanc', 'Blanc Innovations', 'marc.blanc@email.com', '02.01.23.45.67', '369 Boulevard de la Mer', 'Nantes', '44000', 'France', (SELECT id FROM organizations LIMIT 1)),
('Anne Noir', 'Noir Consulting', 'anne.noir@email.com', '02.12.34.56.78', '741 Rue de la Gare', 'Bordeaux', '33000', 'France', (SELECT id FROM organizations LIMIT 1)),
('David Vert', 'Vert Technologies', 'david.vert@email.com', '02.23.45.67.89', '852 Place du Marché', 'Lille', '59000', 'France', (SELECT id FROM organizations LIMIT 1)),
('Emma Bleu', 'Bleu Services', 'emma.bleu@email.com', '02.34.56.78.90', '963 Avenue des Arts', 'Montpellier', '34000', 'France', (SELECT id FROM organizations LIMIT 1)),
('Thomas Rouge', 'Rouge Experts', 'thomas.rouge@email.com', '02.45.67.89.01', '159 Rue du Commerce', 'Rennes', '35000', 'France', (SELECT id FROM organizations LIMIT 1)),
('Julie Jaune', 'Jaune Consulting', 'julie.jaune@email.com', '02.56.78.90.12', '357 Boulevard Central', 'Reims', '51100', 'France', (SELECT id FROM organizations LIMIT 1)),
('Antoine Rose', 'Rose & Associés', 'antoine.rose@email.com', '02.67.89.01.23', '468 Cours Lafayette', 'Tours', '37000', 'France', (SELECT id FROM organizations LIMIT 1));

-- Insertion des fournisseurs
INSERT INTO suppliers (name, contact_name, email, phone, address, city, postal_code, country, business_sector, organization_id) VALUES
('TechnoSupply', 'Jean Dupont', 'contact@technosupply.fr', '01.11.22.33.44', '100 Rue de l''Innovation', 'Paris', '75010', 'France', 'Informatique', (SELECT id FROM organizations LIMIT 1)),
('Bureau Plus', 'Marie Martin', 'marie@bureauplus.fr', '01.22.33.44.55', '200 Avenue du Mobilier', 'Lyon', '69002', 'France', 'Mobilier', (SELECT id FROM organizations LIMIT 1)),
('Papeterie Centrale', 'Pierre Durand', 'pierre@papeteriecentrale.fr', '01.33.44.55.66', '300 Rue du Papier', 'Marseille', '13002', 'France', 'Papeterie', (SELECT id FROM organizations LIMIT 1)),
('SoftwarePro', 'Sophie Legrand', 'sophie@softwarepro.fr', '01.44.55.66.77', '400 Boulevard des Logiciels', 'Toulouse', '31001', 'France', 'Logiciels', (SELECT id FROM organizations LIMIT 1)),
('FormationExpert', 'Paul Rousseau', 'paul@formationexpert.fr', '01.55.66.77.88', '500 Place de la Formation', 'Nice', '06001', 'France', 'Formation', (SELECT id FROM organizations LIMIT 1)),
('ServiceMaintenance', 'Claire Lefebvre', 'claire@servicemaintenance.fr', '01.66.77.88.99', '600 Rue de la Réparation', 'Strasbourg', '67001', 'France', 'Maintenance', (SELECT id FROM organizations LIMIT 1)),
('ConseilPro', 'Marc Mercier', 'marc@conseilpro.fr', '01.77.88.99.00', '700 Avenue du Conseil', 'Nantes', '44001', 'France', 'Services', (SELECT id FROM organizations LIMIT 1));

-- Génération de devis pour janvier 2025 (6 par mois)
DO $$
DECLARE
    org_id UUID;
    client_ids UUID[];
    product_ids UUID[];
    i INTEGER;
    quote_date DATE;
    client_id UUID;
    product_id UUID;
    quote_id UUID;
    item_price NUMERIC;
    item_quantity INTEGER;
    item_total NUMERIC;
    quote_subtotal NUMERIC;
    quote_tax NUMERIC;
    quote_total NUMERIC;
BEGIN
    -- Récupération de l'ID de l'organisation
    SELECT id INTO org_id FROM organizations LIMIT 1;
    
    -- Récupération des IDs des clients et produits
    SELECT ARRAY_AGG(id) INTO client_ids FROM clients WHERE organization_id = org_id;
    SELECT ARRAY_AGG(id) INTO product_ids FROM products WHERE organization_id = org_id;
    
    -- Génération de 6 devis pour janvier 2025
    FOR i IN 1..6 LOOP
        quote_date := '2025-01-' || LPAD((i * 5)::TEXT, 2, '0');
        client_id := client_ids[1 + (i - 1) % array_length(client_ids, 1)];
        
        -- Insertion du devis avec statuts corrects: 'draft', 'sent', 'accepted', 'rejected', 'expired'
        INSERT INTO quotes (
            quote_number, client_id, organization_id, date, 
            valid_until, status, subtotal, tax_amount, total_amount
        ) VALUES (
            'DEV-2025-' || LPAD(i::TEXT, 4, '0'),
            client_id, org_id, quote_date,
            quote_date + INTERVAL '30 days',
            CASE WHEN i % 3 = 0 THEN 'accepted' WHEN i % 2 = 0 THEN 'sent' ELSE 'draft' END,
            0, 0, 0
        ) RETURNING id INTO quote_id;
        
        -- Ajout de 2-3 articles par devis
        quote_subtotal := 0;
        FOR j IN 1..(2 + (i % 2)) LOOP
            product_id := product_ids[1 + ((i + j - 1) % array_length(product_ids, 1))];
            SELECT price INTO item_price FROM products WHERE id = product_id;
            item_quantity := 1 + (j % 3);
            item_total := item_price * item_quantity;
            quote_subtotal := quote_subtotal + item_total;
            
            INSERT INTO quote_items (
                quote_id, organization_id, product_id, description,
                quantity, unit_price, tax_rate, total_price
            ) VALUES (
                quote_id, org_id, product_id, 
                (SELECT name FROM products WHERE id = product_id),
                item_quantity, item_price, 20, item_total
            );
        END LOOP;
        
        -- Mise à jour des totaux du devis
        quote_tax := quote_subtotal * 0.20;
        quote_total := quote_subtotal + quote_tax;
        
        UPDATE quotes SET 
            subtotal = quote_subtotal,
            tax_amount = quote_tax,
            total_amount = quote_total
        WHERE id = quote_id;
    END LOOP;
END $$;

-- Génération de factures pour janvier 2025 (9 par mois)
DO $$
DECLARE
    org_id UUID;
    client_ids UUID[];
    product_ids UUID[];
    i INTEGER;
    invoice_date DATE;
    client_id UUID;
    product_id UUID;
    invoice_id UUID;
    item_price NUMERIC;
    item_quantity INTEGER;
    item_total NUMERIC;
    invoice_subtotal NUMERIC;
    invoice_tax NUMERIC;
    invoice_total NUMERIC;
BEGIN
    -- Récupération de l'ID de l'organisation
    SELECT id INTO org_id FROM organizations LIMIT 1;
    
    -- Récupération des IDs des clients et produits
    SELECT ARRAY_AGG(id) INTO client_ids FROM clients WHERE organization_id = org_id;
    SELECT ARRAY_AGG(id) INTO product_ids FROM products WHERE organization_id = org_id;
    
    -- Génération de 9 factures pour janvier 2025
    FOR i IN 1..9 LOOP
        invoice_date := '2025-01-' || LPAD((i * 3)::TEXT, 2, '0');
        client_id := client_ids[1 + (i - 1) % array_length(client_ids, 1)];
        
        -- Insertion de la facture avec statuts corrects: 'draft', 'sent', 'paid', 'overdue', 'cancelled'
        INSERT INTO invoices (
            invoice_number, client_id, organization_id, date, 
            due_date, status, subtotal, tax_amount, total_amount, amount_paid
        ) VALUES (
            'FAC-2025-' || LPAD(i::TEXT, 4, '0'),
            client_id, org_id, invoice_date,
            invoice_date + INTERVAL '30 days',
            CASE WHEN i % 4 = 0 THEN 'paid' WHEN i % 3 = 0 THEN 'overdue' ELSE 'sent' END,
            0, 0, 0, 0
        ) RETURNING id INTO invoice_id;
        
        -- Ajout de 2-4 articles par facture
        invoice_subtotal := 0;
        FOR j IN 1..(2 + (i % 3)) LOOP
            product_id := product_ids[1 + ((i + j - 1) % array_length(product_ids, 1))];
            SELECT price INTO item_price FROM products WHERE id = product_id;
            item_quantity := 1 + (j % 4);
            item_total := item_price * item_quantity;
            invoice_subtotal := invoice_subtotal + item_total;
            
            INSERT INTO invoice_items (
                invoice_id, organization_id, product_id, description,
                quantity, unit_price, tax_rate, total_price
            ) VALUES (
                invoice_id, org_id, product_id, 
                (SELECT name FROM products WHERE id = product_id),
                item_quantity, item_price, 20, item_total
            );
        END LOOP;
        
        -- Mise à jour des totaux de la facture
        invoice_tax := invoice_subtotal * 0.20;
        invoice_total := invoice_subtotal + invoice_tax;
        
        UPDATE invoices SET 
            subtotal = invoice_subtotal,
            tax_amount = invoice_tax,
            total_amount = invoice_total,
            amount_paid = CASE WHEN i % 4 = 0 THEN invoice_total WHEN i % 3 = 0 THEN 0 ELSE invoice_total * 0.5 END
        WHERE id = invoice_id;
    END LOOP;
END $$;

-- Génération de bons de livraison pour janvier 2025 (7 par mois)
DO $$
DECLARE
    org_id UUID;
    client_ids UUID[];
    product_ids UUID[];
    i INTEGER;
    delivery_date DATE;
    client_id UUID;
    product_id UUID;
    delivery_id UUID;
    item_quantity INTEGER;
BEGIN
    -- Récupération de l'ID de l'organisation
    SELECT id INTO org_id FROM organizations LIMIT 1;
    
    -- Récupération des IDs des clients et produits
    SELECT ARRAY_AGG(id) INTO client_ids FROM clients WHERE organization_id = org_id;
    SELECT ARRAY_AGG(id) INTO product_ids FROM products WHERE organization_id = org_id;
    
    -- Génération de 7 bons de livraison pour janvier 2025
    FOR i IN 1..7 LOOP
        delivery_date := '2025-01-' || LPAD((i * 4)::TEXT, 2, '0');
        client_id := client_ids[1 + (i - 1) % array_length(client_ids, 1)];
        
        -- Insertion du bon de livraison avec statuts corrects: 'pending', 'delivered', 'partial'
        INSERT INTO delivery_notes (
            delivery_number, client_id, organization_id, date,
            expected_delivery_date, status
        ) VALUES (
            'BL-2025-' || LPAD(i::TEXT, 4, '0'),
            client_id, org_id, delivery_date,
            delivery_date + INTERVAL '7 days',
            CASE WHEN i % 3 = 0 THEN 'delivered' WHEN i % 2 = 0 THEN 'partial' ELSE 'pending' END
        ) RETURNING id INTO delivery_id;
        
        -- Ajout de 1-3 articles par bon de livraison
        FOR j IN 1..(1 + (i % 3)) LOOP
            product_id := product_ids[1 + ((i + j - 1) % array_length(product_ids, 1))];
            item_quantity := 1 + (j % 5);
            
            INSERT INTO delivery_note_items (
                delivery_note_id, organization_id, product_id, description,
                quantity, delivered_quantity, status
            ) VALUES (
                delivery_id, org_id, product_id, 
                (SELECT name FROM products WHERE id = product_id),
                item_quantity, 
                CASE WHEN i % 3 = 0 THEN item_quantity ELSE item_quantity * 0.8 END,
                CASE WHEN i % 3 = 0 THEN 'delivered' WHEN i % 2 = 0 THEN 'partial' ELSE 'pending' END
            );
        END LOOP;
    END LOOP;
END $$;

-- Génération de bons de commande pour janvier 2025 (4 par mois)
DO $$
DECLARE
    org_id UUID;
    supplier_ids UUID[];
    product_ids UUID[];
    i INTEGER;
    order_date DATE;
    supplier_id UUID;
    product_id UUID;
    order_id UUID;
    item_price NUMERIC;
    item_quantity INTEGER;
    item_total NUMERIC;
    order_subtotal NUMERIC;
    order_tax NUMERIC;
    order_total NUMERIC;
BEGIN
    -- Récupération de l'ID de l'organisation
    SELECT id INTO org_id FROM organizations LIMIT 1;
    
    -- Récupération des IDs des fournisseurs et produits
    SELECT ARRAY_AGG(id) INTO supplier_ids FROM suppliers WHERE organization_id = org_id;
    SELECT ARRAY_AGG(id) INTO product_ids FROM products WHERE organization_id = org_id;
    
    -- Génération de 4 bons de commande pour janvier 2025
    FOR i IN 1..4 LOOP
        order_date := '2025-01-' || LPAD((i * 7)::TEXT, 2, '0');
        supplier_id := supplier_ids[1 + (i - 1) % array_length(supplier_ids, 1)];
        
        -- Insertion du bon de commande avec statuts corrects: 'draft', 'sent', 'confirmed', 'received', 'cancelled'
        INSERT INTO purchase_orders (
            purchase_order_number, supplier_id, organization_id, date,
            expected_delivery_date, status, subtotal, tax_amount, total_amount
        ) VALUES (
            'BC-2025-' || LPAD(i::TEXT, 4, '0'),
            supplier_id, org_id, order_date,
            order_date + INTERVAL '14 days',
            CASE WHEN i % 3 = 0 THEN 'received' WHEN i % 2 = 0 THEN 'confirmed' ELSE 'draft' END,
            0, 0, 0
        ) RETURNING id INTO order_id;
        
        -- Ajout de 2-5 articles par bon de commande
        order_subtotal := 0;
        FOR j IN 1..(2 + (i % 4)) LOOP
            product_id := product_ids[1 + ((i + j - 1) % array_length(product_ids, 1))];
            SELECT price INTO item_price FROM products WHERE id = product_id;
            item_quantity := 5 + (j % 10); -- Quantités plus importantes pour les commandes
            item_total := item_price * item_quantity * 0.8; -- Prix d'achat réduit
            order_subtotal := order_subtotal + item_total;
            
            INSERT INTO purchase_order_items (
                purchase_order_id, organization_id, product_id, description,
                quantity, unit_price, tax_rate, total_price, received_quantity
            ) VALUES (
                order_id, org_id, product_id, 
                (SELECT name FROM products WHERE id = product_id),
                item_quantity, item_price * 0.8, 20, item_total,
                CASE WHEN i % 3 = 0 THEN item_quantity ELSE 0 END
            );
        END LOOP;
        
        -- Mise à jour des totaux du bon de commande
        order_tax := order_subtotal * 0.20;
        order_total := order_subtotal + order_tax;
        
        UPDATE purchase_orders SET 
            subtotal = order_subtotal,
            tax_amount = order_tax,
            total_amount = order_total
        WHERE id = order_id;
    END LOOP;
END $$;
