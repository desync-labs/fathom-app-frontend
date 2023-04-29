import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import Xdc3 from "xdc3";
import { XdcInjectedConnector } from "connectors/xdc-connector/xdc-connector";

export const supportedChainIds = [1337, 50, 51];
export const XDC_CHAIN_IDS = [50, 51];

export const APOTHEM_RPC = "https://erpc.apothem.network/";
export const XDC_RPC = "https://erpc.xinfin.network/";

export const DEFAULT_RPC = {
  50: XDC_RPC,
  51: APOTHEM_RPC,
};

export declare enum ChainId {
  XDC = 50,
  AXDC = 51,
}

export const NETWORK_LABELS = {
  50: "XDC",
  51: "Apothem",
};

export const EXPLORERS = {
  51: "https://explorer.apothem.network/",
  50: "https://xdc.blocksscan.io/",
};

export const XDC_NETWORK_SETTINGS = {
  50: {
    chainName: "XDC",
    chainId: Xdc3.utils.toHex(50),
    nativeCurrency: { name: "XDC", decimals: 18, symbol: "XDC" },
    rpcUrls: [XDC_RPC],
  },
  51: {
    chainName: "Apothem",
    chainId: Xdc3.utils.toHex(51),
    nativeCurrency: { name: "Apothem", decimals: 18, symbol: "AXDC" },
    rpcUrls: [APOTHEM_RPC],
  },
};

export const injected = new InjectedConnector({ supportedChainIds });
export const xdcInjected = new XdcInjectedConnector({ supportedChainIds })

export const WalletConnect = new WalletConnectConnector({
  rpc: {
    50: XDC_RPC,
    51: APOTHEM_RPC,
  },
  qrcode: true,
});
