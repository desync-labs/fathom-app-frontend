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
import {
  ITransaction,
  TransactionStatus,
} from "services/interfaces/models/ITransaction";
import { TransactionCheckUpdateInterval } from "helpers/Constants";
import { useWeb3React } from "@web3-react/core";

type TransactionAndAlertContextType = {
  children: ReactElement;
};

export type UseAlertAndTransactionReturnType = {
  showSuccessAlert: boolean;
  showErrorAlert: boolean;
  setShowSuccessAlert: Dispatch<boolean>;
  setShowErrorAlert: Dispatch<boolean>;
  successAlertMessage: string;
  errorAlertMessage: string;
  setShowSuccessAlertHandler: (state: boolean, successMessage: string) => void;
  setShowErrorAlertHandler: (state: boolean, errorMessage: string) => void;
  transactions: ITransaction[];
  addTransaction: (_transaction: ITransaction) => void;
  removeTransaction: () => void;
};

export type UseAlertAndTransactionServiceType = Pick<
  UseAlertAndTransactionReturnType,
  "setShowSuccessAlertHandler" | "setShowErrorAlertHandler" | "addTransaction"
>;

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

  const setShowSuccessAlertHandler = useCallback(
    (state: boolean, successMessage = "Action was successful!") => {
      resetAlerts();
      setShowSuccessAlert(state);
      setSuccessAlertMessage(successMessage);

      setTimeout(() => {
        resetAlerts();
      }, 2000);
    },
    [resetAlerts, setShowSuccessAlert, setSuccessAlertMessage]
  );

  const setShowErrorAlertHandler = useCallback(
    (state: boolean, errorMessage = "Something went wrong!") => {
      resetAlerts();
      setShowErrorAlert(state);
      setErrorAlertMessage(errorMessage);

      setTimeout(() => {
        resetAlerts();
      }, 2000);
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
      const response = await library.eth.getTransactionReceipt(
        pendingTransaction.hash
      );
      if (response) {
        pendingTransaction.status = response.status
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
      setShowSuccessAlert,
      setShowErrorAlert,
      successAlertMessage,
      errorAlertMessage,
      setShowSuccessAlertHandler,
      setShowErrorAlertHandler,
      addTransaction,
      removeTransaction,
    };
  }, [
    transactions,
    showSuccessAlert,
    showErrorAlert,
    setShowSuccessAlert,
    setShowErrorAlert,
    successAlertMessage,
    errorAlertMessage,
    setShowSuccessAlertHandler,
    setShowErrorAlertHandler,
    addTransaction,
    removeTransaction,
  ]);

  return (
    <AlertAndTransactionContext.Provider value={values}>
      {children}
    </AlertAndTransactionContext.Provider>
  );
};

const useAlertAndTransactionContext = () => {
  const context = useContext(AlertAndTransactionContext);

  if (!context) {
    throw new Error(
      "useAlertAndTransactionContext hook must be used with a OpenPositionContext component"
    );
  }

  return context;
};

export default useAlertAndTransactionContext;
