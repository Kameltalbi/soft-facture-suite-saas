
-- Activer RLS sur la table clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir les clients de leur organisation
CREATE POLICY "Users can view organization clients" ON public.clients
  FOR SELECT USING (organization_id = get_user_organization_id());

-- Politique pour permettre aux utilisateurs de créer des clients pour leur organisation
CREATE POLICY "Users can create organization clients" ON public.clients
  FOR INSERT WITH CHECK (organization_id = get_user_organization_id());

-- Politique pour permettre aux utilisateurs de modifier les clients de leur organisation
CREATE POLICY "Users can update organization clients" ON public.clients
  FOR UPDATE USING (organization_id = get_user_organization_id());

-- Politique pour permettre aux utilisateurs de supprimer les clients de leur organisation
CREATE POLICY "Users can delete organization clients" ON public.clients
  FOR DELETE USING (organization_id = get_user_organization_id());
