-- Supprimer et recréer le trigger pour s'assurer qu'il fonctionne
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recréer le trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();