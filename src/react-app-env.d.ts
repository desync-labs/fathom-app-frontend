/// <reference types="react-scripts" />
declare module "web3/dist/web3.min.js";

type InjectProviderType = {
  isMetaMask?: true;
  request?: (...args: any[]) => void;
  on?: (...args: any[]) => void;
  removeListener?: (...args: any[]) => void;
  autoRefreshOnNetworkChange?: boolean;
  send: unknown;
  enable: () => Promise<string[]>;
};

interface Window {
  ethereum?: InjectProviderType;
  xdc?: InjectProviderType;
  web3?: {};
}
