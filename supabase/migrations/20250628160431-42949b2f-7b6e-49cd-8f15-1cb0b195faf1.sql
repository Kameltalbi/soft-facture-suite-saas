
-- Vérifier les politiques RLS existantes pour la table invoices
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('invoices', 'invoice_items', 'clients', 'organizations')
ORDER BY tablename, policyname;

-- Vérifier si RLS est activé sur ces tables
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('invoices', 'invoice_items', 'clients', 'organizations');
