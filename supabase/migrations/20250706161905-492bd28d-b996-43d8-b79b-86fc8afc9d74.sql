-- Vérifier et recréer le trigger si nécessaire
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recréer le trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();