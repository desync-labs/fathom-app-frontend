import { InjectedConnector } from "@web3-react/injected-connector";

export const supportedChainIds = [5, 1337];
export const XDC_CHAIN_IDS = [50, 51];

export const injected = new InjectedConnector({ supportedChainIds });
