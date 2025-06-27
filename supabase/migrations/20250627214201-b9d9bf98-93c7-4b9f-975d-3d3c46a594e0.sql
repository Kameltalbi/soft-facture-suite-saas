
-- Créer la table des catégories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(organization_id, name)
);

-- Activer RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les catégories
CREATE POLICY "Users can view their organization's categories"
  ON public.categories FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can insert categories in their organization"
  ON public.categories FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can update their organization's categories"
  ON public.categories FOR UPDATE
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can delete their organization's categories"
  ON public.categories FOR DELETE
  USING (organization_id = public.get_user_organization_id());

-- Index pour améliorer les performances
CREATE INDEX idx_categories_organization_id ON public.categories(organization_id);

-- Insérer quelques catégories par défaut pour chaque organisation existante
INSERT INTO public.categories (organization_id, name, description, color)
SELECT 
  o.id,
  category_name,
  category_description,
  category_color
FROM public.organizations o
CROSS JOIN (
  VALUES 
    ('Services', 'Services professionnels', '#10B981'),
    ('Informatique', 'Matériel et logiciels informatiques', '#3B82F6'),
    ('Formation', 'Formations et cours', '#8B5CF6'),
    ('Accessoires', 'Accessoires divers', '#F59E0B'),
    ('Logiciels', 'Licences et abonnements logiciels', '#EF4444'),
    ('Consultation', 'Services de consultation', '#06B6D4'),
    ('Design', 'Services de design et création', '#EC4899'),
    ('Marketing', 'Services marketing et communication', '#84CC16')
) AS default_categories(category_name, category_description, category_color);
