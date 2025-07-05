-- Modifier la fonction handle_new_user pour gérer les utilisateurs ajoutés à une organisation existante
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  org_id UUID;
  existing_org_id UUID;
BEGIN
  -- Vérifier si un organization_id est fourni dans les métadonnées (utilisateur ajouté par un admin)
  existing_org_id := (NEW.raw_user_meta_data->>'organization_id')::UUID;
  
  IF existing_org_id IS NOT NULL THEN
    -- Utilisateur ajouté à une organisation existante
    org_id := existing_org_id;
  ELSE
    -- Nouvel utilisateur qui s'inscrit - créer une nouvelle organisation
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
  END IF;

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
    COALESCE(NEW.raw_user_meta_data->>'role', 'admin') -- Rôle fourni ou admin par défaut
  );

  RETURN NEW;
END;
$$;