
-- Activer RLS sur la table products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir les produits de leur organisation
CREATE POLICY "Users can view organization products" ON public.products
  FOR SELECT USING (organization_id = get_user_organization_id());

-- Politique pour permettre aux utilisateurs de créer des produits pour leur organisation
CREATE POLICY "Users can create organization products" ON public.products
  FOR INSERT WITH CHECK (organization_id = get_user_organization_id());

-- Politique pour permettre aux utilisateurs de modifier les produits de leur organisation
CREATE POLICY "Users can update organization products" ON public.products
  FOR UPDATE USING (organization_id = get_user_organization_id());

-- Politique pour permettre aux utilisateurs de supprimer les produits de leur organisation
CREATE POLICY "Users can delete organization products" ON public.products
  FOR DELETE USING (organization_id = get_user_organization_id());

-- Ajouter la colonne track_stock pour indiquer si le produit doit être suivi en stock
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS track_stock BOOLEAN DEFAULT true;
