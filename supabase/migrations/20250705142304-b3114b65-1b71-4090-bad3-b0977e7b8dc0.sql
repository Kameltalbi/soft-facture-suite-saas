-- Corriger le profil d'Aymen pour qu'il soit dans la bonne organisation
UPDATE public.profiles 
SET organization_id = 'e93015be-cfc6-4a1d-9b6b-06e9bc554bb5',
    email = 'aymen.boubakri@gmail.com',
    role = 'user'
WHERE user_id = '7faeaa75-8a01-4b7a-b7bc-5c6b2546a34e';

-- Supprimer l'organisation créée par erreur (si elle n'a plus d'utilisateurs)
DELETE FROM public.organizations 
WHERE id = '4090df1f-6eb1-453d-b935-ca647d0d497f' 
AND NOT EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE organization_id = '4090df1f-6eb1-453d-b935-ca647d0d497f'
);