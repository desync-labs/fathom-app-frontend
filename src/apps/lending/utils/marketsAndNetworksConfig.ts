import {
  ChainId,
  ChainIdToNetwork,
} from "@into-the-fathom/lending-contract-helpers";
import { StaticJsonRpcProvider } from "@into-the-fathom/providers";
import { providers as ethersProviders } from "fathom-ethers";

import {
  CustomMarket,
  MarketDataType,
  marketsData as _marketsData,
} from "apps/lending/ui-config/marketsConfig";
import {
  BaseNetworkConfig,
  ExplorerLinkBuilderConfig,
  ExplorerLinkBuilderProps,
  NetworkConfig,
  networkConfigs as _networkConfigs,
} from "apps/lending/ui-config/networksConfig";
import { RotationProvider } from "apps/lending/utils/rotationProvider";

export type Pool = {
  address: string;
};

export const DEV_ENV = process.env.REACT_APP_ENV === "dev";

/**
 * Generates network configs based on networkConfigs & fork settings.
 * Forks will have a rpcOnly clone of their underlying base network config.
 */
export const networkConfigs = Object.keys(_networkConfigs).reduce(
  (acc, value) => {
    acc[value] = _networkConfigs[value];
    return acc;
  },
  {} as { [key: string]: BaseNetworkConfig }
);

/**
 * Generates network configs based on marketsData & fork settings.
 * Fork markets are generated for all markets on the underlying base chain.
 */

export const marketsData = Object.keys(_marketsData).reduce((acc, value) => {
  acc[value] = _marketsData[value as keyof typeof CustomMarket];
  return acc;
}, {} as { [key: string]: MarketDataType });

export function getSupportedChainIds(): number[] {
  return Array.from(
    Object.keys(marketsData)
      .filter((value) => {
        const isTestnet =
          networkConfigs[
            marketsData[value as keyof typeof CustomMarket].chainId
          ].isTestnet;

        // If this is a staging environment, or the testnet toggle is on, only show testnets
        if (DEV_ENV) {
          return isTestnet;
        }

        return !isTestnet;
      })
      .reduce(
        (acc, value) =>
          acc.add(marketsData[value as keyof typeof CustomMarket].chainId),
        new Set<number>()
      )
  );
}

/**
 * selectable markets (markets in a available network + forks when enabled)
 */

export const availableMarkets = Object.keys(marketsData).filter((key) =>
  getSupportedChainIds().includes(
    marketsData[key as keyof typeof CustomMarket].chainId
  )
) as CustomMarket[];

const linkBuilder =
  ({
    baseUrl,
    addressPrefix = "address",
    txPrefix = "tx",
  }: ExplorerLinkBuilderConfig) =>
  ({ tx, address }: ExplorerLinkBuilderProps): string => {
    if (tx) {
      return `${baseUrl}/${txPrefix}/${tx}`;
    }
    if (address) {
      return `${baseUrl}/${addressPrefix}/${address}`;
    }
    return baseUrl;
  };

export function getNetworkConfig(chainId: ChainId): NetworkConfig {
  const config = networkConfigs[chainId];
  if (!config) {
    // this case can only ever occure when a wallet is connected with a unknown chainId which will not allow interaction
    const name = ChainIdToNetwork[chainId];
    return {
      name: name || `unknown chainId: ${chainId}`,
    } as unknown as NetworkConfig;
  }
  return {
    ...config,
    explorerLinkBuilder: linkBuilder({ baseUrl: config.explorerLink }),
  };
}

export const isFeatureEnabled = {
  faucet: (data: MarketDataType) => data.enabledFeatures?.faucet,
  permissions: (data: MarketDataType) => data.enabledFeatures?.permissions,
  addressBlocked: (data: MarketDataType) =>
    data.enabledFeatures?.addressBlocked,
  stableBorrowRate: (data: MarketDataType) =>
    data.enabledFeatures?.stableBorrowRate,
  /**
   * Paraswap features
   */
  liquiditySwap: (data: MarketDataType) => data.enabledFeatures?.liquiditySwap,
  collateralRepay: (data: MarketDataType) =>
    data.enabledFeatures?.collateralRepay,
  debtSwitch: (data: MarketDataType) => data.enabledFeatures?.debtSwitch,
  withdrawAndSwitch: (data: MarketDataType) =>
    data.enabledFeatures?.withdrawAndSwitch,
};

const providers: { [network: string]: ethersProviders.Provider } = {};

/**
 * Created a fallback rpc provider in which providers are prioritized from private to public and in case there are multiple public ones, from top to bottom.
 * @param chainId
 * @returns provider or fallbackprovider in case multiple rpcs are configured
 */
export const getProvider = (chainId: ChainId): ethersProviders.Provider => {
  if (!providers[chainId]) {
    const config = getNetworkConfig(chainId);
    const chainProviders: string[] = [];
    if (config.privateJsonRPCUrl) {
      chainProviders.push(config.privateJsonRPCUrl);
    }
    if (config.publicJsonRPCUrl.length) {
      config.publicJsonRPCUrl.map((rpc) => chainProviders.push(rpc));
    }
    if (!chainProviders.length) {
      throw new Error(`${chainId} has no jsonRPCUrl configured`);
    }
    if (chainProviders.length === 1) {
      providers[chainId] = new StaticJsonRpcProvider(
        chainProviders[0],
        chainId
      );
    } else {
      providers[chainId] = new RotationProvider(chainProviders, chainId);
    }
  }
  return providers[chainId];
};

export const getENSProvider = () => {
  const chainId = 1;
  const config = getNetworkConfig(chainId);
  return new StaticJsonRpcProvider(config.publicJsonRPCUrl[0], chainId);
};

// reexport so we can forbit config import
export { CustomMarket };
export type { MarketDataType, NetworkConfig };
