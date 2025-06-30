
# Tests pour le Dashboard

## Installation des dépendances de test

Pour exécuter les tests, vous devez d'abord installer les dépendances nécessaires :

```bash
npm install --save-dev jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

## Exécution des tests

```bash
# Exécuter tous les tests
npm test

# Exécuter les tests avec couverture
npm test -- --coverage

# Exécuter les tests en mode watch
npm test -- --watch
```

## Tests créés

### `useDashboardData.test.ts`
- **Test d'initialisation** : Vérifie que le hook s'initialise avec les bonnes valeurs par défaut
- **Test sans organisation** : Vérifie qu'aucune requête n'est faite si l'utilisateur n'a pas d'organisation
- **Test de traitement des données** : Vérifie que les données de factures sont correctement traitées et calculées
- **Test de gestion d'erreurs** : Vérifie que les erreurs sont gérées gracieusement
- **Test de mise à jour** : Vérifie que les données sont rechargées quand l'année change

## Structure des tests

Les tests utilisent :
- **Jest** pour l'exécution des tests
- **React Testing Library** pour le rendu des hooks
- **Mocks** pour simuler les appels à Supabase et les hooks d'authentification

## Couverture des tests

Les tests couvrent :
- ✅ Initialisation du hook
- ✅ Gestion des états de chargement
- ✅ Calcul des KPIs (revenus, factures, clients actifs, etc.)
- ✅ Traitement des données pour les graphiques
- ✅ Gestion des erreurs
- ✅ Mise à jour lors du changement d'année

## Exécution des tests RLS

Les tests RLS créés précédemment sont dans le dossier `tests/` et nécessitent une connexion à Supabase réelle pour vérifier les politiques de sécurité.
