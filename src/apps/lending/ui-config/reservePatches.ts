import { CustomMarket } from "apps/lending/ui-config/marketsConfig";

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
  const currentMarket = localStorage.getItem("selectedMarket");
  const underlyingAssetMap: Record<string, IconMapInterface> =
    currentMarket === CustomMarket.proto_apothem_v3 ||
    currentMarket === CustomMarket.proto_mainnet_v3
      ? {
          "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee": {
            name: "XDC",
            symbol: "XDC",
            iconSymbol: "XDC",
          },
        }
      : {
          "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee": {
            name: "SepoliaETH",
            symbol: "ETH",
            iconSymbol: "ETH",
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
