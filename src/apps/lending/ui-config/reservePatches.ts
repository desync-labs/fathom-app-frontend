export interface IconSymbolInterface {
  underlyingAsset: string;
  symbol: string;
  name: string;
}

interface IconMapInterface {
  iconSymbol: string;
  name?: string;
  symbol?: string;
}

export function fetchIconSymbolAndName({
  symbol,
  name,
  underlyingAsset,
}: IconSymbolInterface) {
  const underlyingAssetMap: Record<string, IconMapInterface> = {
    "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee": {
      name: "XDC",
      symbol: "XDC",
      iconSymbol: "XDC",
    },
  };

  const lowerUnderlyingAsset = underlyingAsset.toLowerCase();
  if (lowerUnderlyingAsset in underlyingAssetMap) {
    return {
      symbol,
      ...underlyingAssetMap[lowerUnderlyingAsset],
    };
  }

  return {
    iconSymbol: symbol,
    name,
    symbol,
  };
}
