import { InjectedConnector } from "@web3-react/injected-connector";
import Web3 from "web3";

export const supportedChainIds = [1337, 50, 51];
export const XDC_CHAIN_IDS = [50, 51];

export declare enum ChainId {
  XDC = 50,
  AXDC = 51,
}

export const NETWORK_LABELS = {
  50: "XDC",
  51: "Apothem",
};

export const EXPLORERS = {
  51: 'https://explorer.apothem.network/txs/',
  50: 'https://xdc.blocksscan.io/txs/',
}

export const XDC_NETWORK_SETTINGS = {
  50: {
    chainName: 'XDC',
    chainId: Web3.utils.toHex(50),
    nativeCurrency: { name: 'XDC', decimals: 18, symbol: 'XDC' },
    rpcUrls: ['https://eRPC.BlocksScan.io/']
  },
  51: {
    chainName: 'Apothem',
    chainId: Web3.utils.toHex(51),
    nativeCurrency: { name: 'Apothem', decimals: 18, symbol: 'AXDC' },
    rpcUrls: ['https://apothem.xdcrpc.com/']
  }
}

export const injected = new InjectedConnector({ supportedChainIds });
