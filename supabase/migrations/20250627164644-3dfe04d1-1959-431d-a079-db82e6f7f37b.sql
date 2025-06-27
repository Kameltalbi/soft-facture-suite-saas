
-- Créer la table des organisations
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Créer la table des profils utilisateurs
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'editor', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, organization_id)
);

-- Activer RLS sur les deux tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Créer une fonction sécurisée pour obtenir l'organization_id de l'utilisateur connecté
CREATE OR REPLACE FUNCTION public.get_user_organization_id()
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT organization_id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Policies pour la table organizations
CREATE POLICY "Users can view their organization"
  ON public.organizations
  FOR SELECT
  USING (id = public.get_user_organization_id());

CREATE POLICY "Admins can update their organization"
  ON public.organizations
  FOR UPDATE
  USING (
    id = public.get_user_organization_id()
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND organization_id = public.get_user_organization_id()
      AND role = 'admin'
    )
  );

-- Policies pour la table profiles
CREATE POLICY "Users can view profiles in their organization"
  ON public.profiles
  FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Admins can update profiles in their organization"
  ON public.profiles
  FOR UPDATE
  USING (
    organization_id = public.get_user_organization_id()
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND organization_id = public.get_user_organization_id()
      AND role = 'admin'
    )
  );

-- Trigger pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  org_id UUID;
BEGIN
  -- Pour le moment, créer une nouvelle organisation pour chaque nouvel utilisateur
  -- En production, vous pourrez modifier cette logique selon vos besoins
  INSERT INTO public.organizations (name)
  VALUES (COALESCE(NEW.raw_user_meta_data->>'organization_name', 'Mon Organisation'))
  RETURNING id INTO org_id;

  -- Créer le profil utilisateur
  INSERT INTO public.profiles (user_id, organization_id, first_name, last_name, role)
  VALUES (
    NEW.id,
    org_id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    'admin' -- Le premier utilisateur devient admin de son organisation
  );

  RETURN NEW;
END;
$$;

-- Créer le trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
