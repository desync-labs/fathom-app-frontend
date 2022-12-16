const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const formatterCompact = new Intl.NumberFormat("en", { notation: "compact" });

const formatterPercentage = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 6,
});

export const formatNumber = (number: number) => {
  return formatter
    .formatToParts(number)
    .map((p) => (p.type !== "literal" && p.type !== "currency" ? p.value : ""))
    .join("");
};

export const formatCompact = (number: number) => {
  return formatterCompact.format(number);
};

export const formatPercentage = (number: number) => {
  return formatterPercentage
    .formatToParts(number)
    .map((p) => (p.type !== "literal" && p.type !== "currency" ? p.value : ""))
    .join("");
};

export const formatCurrency = (number: number) => {
  return formatter.format(number);
};
