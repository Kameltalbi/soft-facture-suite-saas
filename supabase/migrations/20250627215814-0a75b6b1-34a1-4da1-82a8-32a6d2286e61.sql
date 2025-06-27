
-- Table pour les devises
CREATE TABLE public.currencies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  organization_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(code, organization_id)
);

-- Table pour les paramètres globaux (pied de page, templates PDF, etc.)
CREATE TABLE public.global_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  footer_content TEXT,
  footer_display TEXT DEFAULT 'all' CHECK (footer_display IN ('all', 'invoices_only', 'none')),
  primary_currency TEXT,
  invoice_template TEXT DEFAULT 'classic',
  quote_template TEXT DEFAULT 'classic',
  delivery_note_template TEXT DEFAULT 'classic',
  credit_template TEXT DEFAULT 'classic',
  organization_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(organization_id)
);

-- Table pour la numérotation des documents
CREATE TABLE public.document_numberings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_type TEXT NOT NULL CHECK (document_type IN ('invoice', 'quote', 'delivery_note', 'credit')),
  prefix TEXT NOT NULL,
  format TEXT NOT NULL DEFAULT 'incremental' CHECK (format IN ('incremental', 'yearly', 'monthly')),
  next_number INTEGER NOT NULL DEFAULT 1,
  reset_frequency TEXT NOT NULL DEFAULT 'never' CHECK (reset_frequency IN ('never', 'monthly', 'yearly')),
  organization_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(document_type, organization_id)
);

-- Table pour les rôles
CREATE TABLE public.roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  permissions JSONB NOT NULL DEFAULT '{}',
  organization_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(name, organization_id)
);

-- Ajouter des contraintes de clés étrangères
ALTER TABLE public.currencies ADD CONSTRAINT currencies_organization_id_fkey 
  FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.global_settings ADD CONSTRAINT global_settings_organization_id_fkey 
  FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.document_numberings ADD CONSTRAINT document_numberings_organization_id_fkey 
  FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.roles ADD CONSTRAINT roles_organization_id_fkey 
  FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Activer RLS sur toutes les tables
ALTER TABLE public.currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_numberings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour currencies
CREATE POLICY "Users can view organization currencies" ON public.currencies
  FOR SELECT USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can create organization currencies" ON public.currencies
  FOR INSERT WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can update organization currencies" ON public.currencies
  FOR UPDATE USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can delete organization currencies" ON public.currencies
  FOR DELETE USING (organization_id = get_user_organization_id());

-- Politiques RLS pour global_settings
CREATE POLICY "Users can view organization settings" ON public.global_settings
  FOR SELECT USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can create organization settings" ON public.global_settings
  FOR INSERT WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can update organization settings" ON public.global_settings
  FOR UPDATE USING (organization_id = get_user_organization_id());

-- Politiques RLS pour document_numberings
CREATE POLICY "Users can view organization numberings" ON public.document_numberings
  FOR SELECT USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can create organization numberings" ON public.document_numberings
  FOR INSERT WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can update organization numberings" ON public.document_numberings
  FOR UPDATE USING (organization_id = get_user_organization_id());

-- Politiques RLS pour roles
CREATE POLICY "Users can view organization roles" ON public.roles
  FOR SELECT USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can create organization roles" ON public.roles
  FOR INSERT WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can update organization roles" ON public.roles
  FOR UPDATE USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can delete organization roles" ON public.roles
  FOR DELETE USING (organization_id = get_user_organization_id());

-- Insérer des données par défaut pour la numérotation
INSERT INTO public.document_numberings (document_type, prefix, format, next_number, reset_frequency, organization_id)
SELECT 
  unnest(ARRAY['invoice', 'quote', 'delivery_note', 'credit']),
  unnest(ARRAY['FACT-', 'DEVIS-', 'BON-', 'AVOIR-']),
  'incremental',
  unnest(ARRAY[1001, 2001, 3001, 4001]),
  'yearly',
  id
FROM public.organizations;
