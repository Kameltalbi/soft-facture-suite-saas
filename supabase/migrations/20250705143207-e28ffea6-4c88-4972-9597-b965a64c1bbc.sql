-- Corriger la fonction handle_new_user pour mieux gérer l'ajout d'un utilisateur à une organisation existante
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  org_id UUID;
  existing_org_id TEXT;
BEGIN
  -- Récupérer l'organization_id depuis les métadonnées
  existing_org_id := NEW.raw_user_meta_data->>'organization_id';
  
  -- Debug logging
  RAISE LOG 'handle_new_user: user_id=%, email=%, existing_org_id=%, metadata=%', 
    NEW.id, NEW.email, existing_org_id, NEW.raw_user_meta_data::text;
  
  -- Si un organization_id est fourni, l'utilisateur est ajouté par un admin
  IF existing_org_id IS NOT NULL AND existing_org_id != '' THEN
    BEGIN
      -- Convertir en UUID et vérifier que l'organisation existe
      org_id := existing_org_id::UUID;
      
      -- Vérifier que l'organisation existe
      IF NOT EXISTS (SELECT 1 FROM public.organizations WHERE id = org_id) THEN
        RAISE EXCEPTION 'Organisation non trouvée: %', org_id;
      END IF;
      
      RAISE LOG 'Ajout d''utilisateur à l''organisation existante: %', org_id;
    EXCEPTION WHEN OTHERS THEN
      RAISE LOG 'Erreur lors de la conversion organization_id: %, erreur: %', existing_org_id, SQLERRM;
      RAISE EXCEPTION 'ID d''organisation invalide: %', existing_org_id;
    END;
  ELSE
    -- Nouvel utilisateur qui s'inscrit - créer une nouvelle organisation
    RAISE LOG 'Création d''une nouvelle organisation pour l''utilisateur: %', NEW.id;
    
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
      'pending',
      COALESCE(NEW.raw_user_meta_data->>'plan', 'essential'),
      NULL,
      NULL
    )
    RETURNING id INTO org_id;
    
    RAISE LOG 'Nouvelle organisation créée: %', org_id;
  END IF;

  -- Créer le profil utilisateur
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
    NEW.email,
    CASE 
      WHEN existing_org_id IS NOT NULL AND existing_org_id != '' THEN 
        COALESCE(NEW.raw_user_meta_data->>'role', 'user')
      ELSE 'admin' 
    END
  );
  
  RAISE LOG 'Profil créé pour l''utilisateur: % dans l''organisation: %', NEW.id, org_id;

  RETURN NEW;
END;
$$;