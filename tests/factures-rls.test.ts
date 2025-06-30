
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Variables de configuration - adaptez ces valeurs selon votre environnement
const supabaseUrl = 'YOUR_SUPABASE_URL'; // Remplacez par votre URL Supabase
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'; // Remplacez par votre clé anonyme
const userOrgAEmail = 'user-org-a@example.com'; // Email d'un utilisateur de l'organisation A
const userOrgAPassword = 'password123'; // Mot de passe de l'utilisateur
const organizationBId = 'uuid-de-org-B'; // UUID de l'organisation B (différente de celle de l'utilisateur)

describe('RLS Tests - Table invoices', () => {
  let supabase: SupabaseClient;
  let accessToken: string;

  beforeAll(async () => {
    // Initialiser le client Supabase
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  });

  describe('Vérification des règles RLS sur la table invoices', () => {
    it('devrait empêcher un utilisateur d\'accéder aux factures d\'une autre organisation', async () => {
      // Étape 1 : Se connecter avec l'utilisateur de l'organisation A
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: userOrgAEmail,
        password: userOrgAPassword,
      });

      expect(authError).toBeNull();
      expect(authData.user).not.toBeNull();
      expect(authData.session?.access_token).toBeDefined();

      accessToken = authData.session!.access_token;

      // Étape 2 : Créer un nouveau client avec le token d'authentification
      const authenticatedSupabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      });

      // Étape 3 : Tenter d'accéder aux factures de l'organisation B
      const { data: invoicesOrgB, error: invoicesError } = await authenticatedSupabase
        .from('invoices')
        .select('*')
        .eq('organization_id', organizationBId);

      // Étape 4 : Vérifier que le résultat est un tableau vide (RLS fonctionne)
      expect(invoicesError).toBeNull();
      expect(invoicesOrgB).toEqual([]);
      expect(Array.isArray(invoicesOrgB)).toBe(true);
      expect(invoicesOrgB.length).toBe(0);

      console.log('✅ RLS fonctionne : Aucune facture de l\'organisation B accessible');
    });

    it('devrait permettre à un utilisateur d\'accéder aux factures de sa propre organisation', async () => {
      // Utiliser le même token d'authentification
      const authenticatedSupabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      });

      // Récupérer les factures sans filtre d'organisation (doit retourner seulement celles de l'org A)
      const { data: ownInvoices, error: ownInvoicesError } = await authenticatedSupabase
        .from('invoices')
        .select('id, organization_id, invoice_number')
        .limit(10);

      expect(ownInvoicesError).toBeNull();
      expect(Array.isArray(ownInvoices)).toBe(true);

      // Si des factures existent, elles doivent toutes appartenir à l'organisation de l'utilisateur
      if (ownInvoices && ownInvoices.length > 0) {
        ownInvoices.forEach(invoice => {
          expect(invoice.organization_id).not.toBe(organizationBId);
        });
        console.log('✅ RLS fonctionne : Accès uniquement aux factures de sa propre organisation');
      } else {
        console.log('ℹ️  Aucune facture trouvée pour cet utilisateur');
      }
    });

    it('ne devrait pas permettre l\'accès sans authentification', async () => {
      // Client sans authentification
      const unauthenticatedSupabase = createClient(supabaseUrl, supabaseAnonKey);

      const { data: unauthInvoices, error: unauthError } = await unauthenticatedSupabase
        .from('invoices')
        .select('*')
        .limit(5);

      // Selon la configuration RLS, cela devrait soit échouer soit retourner un tableau vide
      if (unauthError) {
        expect(unauthError.message).toContain('access');
        console.log('✅ RLS fonctionne : Erreur d\'accès sans authentification');
      } else {
        expect(unauthInvoices).toEqual([]);
        console.log('✅ RLS fonctionne : Aucune donnée accessible sans authentification');
      }
    });
  });

  afterAll(async () => {
    // Nettoyer : se déconnecter
    if (supabase) {
      await supabase.auth.signOut();
    }
  });
});
