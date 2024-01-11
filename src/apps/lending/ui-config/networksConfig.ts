import { ChainId } from "@aave/contract-helpers";
import { FathomLendingApothem } from "@into-the-fathom/fathom-lending-address-book";

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
  // https://github.com/aave/aave-api
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
    baseUniswapAdapter: "0x0",
    baseAssetSymbol: "XDC",
    wrappedBaseAssetSymbol: "WXDC",
    baseAssetDecimals: 18,
    explorerLink: "https://explorer.apothem.network",
    isTestnet: true,
    networkLogoPath: "./assets/networks/xdc.png",
    ratesHistoryApiUrl: "http://206.189.103.116:30002/data/rates-history",
  },
  [ChainId.sepolia]: {
    name: "Ethereum Sepolia",
    publicJsonRPCUrl: [
      "https://eth-sepolia.public.blastapi.io",
      "https://rpc.sepolia.org",
      "https://rpc2.sepolia.org",
      "https://rpc.sepolia.online",
      "https://www.sepoliarpc.space",
    ],
    baseUniswapAdapter: "0x0",
    baseAssetSymbol: "ETH",
    wrappedBaseAssetSymbol: "WETH",
    baseAssetDecimals: 18,
    explorerLink: "https://sepolia.etherscan.io",
    // usdMarket: true,
    isTestnet: true,
    networkLogoPath: "./assets/networks/ethereum.svg",
  },
  [ChainId.mainnet]: {
    name: "Ethereum",
    privateJsonRPCUrl:
      "https://eth-mainnet.gateway.pokt.network/v1/lb/62b3314e123e6f00397f19ca",
    publicJsonRPCUrl: [
      "https://rpc.ankr.com/eth",
      "https://rpc.flashbots.net",
      "https://eth-mainnet.public.blastapi.io",
      "https://cloudflare-eth.com/v1/mainnet",
    ],
    publicJsonRPCWSUrl: "wss://eth-mainnet.alchemyapi.io/v2/demo",
    baseUniswapAdapter: "0xc3efa200a60883a96ffe3d5b492b121d6e9a1f3f",
    baseAssetSymbol: "ETH",
    wrappedBaseAssetSymbol: "WETH",
    baseAssetDecimals: 18,
    explorerLink: "https://etherscan.io",
    ratesHistoryApiUrl: "https://aave-api-v2.aave.com/data/rates-history",
    networkLogoPath: "./assets/networks/ethereum.svg",
  },
} as const;
