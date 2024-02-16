export interface IconSymbolInterface {
  underlyingAsset: string;
  symbol: string;
  name: string;
}

export function fetchIconSymbolAndName({ symbol, name }: IconSymbolInterface) {
  return {
    iconSymbol: symbol,
    name,
    symbol,
  };
}
