-- Désactiver temporairement le trigger de vérification des limites
ALTER TABLE profiles DISABLE TRIGGER check_user_limit;

-- Créer les organisations et profils manquants pour les utilisateurs existants
DO $$
DECLARE
  user_record RECORD;
  org_id UUID;
BEGIN
  -- Boucle sur tous les utilisateurs qui n'ont pas de profil
  FOR user_record IN 
    SELECT u.id, u.raw_user_meta_data
    FROM auth.users u
    LEFT JOIN profiles p ON u.id = p.user_id
    WHERE p.user_id IS NULL
  LOOP
    -- Créer l'organisation
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
      COALESCE(user_record.raw_user_meta_data->>'organization_name', 'Mon Organisation'),
      user_record.raw_user_meta_data->>'organization_address',
      user_record.raw_user_meta_data->>'organization_email',
      user_record.raw_user_meta_data->>'organization_phone',
      user_record.raw_user_meta_data->>'organization_website',
      user_record.raw_user_meta_data->>'organization_vat_number',
      'pending',  -- Statut en attente par défaut pour les nouvelles organisations
      COALESCE(user_record.raw_user_meta_data->>'plan', 'essential'),
      NULL,
      NULL
    )
    RETURNING id INTO org_id;

    -- Créer le profil utilisateur
    INSERT INTO public.profiles (user_id, organization_id, first_name, last_name, role)
    VALUES (
      user_record.id,
      org_id,
      user_record.raw_user_meta_data->>'first_name',
      user_record.raw_user_meta_data->>'last_name',
      'admin'
    );

    RAISE NOTICE 'Créé organisation % pour utilisateur %', org_id, user_record.id;
  END LOOP;
END $$;

-- Réactiver le trigger
ALTER TABLE profiles ENABLE TRIGGER check_user_limit;