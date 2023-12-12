import {
  createContext,
  Dispatch,
  FC,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ITransaction, TransactionStatus } from "fathom-sdk";
import { TransactionCheckUpdateInterval } from "utils/Constants";
import { useWeb3React } from "@web3-react/core";
import { ERC20TokenType } from "context/connector";

type TransactionAndAlertContextType = {
  children: ReactElement;
};

export type UseAlertAndTransactionReturnType = {
  showSuccessAlert: boolean;
  showErrorAlert: boolean;
  erc20TokenModalData: ERC20TokenType | undefined;
  erc20TokenModalDescription: string;
  setShowSuccessAlert: Dispatch<boolean>;
  setShowErrorAlert: Dispatch<boolean>;
  successAlertMessage: string;
  errorAlertMessage: string;
  setShowSuccessAlertHandler: (state: boolean, successMessage: string) => void;
  setShowErc20TokenModalHandler: (
    successMessage: string,
    erc20token: ERC20TokenType | undefined,
    successDescription: string
  ) => void;
  setShowErrorAlertHandler: (state: boolean, errorMessage: string) => void;
  transactions: ITransaction[];
  addTransaction: (_transaction: ITransaction) => void;
  removeTransaction: () => void;
  resetErc20TokenModal: () => void;
};

export const AlertAndTransactionContext =
  createContext<UseAlertAndTransactionReturnType>(
    {} as UseAlertAndTransactionReturnType
  );

export const AlertAndTransactionProvider: FC<
  TransactionAndAlertContextType
> = ({ children }) => {
  const { library } = useWeb3React();

  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);
  const [successAlertMessage, setSuccessAlertMessage] = useState<string>("");
  const [errorAlertMessage, setErrorAlertMessage] = useState<string>("");
  const [erc20TokenModalData, setErc20TokenModalData] = useState<
    ERC20TokenType | undefined
  >(undefined);
  const [erc20TokenModalDescription, setErc20TokenModalDescription] =
    useState<string>("");

  const [transactions, setTransactions] = useState<ITransaction[]>([]);

  const resetAlerts = useCallback(() => {
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
    setSuccessAlertMessage("");
    setErrorAlertMessage("");
  }, [
    setShowSuccessAlert,
    setShowErrorAlert,
    setSuccessAlertMessage,
    setErrorAlertMessage,
  ]);

  const resetErc20TokenModal = useCallback(() => {
    setSuccessAlertMessage("");
    setErc20TokenModalData(undefined);
    setErc20TokenModalDescription("");
  }, [
    setSuccessAlertMessage,
    setErc20TokenModalData,
    setErc20TokenModalDescription,
  ]);

  const setShowSuccessAlertHandler = useCallback(
    (state: boolean, successMessage = "Action was successful!") => {
      resetAlerts();
      setShowSuccessAlert(state);
      setSuccessAlertMessage(successMessage);

      setTimeout(() => {
        resetAlerts();
      }, TransactionCheckUpdateInterval);
    },
    [resetAlerts, setShowSuccessAlert, setSuccessAlertMessage]
  );

  const setShowErc20TokenModalHandler = useCallback(
    (
      successMessage = "Action was successful!",
      erc20Token: ERC20TokenType | undefined,
      successDescription = ""
    ) => {
      setErc20TokenModalData(erc20Token);
      setSuccessAlertMessage(successMessage);
      setErc20TokenModalDescription(successDescription);
    },
    [
      resetErc20TokenModal,
      setErc20TokenModalData,
      setSuccessAlertMessage,
      setErc20TokenModalDescription,
    ]
  );

  const setShowErrorAlertHandler = useCallback(
    (state: boolean, errorMessage = "Something went wrong!") => {
      resetAlerts();
      setShowErrorAlert(state);
      setErrorAlertMessage(errorMessage);

      setTimeout(() => {
        resetAlerts();
      }, TransactionCheckUpdateInterval);
    },
    [resetAlerts, setShowErrorAlert, setErrorAlertMessage]
  );

  const addTransaction = useCallback(
    (_transaction: ITransaction) => {
      setTransactions((prevState) => [...prevState, _transaction]);
      resetAlerts();
    },
    [setTransactions, resetAlerts]
  );

  const removeTransaction = useCallback(() => {
    const newTransactions = [...transactions];
    newTransactions.splice(-1);
    setTransactions(newTransactions);
  }, [transactions, setTransactions]);

  const checkStatus = useCallback(
    async (pendingTransaction: ITransaction) => {
      const receipt = await library.getTransactionReceipt(
        pendingTransaction.hash
      );
      if (receipt) {
        pendingTransaction.status = receipt.status
          ? TransactionStatus.Success
          : TransactionStatus.Error;
      }

      return pendingTransaction;
    },
    [library]
  );

  const checkTransactionStatus = useCallback(async () => {
    if (library) {
      for (const transaction of transactions) {
        if (transaction) {
          transaction.active = true;
          const tx = await checkStatus(transaction);
          if (tx.status !== TransactionStatus.None) {
            removeTransaction();
          }
        }
      }
    }
  }, [library, transactions, removeTransaction, checkStatus]);

  useEffect(() => {
    const fetchHandleInterval = setInterval(
      checkTransactionStatus,
      TransactionCheckUpdateInterval
    );

    return () => clearInterval(fetchHandleInterval);
  }, [library, checkTransactionStatus]);

  const values = useMemo(() => {
    return {
      transactions,
      showSuccessAlert,
      showErrorAlert,
      erc20TokenModalData,
      erc20TokenModalDescription,
      setShowSuccessAlert,
      setShowErrorAlert,
      successAlertMessage,
      errorAlertMessage,
      setShowSuccessAlertHandler,
      setShowErc20TokenModalHandler,
      setShowErrorAlertHandler,
      addTransaction,
      removeTransaction,
      resetErc20TokenModal,
    };
  }, [
    transactions,
    showSuccessAlert,
    showErrorAlert,
    erc20TokenModalData,
    erc20TokenModalDescription,
    setShowSuccessAlert,
    setShowErrorAlert,
    successAlertMessage,
    errorAlertMessage,
    setShowSuccessAlertHandler,
    setShowErc20TokenModalHandler,
    setShowErrorAlertHandler,
    addTransaction,
    removeTransaction,
    resetErc20TokenModal,
  ]);

  return (
    <AlertAndTransactionContext.Provider value={values}>
      {children}
    </AlertAndTransactionContext.Provider>
  );
};

const useAlertAndTransactionContext = () =>
  useContext(AlertAndTransactionContext);

export default useAlertAndTransactionContext;
