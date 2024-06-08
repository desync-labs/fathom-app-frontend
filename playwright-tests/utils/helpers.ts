import BigNumber from "bignumber.js";

export function extractNumericValue(inputString: string): number | null {
  const match = inputString.match(/(\d{1,3}(,\d{3})*(\.\d+)?|\.\d+|\d+)%?/);

  if (match) {
    const numericPart = match[0];

    const numericValue = parseFloat(numericPart.replace(/,/g, ""));

    return numericValue;
  } else {
    return null;
  }
}

export function extractNumericValueDex(inputString: string): number | null {
  const match = inputString.match(/(\d+(?:\.\d+)?)/);

  if (match) {
    const numericPart = match[0];

    const numericValue = parseFloat(numericPart.replace(/,/g, ""));

    return numericValue;
  } else {
    return null;
  }
}

function countDecimals(number: number): number {
  if (Math.floor(number) === number) return 0;
  return number.toString().split(".")[1]?.length || 0;
}

export function transformToSameDecimals(
  originalNumber: number,
  targetNumber: number
): number {
  const decimalPlaces = countDecimals(originalNumber);

  const transformedNumber = parseFloat(targetNumber.toFixed(decimalPlaces));

  return transformedNumber;
}

export function formatNumberToFixedLength(
  numberString: string,
  maxDigitsAfterDecimal = 16
) {
  numberString = numberString.toString();

  const decimalPointIndex = numberString.indexOf(".");

  if (decimalPointIndex === -1) {
    return numberString;
  }

  const digitsAfterDecimal = numberString.length - decimalPointIndex - 1;

  if (digitsAfterDecimal <= maxDigitsAfterDecimal) {
    return numberString;
  }

  const targetLength = decimalPointIndex + 1 + maxDigitsAfterDecimal;
  return numberString.slice(0, targetLength);
}

export function extractTransactionHash(url: string): string | null {
  const regex = /\/txs\/(0x[a-fA-F0-9]+)/;
  const match = url.match(regex);

  if (match) {
    return match[1];
  } else {
    return null;
  }
}

export function formatNumberDexSuccessPopup(
  input: number,
  significantDigits = 3
): string {
  const bn = new BigNumber(input);

  BigNumber.config({
    DECIMAL_PLACES: significantDigits,
    ROUNDING_MODE: BigNumber.ROUND_DOWN,
  });

  const formatted = bn.toPrecision(significantDigits, BigNumber.ROUND_DOWN);

  return formatted;
}
