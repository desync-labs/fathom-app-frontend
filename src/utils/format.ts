const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const formatterPrice = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 4,
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

export const formatNumberPrice = (number: number) => {
  return formatterPrice
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
  return formatterPrice.format(number);
};

export const formatHashShorten = (hash: string) => {
  if (!hash || hash.length <= 8) {
    return hash;
  }

  const prefix = hash.slice(0, 4);
  const suffix = hash.slice(-4);

  return `${prefix}...${suffix}`;
};
