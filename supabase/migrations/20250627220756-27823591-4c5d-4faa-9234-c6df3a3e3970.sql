
-- Vérifier quelles tables ont RLS activé et lister leurs politiques
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    CASE 
        WHEN rowsecurity THEN 'ACTIVÉ'
        ELSE 'DÉSACTIVÉ'
    END as rls_status
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Lister toutes les politiques RLS avec leurs détails
SELECT 
    n.nspname as schema_name,
    c.relname as table_name,
    p.polname as policy_name,
    p.polcmd as command_type,
    CASE p.polcmd 
        WHEN 'r' THEN 'SELECT'
        WHEN 'a' THEN 'INSERT' 
        WHEN 'w' THEN 'UPDATE'
        WHEN 'd' THEN 'DELETE'
        WHEN '*' THEN 'ALL'
        ELSE p.polcmd::text
    END as operation,
    CASE p.polpermissive
        WHEN true THEN 'PERMISSIVE'
        ELSE 'RESTRICTIVE'
    END as policy_type,
    pg_get_expr(p.polqual, p.polrelid) as using_expression,
    pg_get_expr(p.polwithcheck, p.polrelid) as with_check_expression,
    r.rolname as role_name
FROM pg_policy p
JOIN pg_class c ON p.polrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
LEFT JOIN pg_roles r ON p.polroles @> ARRAY[r.oid]
WHERE n.nspname = 'public'
ORDER BY c.relname, p.polname;

-- Résumé par table des politiques RLS
SELECT 
    c.relname as table_name,
    COUNT(p.polname) as nombre_politiques,
    STRING_AGG(DISTINCT 
        CASE p.polcmd 
            WHEN 'r' THEN 'SELECT'
            WHEN 'a' THEN 'INSERT' 
            WHEN 'w' THEN 'UPDATE'
            WHEN 'd' THEN 'DELETE'
            WHEN '*' THEN 'ALL'
            ELSE p.polcmd::text
        END, ', ' ORDER BY 
        CASE p.polcmd 
            WHEN 'r' THEN 'SELECT'
            WHEN 'a' THEN 'INSERT' 
            WHEN 'w' THEN 'UPDATE'
            WHEN 'd' THEN 'DELETE'
            WHEN '*' THEN 'ALL'
            ELSE p.polcmd::text
        END
    ) as operations_couvertes
FROM pg_class c
JOIN pg_namespace n ON c.relnamespace = n.oid
LEFT JOIN pg_policy p ON p.polrelid = c.oid
WHERE n.nspname = 'public' 
    AND c.relkind = 'r'
GROUP BY c.relname
ORDER BY c.relname;
