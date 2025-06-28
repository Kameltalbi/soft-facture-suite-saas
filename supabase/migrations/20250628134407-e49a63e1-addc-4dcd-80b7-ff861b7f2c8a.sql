
-- Activer RLS sur la table categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour categories
CREATE POLICY "Users can view organization categories" ON public.categories
  FOR SELECT USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can create organization categories" ON public.categories
  FOR INSERT WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can update organization categories" ON public.categories
  FOR UPDATE USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can delete organization categories" ON public.categories
  FOR DELETE USING (organization_id = get_user_organization_id());
