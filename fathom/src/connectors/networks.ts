import Xdc3 from "xdc3";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "connectors/wallet-connect-connector/wallet-connect-connector";
import { XdcInjectedConnector } from "connectors/xdc-connector/xdc-connector";
import { EthereumProviderOptions } from "@walletconnect/ethereum-provider/dist/types/EthereumProvider";
export const APOTHEM_RPC = "https://erpc.apothem.network/";
export const XDC_RPC = "https://erpc.xinfin.network/";


let XDC_CHAIN_IDS: number[] = [51];

let DEFAULT_RPC: any = {
  51: APOTHEM_RPC
};

let supportedChainIds: number[] = [51];

let rpc: any = {
  51: APOTHEM_RPC
};

let NETWORK_LABELS: { [n: number]: string } = {
  51: "Apothem"
};

if (process.env.REACT_APP_ENV === "prod") {
  XDC_CHAIN_IDS = [50];

  DEFAULT_RPC = {
    50: XDC_RPC
  };

  supportedChainIds = [50];

  rpc = {
    50: XDC_RPC,
  }

  NETWORK_LABELS = {
    50: "XDC",
  };
}

export declare enum ChainId {
  XDC = 50,
  AXDC = 51,
}

export const EXPLORERS = {
  51: "https://explorer.apothem.network/",
  50: "https://xdc.blocksscan.io/"
};

export const XDC_NETWORK_SETTINGS = {
  50: {
    chainName: "XDC",
    chainId: Xdc3.utils.toHex(50),
    nativeCurrency: { name: "XDC", decimals: 18, symbol: "XDC" },
    rpcUrls: [XDC_RPC]
  },
  51: {
    chainName: "Apothem",
    chainId: Xdc3.utils.toHex(51),
    nativeCurrency: { name: "Apothem", decimals: 18, symbol: "AXDC" },
    rpcUrls: [APOTHEM_RPC]
  }
};

export const injected = new InjectedConnector({ supportedChainIds });
export const xdcInjected = new XdcInjectedConnector({ supportedChainIds });

export const WalletConnect = new WalletConnectConnector({
  chains: supportedChainIds,
  rpcMap: rpc,
  showQrModal: true,
  projectId: '5da328ee81006c5aa59662d6cadfd5fe',
  methods: [
    'eth_sendTransaction',
    'eth_signTransaction',
    'eth_estimateGas',
    'eth_sign',
    'personal_sign',
    'eth_signTypedData',
  ],
} as EthereumProviderOptions);

export {
  XDC_CHAIN_IDS,
  DEFAULT_RPC,
  supportedChainIds,
  NETWORK_LABELS
};

export const NOT_SUPPORTED_NOTIFICATION_ERROR = -32000;
export const SKIP_ERRORS = [NOT_SUPPORTED_NOTIFICATION_ERROR];