
// Configuration globale pour les tests Jest avec Supabase

// Mock de fetch si nécessaire pour Node.js
import { TextEncoder, TextDecoder } from 'util';

// Polyfills pour Node.js
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Configuration des timeouts pour les tests asynchrones
jest.setTimeout(10000); // 10 secondes

// Mock console pour les tests si nécessaire
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  // Réinitialiser les mocks avant chaque test
  jest.clearAllMocks();
});

afterAll(() => {
  // Restaurer les console originales
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Export des utilitaires de test si nécessaire
export const testUtils = {
  // Fonction helper pour attendre un délai
  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Fonction helper pour générer des UUIDs de test
  generateTestUUID: () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
};
