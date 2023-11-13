import React, { FC, ReactElement, useEffect, useMemo } from "react";
import { RootService } from "services";
import { supportedChainIds } from "connectors/networks";
import { getDefaultProvider } from "utils/defaultProvider";
import {
  ITransaction,
  TRANSACTION_PENDING_MESSAGES,
  TRANSACTION_SUCCESS_MESSAGES,
  CHECK_ON_BLOCK_EXPLORER,
  TransactionType,
} from "fathom-sdk";
import { TransactionReceipt } from "xdc3-eth";
import { useWeb3React } from "@web3-react/core";
import { SmartContractFactory, Web3Utils } from "fathom-sdk";
import useAlertAndTransactionContext from "context/alertAndTransaction";
import { getTokenLogoURL } from "utils/tokenLogo";

const StoresContext = React.createContext<RootService>({} as RootService);

export const ServicesProvider: FC<{ children: ReactElement }> = ({
  children,
}) => {
  const {
    setShowSuccessAlertHandler,
    setShowErrorAlertHandler,
    addTransaction,
    setShowErc20TokenModalHandler,
  } = useAlertAndTransactionContext();

  const { library, chainId } = useWeb3React();

  const rootStore = useMemo(() => new RootService(), []);

  useEffect(() => {
    if (library && chainId && supportedChainIds.includes(chainId)) {
      rootStore.setProvider(library);
    } else {
      rootStore.setProvider(getDefaultProvider());
    }
  }, [library, chainId, rootStore]);

  useEffect(() => {
    if (chainId) {
      rootStore.setChainId(chainId);
    }
  }, [chainId, rootStore]);

  useEffect(() => {
    const pendingTransactionHandler = (transactionObject: ITransaction) => {
      console.log("pendingTransaction", transactionObject);
      let title =
        TRANSACTION_PENDING_MESSAGES[transactionObject.type as TransactionType];
      if (transactionObject.tokenName) {
        title = title.replace("${tokenName}", transactionObject.tokenName);
      }
      const transaction = {
        ...transactionObject,
        title,
        message: CHECK_ON_BLOCK_EXPLORER,
      };
      addTransaction(transaction);
    };

    const errorTransactionHandler = ({ error }: { error: Error }) => {
      setShowErrorAlertHandler(true, error.message);
    };

    const successTransactionHandler = async ({
      type,
      receipt,
      tokenName,
    }: {
      type: string;
      receipt: TransactionReceipt;
      tokenName?: string;
    }) => {
      console.log("successTransaction", type, receipt);
      let message = TRANSACTION_SUCCESS_MESSAGES[type as TransactionType];
      message = tokenName
        ? message.replace("${tokenName}", tokenName)
        : message;

      if (type === "OpenPosition") {
        const { provider, chainId } = rootStore;
        const contractData = SmartContractFactory.FathomStableCoin(chainId);
        const { address } = contractData;
        const contract = Web3Utils.getContractInstance(contractData, provider);

        const [decimals, symbol] = await Promise.all([
          contract.methods.decimals().call(),
          contract.methods.symbol().call(),
        ]);
        const image = getTokenLogoURL(symbol);

        setShowErc20TokenModalHandler(message, {
          address,
          symbol,
          decimals,
          image,
        });
      } else {
        setShowSuccessAlertHandler(true, message);
      }
    };

    if (rootStore) {
      rootStore.serviceList.forEach((serviceName) => {
        // @ts-ignore
        if (rootStore[serviceName].emitter) {
          // @ts-ignore
          rootStore[serviceName].emitter.on(
            "pendingTransaction",
            pendingTransactionHandler
          );
          // @ts-ignore
          rootStore[serviceName].emitter.on(
            "errorTransaction",
            errorTransactionHandler
          );
          // @ts-ignore
          rootStore[serviceName].emitter.on(
            "successTransaction",
            successTransactionHandler
          );
        }
      });
    }

    return () => {
      rootStore.serviceList.forEach((serviceName) => {
        // @ts-ignore
        if (rootStore[serviceName].emitter) {
          // @ts-ignore
          rootStore[serviceName].emitter.off(
            "pendingTransaction",
            pendingTransactionHandler
          );
          // @ts-ignore
          rootStore[serviceName].emitter.off(
            "errorTransaction",
            errorTransactionHandler
          );
          // @ts-ignore
          rootStore[serviceName].emitter.off(
            "successTransaction",
            successTransactionHandler
          );
        }
      });
    };
  }, [
    rootStore,
    addTransaction,
    setShowSuccessAlertHandler,
    setShowErrorAlertHandler,
  ]);

  return (
    <StoresContext.Provider value={rootStore}>
      {children}
    </StoresContext.Provider>
  );
};

// this will be the function available for the app to connect to the stores
export const useServices = () => React.useContext(StoresContext);
