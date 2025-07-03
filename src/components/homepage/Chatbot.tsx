import { useEffect } from 'react';

interface ChatbotProps {
  tawkToId?: string;
}

export function Chatbot({ tawkToId = "6866b94319aaf4190bd9fb13" }: ChatbotProps) {
  useEffect(() => {
    // Ne charger le script que si nous avons un ID valide
    if (!tawkToId) {
      console.warn("Tawk.to ID not provided. Please add your Tawk.to ID.");
      return;
    }

    // Vérifier si le script n'est pas déjà chargé
    if (document.getElementById('tawk-script')) {
      return;
    }

    // Créer et injecter le script Tawk.to
    const script = document.createElement('script');
    script.id = 'tawk-script';
    script.async = true;
    script.src = 'https://embed.tawk.to/' + tawkToId + '/default';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    // Ajouter le script au head
    document.head.appendChild(script);

    // Cleanup function pour supprimer le script quand le composant est démonté
    return () => {
      const existingScript = document.getElementById('tawk-script');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
      
      // Supprimer l'objet Tawk_API global s'il existe
      if (window.Tawk_API) {
        window.Tawk_API = undefined;
      }
    };
  }, [tawkToId]);

  return null; // Ce composant ne rend rien visuellement
}

// Extend window object pour TypeScript
declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}