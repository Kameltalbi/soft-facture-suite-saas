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