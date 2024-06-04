import {
  createContext,
  FC,
  ReactElement,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { RootService } from "services";
import { getDefaultProvider } from "utils/defaultProvider";
import {
  ITransaction,
  TRANSACTION_PENDING_MESSAGES,
  TRANSACTION_SUCCESS_MESSAGES,
  CHECK_ON_BLOCK_EXPLORER,
  TransactionType,
  TxErrorType,
} from "fathom-sdk";
import { TransactionReceipt } from "@into-the-fathom/providers";
import { useWeb3React } from "@web3-react/core";
import { SmartContractFactory, Web3Utils } from "fathom-sdk";
import useAlertAndTransactionContext from "context/alertAndTransaction";
import { getTokenLogoURL } from "utils/tokenLogo";

const ServicesContext = createContext<RootService>({} as RootService);

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

  const rootService = useMemo(() => new RootService(), []);

  useEffect(() => {
    if (library) {
      rootService.setProvider(library);
    } else {
      rootService.setProvider(getDefaultProvider());
    }
  }, [library, chainId, rootService]);

  useEffect(() => {
    if (chainId) {
      rootService.setChainId(chainId);
    }
  }, [chainId, rootService]);

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

    const errorTransactionHandler = ({ error }: { error: TxErrorType }) => {
      setShowErrorAlertHandler(true, error?.error as string);
    };

    const successTransactionHandler = async ({
      type,
      receipt,
      tokenName,
    }: {
      type: TransactionType;
      receipt: TransactionReceipt;
      tokenName?: string;
    }) => {
      console.log("successTransaction", type, receipt);
      let message = TRANSACTION_SUCCESS_MESSAGES[type as TransactionType];
      message = tokenName
        ? message.replace("${tokenName}", tokenName)
        : message;

      let addTokenToWalletText =
        "Add ${tokenName} to wallet to track your balance.";

      if (type === TransactionType.OpenPosition) {
        const { provider, chainId } = rootService;
        const contractData = SmartContractFactory.FathomStableCoin(chainId);
        const { address } = contractData;
        const contract = Web3Utils.getContractInstance(contractData, provider);

        const [decimals, symbol] = await Promise.all([
          contract.decimals(),
          contract.symbol(),
        ]);
        const image = getTokenLogoURL(symbol);

        addTokenToWalletText = addTokenToWalletText.replace(
          "${tokenName}",
          "FXD"
        );

        setShowErc20TokenModalHandler(
          message,
          {
            address,
            symbol,
            decimals,
            image,
          },
          addTokenToWalletText
        );
      } else if (type === TransactionType.OpenVaultDeposit) {
        const { provider } = rootService;
        const address = receipt.to;

        const contract = Web3Utils.getContractInstance(
          SmartContractFactory.FathomVault(address),
          provider
        );

        const [decimals, symbol, name] = await Promise.all([
          contract.decimals(),
          contract.symbol(),
          contract.name(),
        ]);
        const image = getTokenLogoURL("FXD");

        addTokenToWalletText = addTokenToWalletText.replace(
          "${tokenName}",
          name
        );

        setShowErc20TokenModalHandler(
          message,
          {
            address,
            symbol,
            decimals,
            image,
          },
          addTokenToWalletText
        );
      } else {
        setShowSuccessAlertHandler(true, message);
      }
    };

    if (rootService) {
      Object.values(rootService.serviceList).forEach((service) => {
        if ("emitter" in service) {
          service.emitter.on("pendingTransaction", pendingTransactionHandler);
          service.emitter.on("errorTransaction", errorTransactionHandler);
          service.emitter.on("successTransaction", successTransactionHandler);
        }
      });
    }

    return () => {
      Object.values(rootService.serviceList).forEach((service) => {
        if ("emitter" in service) {
          service.emitter.off("pendingTransaction", pendingTransactionHandler);
          service.emitter.off("errorTransaction", errorTransactionHandler);
          service.emitter.off("successTransaction", successTransactionHandler);
        }
      });
    };
  }, [
    rootService,
    addTransaction,
    setShowSuccessAlertHandler,
    setShowErrorAlertHandler,
  ]);

  return (
    <ServicesContext.Provider value={rootService}>
      {children}
    </ServicesContext.Provider>
  );
};

// this will be the function available for the app to connect to the stores
export const useServices = () => useContext(ServicesContext);
