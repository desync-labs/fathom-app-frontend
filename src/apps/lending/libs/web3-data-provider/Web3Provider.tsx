import { transactionType } from "@into-the-fathom/lending-contract-helpers";
import { SignatureLike } from "@into-the-fathom/bytes";
import {
  JsonRpcProvider,
  TransactionResponse,
} from "@into-the-fathom/providers";
import { BigNumber, PopulatedTransaction } from "fathom-ethers";
import React, { ReactElement, useEffect, useState } from "react";
import { useRootStore } from "apps/lending/store/root";
import { hexToAscii } from "apps/lending/utils/utils";

import { Web3Context } from "apps/lending/libs/hooks/useWeb3Context";
import useConnector from "context/connector";

export type ERC20TokenType = {
  address: string;
  symbol: string;
  decimals: number;
  image?: string;
  fmToken?: boolean;
};

export type Web3Data = {
  disconnectWallet: () => void;
  currentAccount: string;
  connected: boolean;
  loading: boolean;
  provider: JsonRpcProvider | undefined;
  chainId: number;
  switchNetwork: (chainId: number) => Promise<void>;
  getTxError: (txHash: string) => Promise<string>;
  sendTx: (
    txData: transactionType | PopulatedTransaction
  ) => Promise<TransactionResponse>;
  addERC20Token: (args: ERC20TokenType) => Promise<boolean>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signTxData: (unsignedData: string) => Promise<SignatureLike>;
  error: Error | undefined;
  switchNetworkError: Error | undefined;
  setSwitchNetworkError: (err: Error | undefined) => void;
};

export const Web3ContextProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const {
    account,
    chainId,
    library: provider,
    isActive: active,
    error,
    disconnect,
    isLoading: loading,
    addERC20Token,
    requestChangeNetwork,
  } = useConnector();

  const [switchNetworkError, setSwitchNetworkError] = useState<Error>();
  const [setAccount] = useRootStore((store) => [
    store.setAccount,
    store.currentChainId,
  ]);
  const setAccountLoading = useRootStore((store) => store.setAccountLoading);

  // TODO: we use from instead of currentAccount because of the mock wallet.
  // If we used current account then the tx could get executed
  const sendTx = async (
    txData: transactionType | PopulatedTransaction
  ): Promise<TransactionResponse> => {
    if (provider) {
      const { from, ...data } = txData;
      const signer = provider.getSigner(from);
      const txResponse: TransactionResponse = await signer.sendTransaction({
        ...data,
        value: data.value ? BigNumber.from(data.value) : undefined,
      });
      return txResponse;
    }
    throw new Error("Error sending transaction. Provider not found");
  };

  // TODO: recheck that it works on all wallets
  const signTxData = async (unsignedData: string): Promise<SignatureLike> => {
    if (provider && account) {
      const signature: SignatureLike = await provider.send(
        "eth_signTypedData_v4",
        [account, unsignedData]
      );

      return signature;
    }
    throw new Error("Error initializing permit signature");
  };

  const getTxError = async (txHash: string): Promise<string> => {
    if (provider) {
      const tx = await provider.getTransaction(txHash);
      // @ts-expect-error TODO: need think about "tx" type
      const code = await provider.call(tx, tx.blockNumber);
      const error = hexToAscii(code.substr(138));
      return error;
    }
    throw new Error("Error getting transaction. Provider not found");
  };

  useEffect(() => {
    setAccount(account?.toLowerCase());
  }, [account]);

  useEffect(() => {
    setAccountLoading(loading);
  }, [loading]);

  return (
    <Web3Context.Provider
      value={{
        web3ProviderData: {
          disconnectWallet: disconnect,
          provider: provider as unknown as JsonRpcProvider,
          connected: active,
          loading,
          chainId: chainId,
          switchNetwork: requestChangeNetwork,
          getTxError,
          sendTx,
          signTxData,
          currentAccount: account?.toLowerCase() || "",
          addERC20Token,
          error,
          switchNetworkError,
          setSwitchNetworkError,
        },
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
