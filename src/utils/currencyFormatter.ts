
interface Currency {
  code: string;
  symbol: string;
  name: string;
  decimal_places?: number; // Rendre optionnel pour correspondre aux types utilisés
}

export const formatCurrency = (amount: number, currency: Currency): string => {
  const decimalPlaces = currency.decimal_places ?? 2; // Valeur par défaut si non définie
  return `${amount.toLocaleString('fr-FR', { 
    minimumFractionDigits: decimalPlaces, 
    maximumFractionDigits: decimalPlaces 
  })} ${currency.symbol}`;
};

// Fonction pour s'assurer qu'on utilise la bonne devise
export const ensureCurrency = (currency: Currency | null | undefined): Currency => {
  if (!currency) {
    // Valeurs par défaut si aucune devise n'est fournie
    return {
      code: 'EUR',
      symbol: '€',
      name: 'Euro',
      decimal_places: 2
    };
  }
  
  // S'assurer que decimal_places est défini
  return {
    ...currency,
    decimal_places: currency.decimal_places ?? 2
  };
};
