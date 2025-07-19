
interface Currency {
  code: string;
  symbol: string;
  name: string;
  decimal_places: number;
}

export const formatCurrency = (amount: number, currency: Currency): string => {
  return `${amount.toLocaleString('fr-FR', { 
    minimumFractionDigits: currency.decimal_places, 
    maximumFractionDigits: currency.decimal_places 
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
  return currency;
};
