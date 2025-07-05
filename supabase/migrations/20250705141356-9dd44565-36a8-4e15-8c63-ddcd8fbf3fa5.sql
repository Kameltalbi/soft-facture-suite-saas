-- Ajouter une politique RLS pour permettre l'insertion de profils lors de la création d'utilisateurs
CREATE POLICY "Allow profile creation during user signup"
ON public.profiles
FOR INSERT
WITH CHECK (true);

-- Mettre à jour la fonction handle_new_user pour s'assurer qu'elle fonctionne correctement
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  org_id UUID;
BEGIN
  -- Créer une nouvelle organisation avec statut "pending" par défaut
  INSERT INTO public.organizations (
    name, 
    address, 
    email, 
    phone, 
    website, 
    vat_number,
    status,
    plan,
    subscription_start,
    subscription_end
  )
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'organization_name', 'Mon Organisation'),
    NEW.raw_user_meta_data->>'organization_address',
    NEW.raw_user_meta_data->>'organization_email',
    NEW.raw_user_meta_data->>'organization_phone',
    NEW.raw_user_meta_data->>'organization_website',
    NEW.raw_user_meta_data->>'organization_vat_number',
    'pending',  -- Statut en attente par défaut
    COALESCE(NEW.raw_user_meta_data->>'plan', 'essential'),  -- Plan choisi
    NULL,  -- subscription_start sera défini quand l'admin valide
    NULL   -- subscription_end sera défini quand l'admin valide
  )
  RETURNING id INTO org_id;

  -- Créer le profil utilisateur avec l'email
  INSERT INTO public.profiles (
    user_id, 
    organization_id, 
    first_name, 
    last_name, 
    email,
    role
  )
  VALUES (
    NEW.id,
    org_id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email,  -- Utiliser l'email du NEW record
    'admin' -- Le premier utilisateur devient admin de son organisation
  );

  RETURN NEW;
END;
$$;