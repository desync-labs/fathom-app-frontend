
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const formatNumber = (number: number) => {
  return formatter
    .formatToParts(number)
    .map((p) =>
      p.type !== "literal" && p.type !== "currency" ? p.value : ""
    )
    .join("");
}

export const formatCurrency = (number: number) => {
  return formatter.format(number);
}