interface ExchangeRate {
  id: string;
  from_currency_id: string;
  to_currency_id: string;
  rate: number;
}

interface Currency {
  id: string;
  code: string;
  symbol: string;
  name: string;
  decimal_places: number;
}

/**
 * Convertit un montant d'une devise vers une autre en utilisant les taux de change
 */
export const convertCurrency = (
  amount: number,
  fromCurrencyId: string,
  toCurrencyId: string,
  exchangeRates: ExchangeRate[]
): number => {
  // Si c'est la même devise, pas de conversion nécessaire
  if (fromCurrencyId === toCurrencyId) {
    return amount;
  }

  // Chercher un taux de change direct
  const directRate = exchangeRates.find(
    rate => rate.from_currency_id === fromCurrencyId && rate.to_currency_id === toCurrencyId
  );

  if (directRate) {
    return amount * directRate.rate;
  }

  // Chercher un taux de change inverse
  const inverseRate = exchangeRates.find(
    rate => rate.from_currency_id === toCurrencyId && rate.to_currency_id === fromCurrencyId
  );

  if (inverseRate) {
    return amount / inverseRate.rate;
  }

  // Si aucun taux trouvé, retourner le montant original avec un avertissement
  console.warn(`No exchange rate found between ${fromCurrencyId} and ${toCurrencyId}`);
  return amount;
};

/**
 * Convertit un montant vers la devise par défaut de l'organisation
 */
export const convertToDefaultCurrency = (
  amount: number,
  fromCurrencyId: string,
  defaultCurrencyId: string,
  exchangeRates: ExchangeRate[]
): number => {
  return convertCurrency(amount, fromCurrencyId, defaultCurrencyId, exchangeRates);
};

/**
 * Convertit plusieurs montants avec leurs devises vers la devise par défaut
 */
export const convertMultipleToDefaultCurrency = (
  amounts: Array<{ amount: number; currencyId: string }>,
  defaultCurrencyId: string,
  exchangeRates: ExchangeRate[]
): number => {
  return amounts.reduce((total, item) => {
    const convertedAmount = convertToDefaultCurrency(
      item.amount,
      item.currencyId,
      defaultCurrencyId,
      exchangeRates
    );
    return total + convertedAmount;
  }, 0);
};

/**
 * Formate un montant avec la devise appropriée
 */
export const formatCurrencyAmount = (
  amount: number,
  currency: Currency
): string => {
  return `${amount.toLocaleString('fr-FR', { 
    minimumFractionDigits: currency.decimal_places, 
    maximumFractionDigits: currency.decimal_places 
  })} ${currency.symbol}`;
};