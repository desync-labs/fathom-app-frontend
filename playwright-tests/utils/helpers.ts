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
  // Convert number to string in case it's not already a string
  numberString = numberString.toString();

  // Find the decimal point position
  const decimalPointIndex = numberString.indexOf(".");

  // If there is no decimal point, return the number as is
  if (decimalPointIndex === -1) {
    return numberString;
  }

  // Calculate the number of digits after the decimal point
  const digitsAfterDecimal = numberString.length - decimalPointIndex - 1;

  // If the number of digits after the decimal is within the limit, return the number as is
  if (digitsAfterDecimal <= maxDigitsAfterDecimal) {
    return numberString;
  }

  // Otherwise, trim the number to the desired length
  const targetLength = decimalPointIndex + 1 + maxDigitsAfterDecimal;
  return numberString.slice(0, targetLength);
}

export function extractTransactionHash(url: string): string | null {
  // Regular expression to match a transaction hash in the URL
  const regex = /\/txs\/(0x[a-fA-F0-9]+)/;
  const match = url.match(regex);

  if (match) {
    return match[1]; // Return the captured group, which is the transaction hash
  } else {
    return null; // Return null if no match is found
  }
}
