-- Supprimer l'utilisateur avec l'email nabil.kesraoui@findevadvisory.net
-- D'abord supprimer le profil associé s'il existe
DELETE FROM public.profiles 
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email = 'nabil.kesraoui@findevadvisory.net'
);

-- Ensuite supprimer l'utilisateur de auth.users
DELETE FROM auth.users 
WHERE email = 'nabil.kesraoui@findevadvisory.net';