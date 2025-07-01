
-- Créer la table pour les taxes personnalisées
CREATE TABLE public.custom_taxes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value NUMERIC NOT NULL,
  applicable_documents TEXT[] NOT NULL DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ajouter les politiques RLS
ALTER TABLE public.custom_taxes ENABLE ROW LEVEL SECURITY;

-- Politique pour visualiser les taxes de son organisation
CREATE POLICY "Users can view their organization's custom taxes"
  ON public.custom_taxes
  FOR SELECT
  USING (organization_id = get_user_organization_id());

-- Politique pour créer des taxes dans son organisation
CREATE POLICY "Users can create custom taxes in their organization"
  ON public.custom_taxes
  FOR INSERT
  WITH CHECK (organization_id = get_user_organization_id());

-- Politique pour modifier les taxes de son organisation
CREATE POLICY "Users can update their organization's custom taxes"
  ON public.custom_taxes
  FOR UPDATE
  USING (organization_id = get_user_organization_id());

-- Politique pour supprimer les taxes de son organisation
CREATE POLICY "Users can delete their organization's custom taxes"
  ON public.custom_taxes
  FOR DELETE
  USING (organization_id = get_user_organization_id());
