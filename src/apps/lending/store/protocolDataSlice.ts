import { providers, utils } from "fathom-ethers";
import { APOTHEM_ADDRESSES, SEPOLIA_ADDRESSES } from "fathom-sdk";
import { permitByChainAndToken } from "apps/lending/ui-config/permitConfig";
import {
  availableMarkets,
  getNetworkConfig,
  getProvider,
  marketsData,
} from "apps/lending/utils/marketsAndNetworksConfig";
import { StateCreator } from "zustand";

import {
  CustomMarket,
  MarketDataType,
} from "apps/lending/ui-config/marketsConfig";
import { NetworkConfig } from "apps/lending/ui-config/networksConfig";
import { RootStore } from "apps/lending/store/root";

type TypePermitParams = {
  reserveAddress: string;
  isWrappedBaseAsset: boolean;
};

export interface ProtocolDataSlice {
  currentMarket: CustomMarket;
  currentMarketData: MarketDataType;
  currentChainId: number;
  currentNetworkConfig: NetworkConfig;
  jsonRpcProvider: () => providers.Provider;
  setCurrentMarket: (
    market: CustomMarket,
    omitQueryParameterUpdate?: boolean
  ) => void;
  tryPermit: ({
    reserveAddress,
    isWrappedBaseAsset,
  }: TypePermitParams) => boolean;
}

export const createProtocolDataSlice: StateCreator<
  RootStore,
  [["zustand/subscribeWithSelector", never], ["zustand/devtools", never]],
  [],
  ProtocolDataSlice
> = (set, get) => {
  const initialMarket = availableMarkets[0];
  const initialMarketData = marketsData[initialMarket];
  localStorage.setItem("selectedMarket", initialMarket);
  return {
    currentMarket: initialMarket,
    currentMarketData: marketsData[initialMarket],
    currentChainId: initialMarketData.chainId,
    currentNetworkConfig: getNetworkConfig(initialMarketData.chainId),
    jsonRpcProvider: () => getProvider(get().currentChainId),
    setCurrentMarket: (market) => {
      if (!availableMarkets.includes(market as CustomMarket)) return;
      const nextMarketData = marketsData[market];
      localStorage.setItem("selectedMarket", market);
      set({
        currentMarket: market,
        currentMarketData: nextMarketData,
        currentChainId: nextMarketData.chainId,
        currentNetworkConfig: getNetworkConfig(nextMarketData.chainId),
      });
    },
    tryPermit: ({ reserveAddress, isWrappedBaseAsset }: TypePermitParams) => {
      const currentNetworkConfig = get().currentNetworkConfig;
      const currentMarketData = get().currentMarketData;
      // current chain id, or underlying chain id for fork networks
      const underlyingChainId = currentNetworkConfig.isFork
        ? currentNetworkConfig.underlyingChainId
        : currentMarketData.chainId;
      // enable permit for all v3 test network assets (except WrappedBaseAssets) or v3 production assets included in permitConfig)
      const testnetPermitEnabled = Boolean(
        currentNetworkConfig.isTestnet &&
          !isWrappedBaseAsset &&
          reserveAddress !== APOTHEM_ADDRESSES.FXD.toLowerCase() &&
          reserveAddress !== APOTHEM_ADDRESSES.xUSDT.toLowerCase() &&
          reserveAddress !== APOTHEM_ADDRESSES.FTHM_TOKEN.toLowerCase() &&
          reserveAddress !== SEPOLIA_ADDRESSES.FXD.toLowerCase() &&
          reserveAddress !== SEPOLIA_ADDRESSES.xUSDT.toLowerCase()
      );
      const productionPermitEnabled = Boolean(
        underlyingChainId &&
          permitByChainAndToken[underlyingChainId]?.[
            utils.getAddress(reserveAddress).toLowerCase()
          ]
      );
      return testnetPermitEnabled || productionPermitEnabled;
    },
  };
};
