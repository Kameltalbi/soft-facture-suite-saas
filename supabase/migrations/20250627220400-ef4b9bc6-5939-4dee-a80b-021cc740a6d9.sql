
-- Vérifier quelles tables ont une colonne organization_id
SELECT 
    t.table_name,
    CASE 
        WHEN c.column_name IS NOT NULL THEN 'OUI'
        ELSE 'NON'
    END as has_organization_id
FROM information_schema.tables t
LEFT JOIN information_schema.columns c 
    ON t.table_name = c.table_name 
    AND t.table_schema = c.table_schema 
    AND c.column_name = 'organization_id'
WHERE t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
    AND t.table_name NOT IN ('profiles', 'organizations') -- Exclure les tables qui n'ont pas besoin d'organization_id
ORDER BY t.table_name;

-- Requête plus détaillée pour voir la structure des colonnes organization_id
SELECT 
    t.table_name,
    c.column_name,
    c.data_type,
    c.is_nullable,
    c.column_default,
    CASE 
        WHEN fk.constraint_name IS NOT NULL THEN 'OUI'
        ELSE 'NON'
    END as has_foreign_key_constraint
FROM information_schema.tables t
JOIN information_schema.columns c 
    ON t.table_name = c.table_name 
    AND t.table_schema = c.table_schema
LEFT JOIN information_schema.table_constraints tc
    ON tc.table_name = t.table_name
    AND tc.table_schema = t.table_schema
    AND tc.constraint_type = 'FOREIGN KEY'
LEFT JOIN information_schema.key_column_usage fk
    ON fk.constraint_name = tc.constraint_name
    AND fk.column_name = c.column_name
WHERE t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
    AND c.column_name = 'organization_id'
ORDER BY t.table_name;
