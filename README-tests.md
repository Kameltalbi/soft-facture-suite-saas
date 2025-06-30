
# Tests RLS pour Supabase

## Configuration requise

Avant d'exécuter les tests, vous devez :

1. **Installer les dépendances de test** (à faire manuellement) :
```bash
npm install --save-dev jest @types/jest ts-jest
```

2. **Configurer les variables dans le fichier de test** :
   - Ouvrez `tests/factures-rls.test.ts`
   - Remplacez les valeurs suivantes :
     - `supabaseUrl` : URL de votre projet Supabase
     - `supabaseAnonKey` : Clé publique anonyme de Supabase
     - `userOrgAEmail` : Email d'un utilisateur test de l'organisation A
     - `userOrgAPassword` : Mot de passe de cet utilisateur
     - `organizationBId` : UUID d'une organisation différente

3. **Créer des données de test** :
   - Assurez-vous d'avoir au moins un utilisateur dans l'organisation A
   - Créez quelques factures pour cet utilisateur/organisation
   - Créez une organisation B différente (pour tester l'isolation)

## Exécution des tests

```bash
# Exécuter tous les tests
npm test

# Exécuter spécifiquement les tests RLS
npm test factures-rls

# Exécuter avec couverture
npm test -- --coverage

# Exécuter en mode watch
npm test -- --watch
```

## Structure des tests

### Test 1 : Isolation entre organisations
- Se connecte avec un utilisateur de l'organisation A
- Tente d'accéder aux factures de l'organisation B
- Vérifie que le résultat est un tableau vide

### Test 2 : Accès aux données propres
- Vérifie que l'utilisateur peut accéder à ses propres factures
- Confirme que toutes les factures retournées appartiennent à sa organisation

### Test 3 : Accès sans authentification
- Teste l'accès à la table sans être connecté
- Vérifie que l'accès est refusé ou retourne un tableau vide

## Résultats attendus

✅ **Succès** : Les règles RLS fonctionnent correctement
- Aucune fuite de données entre organisations
- Accès limité aux données de sa propre organisation
- Accès refusé sans authentification

❌ **Échec** : Les règles RLS ont besoin d'ajustements
- Vérifiez la configuration RLS dans Supabase
- Assurez-vous que les politiques sont activées
- Vérifiez la fonction `get_user_organization_id()`

## Dépannage

1. **Erreur de connexion** : Vérifiez les URL et clés Supabase
2. **Timeout** : Augmentez `jest.setTimeout()` dans setup.ts
3. **Données manquantes** : Créez des données de test dans Supabase
4. **RLS désactivé** : Activez RLS sur la table `invoices` dans Supabase

## Personnalisation

Vous pouvez adapter ce test pour d'autres tables en :
1. Copiant le fichier de test
2. Remplaçant `invoices` par le nom de votre table
3. Ajustant les champs testés
4. Modifiant l'ID d'organisation selon vos besoins
