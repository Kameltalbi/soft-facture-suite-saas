
import '@testing-library/jest-dom';

// Configuration globale pour les tests
global.console = {
  ...console,
  // Masquer les logs de test sauf les erreurs
  log: jest.fn(),
  warn: jest.fn(),
  error: console.error,
};

// Mock de window.location si nécessaire
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
  },
  writable: true,
});
