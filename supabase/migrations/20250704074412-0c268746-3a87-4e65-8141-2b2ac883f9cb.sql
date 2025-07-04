-- Créer le trigger qui exécute handle_new_user à chaque création d'utilisateur
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();