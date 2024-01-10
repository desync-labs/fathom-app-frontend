import { ChainId } from "@aave/contract-helpers";
import { AaveV3Ethereum, AaveV3Sepolia } from "@bgd-labs/aave-address-book";
import { FathomLendingApothem } from "@into-the-fathom/fathom-lending-address-book";
import { ReactNode } from "react";

// Enable for premissioned market
// import { PermissionView } from 'src/components/transactions/FlowCommons/PermissionView';
export type MarketDataType = {
  v3?: boolean;
  marketTitle: string;
  // the network the market operates on
  chainId: ChainId | number;
  enabledFeatures?: {
    liquiditySwap?: boolean;
    faucet?: boolean;
    collateralRepay?: boolean;
    incentives?: boolean;
    permissions?: boolean;
    debtSwitch?: boolean;
    withdrawAndSwitch?: boolean;
  };
  isFork?: boolean;
  permissionComponent?: ReactNode;
  disableCharts?: boolean;
  subgraphUrl?: string;
  addresses: {
    LENDING_POOL_ADDRESS_PROVIDER: string;
    LENDING_POOL: string;
    WETH_GATEWAY?: string;
    SWAP_COLLATERAL_ADAPTER?: string;
    REPAY_WITH_COLLATERAL_ADAPTER?: string;
    DEBT_SWITCH_ADAPTER?: string;
    WITHDRAW_SWITCH_ADAPTER?: string;
    FAUCET?: string;
    PERMISSION_MANAGER?: string;
    WALLET_BALANCE_PROVIDER: string;
    L2_ENCODER?: string;
    UI_POOL_DATA_PROVIDER: string;
    UI_INCENTIVE_DATA_PROVIDER?: string;
    COLLECTOR?: string;
    V3_MIGRATOR?: string;
  };
  /**
   * https://www.hal.xyz/ has integrated aave for healtfactor warning notification
   * the integration doesn't follow aave market naming & only supports a subset of markets.
   * When a halIntegration is specified a link to hal will be displayed on the ui.
   */
  halIntegration?: {
    URL: string;
    marketName: string;
  };
};

export enum CustomMarket {
  // v3 test networks, all v3.0.1
  proto_apothem_v3 = "proto_apothem_v3",
  proto_sepolia_v3 = "proto_sepolia_v3",
  // v3 mainnets
  proto_mainnet_v3 = "proto_mainnet_v3",
}

export const marketsData: {
  [key in keyof typeof CustomMarket]: MarketDataType;
} = {
  [CustomMarket.proto_apothem_v3]: {
    marketTitle: "XDC Apothem",
    v3: true,
    chainId: FathomLendingApothem.CHAIN_ID,
    enabledFeatures: {
      faucet: false,
      incentives: true,
    },
    subgraphUrl: "https://dev.fathom.fi/subgraphs/name/lending-subgraph",
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER:
        FathomLendingApothem.POOL_ADDRESSES_PROVIDER,
      LENDING_POOL: FathomLendingApothem.POOL,
      WETH_GATEWAY: FathomLendingApothem.WETH_GATEWAY,
      WALLET_BALANCE_PROVIDER: FathomLendingApothem.WALLET_BALANCE_PROVIDER,
      UI_POOL_DATA_PROVIDER: FathomLendingApothem.UI_POOL_DATA_PROVIDER,
      UI_INCENTIVE_DATA_PROVIDER:
        FathomLendingApothem.UI_INCENTIVE_DATA_PROVIDER,
      COLLECTOR: FathomLendingApothem.COLLECTOR,
    },
  },
  [CustomMarket.proto_mainnet_v3]: {
    marketTitle: "Ethereum",
    chainId: ChainId.mainnet,
    v3: true,
    enabledFeatures: {
      liquiditySwap: true,
      collateralRepay: true,
      incentives: true,
      withdrawAndSwitch: true,
      debtSwitch: true,
    },
    subgraphUrl: "https://api.thegraph.com/subgraphs/name/aave/protocol-v3",
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
      LENDING_POOL: AaveV3Ethereum.POOL,
      WETH_GATEWAY: AaveV3Ethereum.WETH_GATEWAY,
      REPAY_WITH_COLLATERAL_ADAPTER:
        AaveV3Ethereum.REPAY_WITH_COLLATERAL_ADAPTER,
      SWAP_COLLATERAL_ADAPTER: AaveV3Ethereum.SWAP_COLLATERAL_ADAPTER,
      WALLET_BALANCE_PROVIDER: AaveV3Ethereum.WALLET_BALANCE_PROVIDER,
      UI_POOL_DATA_PROVIDER: AaveV3Ethereum.UI_POOL_DATA_PROVIDER,
      UI_INCENTIVE_DATA_PROVIDER: AaveV3Ethereum.UI_INCENTIVE_DATA_PROVIDER,
      COLLECTOR: AaveV3Ethereum.COLLECTOR,
      WITHDRAW_SWITCH_ADAPTER: AaveV3Ethereum.WITHDRAW_SWAP_ADAPTER,
      DEBT_SWITCH_ADAPTER: AaveV3Ethereum.DEBT_SWAP_ADAPTER,
    },
    halIntegration: {
      URL: "https://app.hal.xyz/recipes/aave-v3-track-health-factor",
      marketName: "aavev3",
    },
  },
  [CustomMarket.proto_sepolia_v3]: {
    marketTitle: "Ethereum Sepolia",
    v3: true,
    chainId: ChainId.sepolia,
    enabledFeatures: {
      faucet: true,
    },
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: AaveV3Sepolia.POOL_ADDRESSES_PROVIDER,
      LENDING_POOL: AaveV3Sepolia.POOL,
      WETH_GATEWAY: AaveV3Sepolia.WETH_GATEWAY,
      FAUCET: AaveV3Sepolia.FAUCET,
      WALLET_BALANCE_PROVIDER: AaveV3Sepolia.WALLET_BALANCE_PROVIDER,
      UI_POOL_DATA_PROVIDER: AaveV3Sepolia.UI_POOL_DATA_PROVIDER,
      UI_INCENTIVE_DATA_PROVIDER: AaveV3Sepolia.UI_INCENTIVE_DATA_PROVIDER,
    },
  },
} as const;
