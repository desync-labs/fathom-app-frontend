import { ChainId } from "@aave/contract-helpers";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { InjectedConnector } from "@web3-react/injected-connector";

import { WalletConnectConnector } from "apps/lending/libs/web3-data-provider/WalletConnectConnector";

export enum WalletType {
  INJECTED = "injected",
  WALLET_CONNECT = "wallet_connect",
}

export const getWallet = (
  wallet: WalletType,
  currentChainId: ChainId = ChainId.mainnet
): AbstractConnector => {
  switch (wallet) {
    case WalletType.INJECTED:
      return new InjectedConnector({});
    case WalletType.WALLET_CONNECT:
      return new WalletConnectConnector(currentChainId);
    default: {
      throw new Error(`unsupported wallet`);
    }
  }
};
