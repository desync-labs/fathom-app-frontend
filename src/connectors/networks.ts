import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "connectors/wallet-connect-connector/WalletConnectConnector";
import { EthereumProviderOptions } from "@walletconnect/ethereum-provider/dist/types/EthereumProvider";
import { JsonRpcProvider, Web3Provider } from "@into-the-fathom/providers";
import { DEFAULT_CHAIN_ID } from "utils/Constants";

export const APOTHEM_RPC = "https://erpc.apothem.network/";
export const XDC_RPC = "https://rpc.ankr.com/xdc/";
export const SEPOLIA_RPC = "https://eth-sepolia.public.blastapi.io/";

export enum ChainId {
  XDC = 50,
  AXDC = 51,
  SEPOLIA = 11155111,
}

const SUBGRAPH_URLS = {
  [ChainId.XDC]: "https://graph.xinfin.fathom.fi",
  [ChainId.AXDC]: "https://graph.apothem.fathom.fi",
  [ChainId.SEPOLIA]: "https://graph.sepolia.fathom.fi",
};

let supportedChainIds = [ChainId.AXDC, ChainId.SEPOLIA];
const NATIVE_ASSETS = ["ETH", "XDC"];

let DEFAULT_RPCS: any = {
  [ChainId.AXDC]: APOTHEM_RPC,
  [ChainId.XDC]: XDC_RPC,
  [ChainId.SEPOLIA]: SEPOLIA_RPC,
};

let NETWORK_SETTINGS: { [n: number]: any } = {
  [ChainId.AXDC]: {
    chainName: "Apothem",
    chainId: `0x${ChainId.AXDC.toString(16)}`,
    nativeCurrency: { name: "Apothem", decimals: 18, symbol: "AXDC" },
    rpcUrls: [APOTHEM_RPC],
    logoName: "WXDC",
  },
  [ChainId.SEPOLIA]: {
    chainName: "Sepolia",
    chainId: `0x${ChainId.SEPOLIA.toString(16)}`,
    nativeCurrency: { name: "SepoliaETH", decimals: 18, symbol: "ETH" },
    rpcUrls: [SEPOLIA_RPC],
    logoName: "ETH",
  },
};

if (process.env.REACT_APP_ENV === "prod") {
  supportedChainIds = [ChainId.XDC];

  DEFAULT_RPCS = {
    [ChainId.XDC]: XDC_RPC,
  };

  NETWORK_SETTINGS = {
    [ChainId.XDC]: {
      chainName: "XDC",
      chainId: `0x${ChainId.XDC.toString(16)}`,
      nativeCurrency: { name: "XDC", decimals: 18, symbol: "XDC" },
      rpcUrls: [XDC_RPC],
      blockExplorerUrls: ["https://explorer.xinfin.network"],
      logoName: "WXDC",
    },
  };
}

export type DefaultProvider = Web3Provider | JsonRpcProvider;

export const EXPLORERS = {
  [ChainId.AXDC]: "https://explorer.apothem.network/",
  [ChainId.XDC]: "https://xdc.blocksscan.io/",
  [ChainId.SEPOLIA]: "https://sepolia.etherscan.io/",
};

export const injected = new InjectedConnector({ supportedChainIds });

export const WalletConnect = new WalletConnectConnector({
  chains: [DEFAULT_CHAIN_ID],
  optionalChains: supportedChainIds,
  rpcMap: DEFAULT_RPCS,
  showQrModal: true,
  projectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID,
  qrModalOptions: {
    themeVariables: {
      "--wcm-z-index": "10000",
    },
  },
} as unknown as EthereumProviderOptions);

export {
  NATIVE_ASSETS,
  NETWORK_SETTINGS,
  supportedChainIds,
  SUBGRAPH_URLS,
  DEFAULT_RPCS,
};

/**
 * Display settings for the different sections of the app
 */
export const DISPLAY_FXD = [ChainId.XDC, ChainId.AXDC, ChainId.SEPOLIA];
export const DISPLAY_STABLE_SWAP = [ChainId.XDC, ChainId.AXDC];
export const DISPLAY_LENDING = [ChainId.XDC, ChainId.AXDC, ChainId.SEPOLIA];
export const DISPLAY_VAULTS = [ChainId.XDC, ChainId.AXDC, ChainId.SEPOLIA];
export const DISPLAY_DEX = [ChainId.XDC, ChainId.AXDC];
export const DISPLAY_CHARTS = [ChainId.XDC, ChainId.AXDC];
export const DISPLAY_GOVERNANCE = [ChainId.XDC, ChainId.AXDC];
