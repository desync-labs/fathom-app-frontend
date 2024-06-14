import {
  FathomLendingApothem,
  FathomLendingXdc,
  FathomLendingSepolia,
} from "@into-the-fathom/fathom-lending-address-book";

export type ExplorerLinkBuilderProps = {
  tx?: string;
  address?: string;
};

export type ExplorerLinkBuilderConfig = {
  baseUrl: string;
  addressPrefix?: string;
  txPrefix?: string;
};

export type NetworkConfig = {
  name: string;
  privateJsonRPCUrl?: string; // private rpc will be used for rpc queries inside the client. normally has private api key and better rate
  privateJsonRPCWSUrl?: string;
  publicJsonRPCUrl: readonly string[]; // public rpc used if not private found, and used to add specific network to wallets if user don't have them. Normally with slow rates
  publicJsonRPCWSUrl?: string;
  // protocolDataUrl: string;
  ratesHistoryApiUrl?: string;
  // cachingServerUrl?: string;
  // cachingWSServerUrl?: string;
  baseUniswapAdapter?: string;
  /**
   * When this is set withdrawals will automatically be unwrapped
   */
  wrappedBaseAssetSymbol?: string;
  baseAssetSymbol: string;
  // needed for configuring the chain on metemask when it doesn't exist yet
  baseAssetDecimals: number;
  // usdMarket?: boolean;
  // function returning a link to etherscan et al
  explorerLink: string;
  explorerLinkBuilder: (props: ExplorerLinkBuilderProps) => string;
  // set this to show faucets and similar
  isTestnet?: boolean;
  // get's automatically populated on fork networks
  isFork?: boolean;
  networkLogoPath: string;
  // contains the forked off chainId
  underlyingChainId?: number;
  bridge?: {
    icon: string;
    name: string;
    url: string;
  };
};

export type BaseNetworkConfig = Omit<NetworkConfig, "explorerLinkBuilder">;

export const networkConfigs: Record<string, BaseNetworkConfig> = {
  [FathomLendingApothem.CHAIN_ID]: {
    name: "XDC Apothem",
    publicJsonRPCUrl: [
      "https://erpc.apothem.network",
      "https://rpc.apothem.network",
      "https://apothem.xdcrpc.com",
    ],
    baseAssetSymbol: "XDC",
    wrappedBaseAssetSymbol: "WXDC",
    baseAssetDecimals: 18,
    explorerLink: "https://explorer.apothem.network",
    /**
     * This need until we have no production market.
     */
    isTestnet: true,
    networkLogoPath: "./icons/networks/xdc.png",
    ratesHistoryApiUrl: "https://dev-lending.fathom.fi/data/rates-history",
  },
  [FathomLendingXdc.CHAIN_ID]: {
    name: "XDC",
    publicJsonRPCUrl: [
      "https://rpc.ankr.com/xdc",
      "https://erpc.xdcrpc.com",
      "https://erpc.xinfin.network",
    ],
    baseAssetSymbol: "XDC",
    wrappedBaseAssetSymbol: "WXDC",
    baseAssetDecimals: 18,
    explorerLink: "https://explorer.xinfin.network",
    /**
     * This need until we have no production market.
     */
    isTestnet: false,
    networkLogoPath: "./icons/networks/xdc.png",
    ratesHistoryApiUrl: "https://lending.fathom.fi/data/rates-history",
  },
  [FathomLendingSepolia.CHAIN_ID]: {
    name: "Sepolia",
    publicJsonRPCUrl: [
      "https://ethereum-sepolia.publicnode.com",
      "https://rpc2.sepolia.org",
      "https://sepolia.drpc.org",
    ],
    baseAssetSymbol: "SepoliaETH",
    wrappedBaseAssetSymbol: "WETH",
    baseAssetDecimals: 18,
    explorerLink: "https://sepolia.etherscan.io",
    /**
     * This need until we have no production market.
     */
    isTestnet: true,
    networkLogoPath: "./icons/networks/eth.svg",
    ratesHistoryApiUrl: "https://lending.sepolia.fathom.fi/data/rates-history",
  },
} as const;
