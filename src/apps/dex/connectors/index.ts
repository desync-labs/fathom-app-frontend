import { InjectedConnector } from "@web3-react/injected-connector";

const supportedChainIds = [50, 51];

export const injected = new InjectedConnector({
  supportedChainIds,
});
