
export function numberToWords(num: number): string {
  if (num === 0) return 'zéro euro';

  const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
  const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];

  function convertHundreds(n: number): string {
    let result = '';

    if (n >= 100) {
      const hundreds = Math.floor(n / 100);
      if (hundreds === 1) {
        result += 'cent';
      } else {
        result += units[hundreds] + ' cent';
      }
      if (n % 100 !== 0) {
        result += ' ';
      }
      n %= 100;
    }

    if (n >= 20) {
      const tensDigit = Math.floor(n / 10);
      const unitsDigit = n % 10;
      
      if (tensDigit === 7) {
        result += 'soixante';
        if (unitsDigit >= 10) {
          result += '-' + teens[unitsDigit - 10];
        } else if (unitsDigit > 0) {
          result += '-' + units[unitsDigit];
        }
      } else if (tensDigit === 9) {
        result += 'quatre-vingt';
        if (unitsDigit >= 10) {
          result += '-' + teens[unitsDigit - 10];
        } else if (unitsDigit > 0) {
          result += '-' + units[unitsDigit];
        }
      } else {
        result += tens[tensDigit];
        if (unitsDigit > 0) {
          result += '-' + units[unitsDigit];
        }
      }
    } else if (n >= 10) {
      result += teens[n - 10];
    } else if (n > 0) {
      result += units[n];
    }

    return result;
  }

  const euros = Math.floor(num);
  const cents = Math.round((num - euros) * 100);

  let result = '';

  if (euros >= 1000000) {
    const millions = Math.floor(euros / 1000000);
    result += convertHundreds(millions);
    if (millions === 1) {
      result += ' million';
    } else {
      result += ' millions';
    }
    
    const remainder = euros % 1000000;
    if (remainder > 0) {
      result += ' ';
      if (remainder >= 1000) {
        const thousands = Math.floor(remainder / 1000);
        result += convertHundreds(thousands) + ' mille ';
        const lastPart = remainder % 1000;
        if (lastPart > 0) {
          result += convertHundreds(lastPart);
        }
      } else {
        result += convertHundreds(remainder);
      }
    }
  } else if (euros >= 1000) {
    const thousands = Math.floor(euros / 1000);
    if (thousands === 1) {
      result += 'mille';
    } else {
      result += convertHundreds(thousands) + ' mille';
    }
    
    const remainder = euros % 1000;
    if (remainder > 0) {
      result += ' ' + convertHundreds(remainder);
    }
  } else {
    result += convertHundreds(euros);
  }

  if (euros === 1) {
    result += ' euro';
  } else {
    result += ' euros';
  }

  if (cents > 0) {
    result += ' et ' + convertHundreds(cents);
    if (cents === 1) {
      result += ' centime';
    } else {
      result += ' centimes';
    }
  }

  return result.charAt(0).toUpperCase() + result.slice(1);
}
