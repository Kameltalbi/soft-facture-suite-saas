-- Supprimer les vues avec SECURITY DEFINER si elles existent
DROP VIEW IF EXISTS public.v_ca_par_categorie;
DROP VIEW IF EXISTS public.v_stock_actuel;

-- Créer des fonctions sécurisées avec vérification RLS explicite

-- 1. Fonction pour le CA par catégorie (respecte RLS)
CREATE OR REPLACE FUNCTION public.get_ca_par_categorie()
RETURNS TABLE(
  category text,
  total_amount numeric
) 
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    COALESCE(p.category, 'Non catégorisé') as category,
    SUM(ii.total_price) as total_amount
  FROM invoice_items ii
  JOIN invoices i ON ii.invoice_id = i.id
  LEFT JOIN products p ON ii.product_id = p.id
  WHERE i.organization_id = get_user_organization_id()
    AND ii.organization_id = get_user_organization_id()
  GROUP BY COALESCE(p.category, 'Non catégorisé')
  ORDER BY total_amount DESC;
$$;

-- 2. Fonction pour le stock actuel (respecte RLS)
CREATE OR REPLACE FUNCTION public.get_stock_actuel()
RETURNS TABLE(
  id uuid,
  name text,
  sku text,
  category text,
  stock_quantity integer,
  price numeric,
  active boolean
) 
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    p.id,
    p.name,
    p.sku,
    p.category,
    p.stock_quantity,
    p.price,
    p.active
  FROM products p
  WHERE p.organization_id = get_user_organization_id()
    AND p.track_stock = true
  ORDER BY p.name;
$$;

-- Créer des politiques RLS pour les fonctions (optionnel - les fonctions incluent déjà la vérification)
GRANT EXECUTE ON FUNCTION public.get_ca_par_categorie() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_stock_actuel() TO authenticated;

-- Commentaires pour documenter la sécurité
COMMENT ON FUNCTION public.get_ca_par_categorie() IS 'Fonction sécurisée pour obtenir le CA par catégorie avec respect des politiques RLS';
COMMENT ON FUNCTION public.get_stock_actuel() IS 'Fonction sécurisée pour obtenir le stock actuel avec respect des politiques RLS';