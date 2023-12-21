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
