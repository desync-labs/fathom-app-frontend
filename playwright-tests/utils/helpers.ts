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
