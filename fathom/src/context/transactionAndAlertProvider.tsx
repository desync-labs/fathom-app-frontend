import {
  createContext,
  FC,
  ReactElement,
  useCallback,
  useMemo,
  useState
} from "react";


type TransactionAndAlertContextType = {
  children: ReactElement;
};

type UseTransactionAndAlertContextReturnType = {}

export const TransactionAndAlertContext = createContext<UseTransactionAndAlertContextReturnType>(
  {} as UseTransactionAndAlertContextReturnType
);


export const TransactionAndAlertProvider: FC<TransactionAndAlertContextType> = ({ children }) => {

  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);
  const [successAlertMessage, setSuccessAlertMessage] = useState<string>("");
  const [errorAlertMessage, setErrorAlertMessage] = useState<string>("");

  const resetAlerts = useCallback(() => {
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
    setSuccessAlertMessage('');
    setErrorAlertMessage('');
  }, [setShowSuccessAlert, setShowErrorAlert, setSuccessAlertMessage, setErrorAlertMessage])

  const setShowSuccessAlertHandler = useCallback((state: boolean, successMessage: string = "Action was successful!") => {
    resetAlerts();
    setShowSuccessAlert(state);
    setSuccessAlertMessage(successMessage);

    setTimeout(() => {
      resetAlerts();
    }, 2000);
  }, [resetAlerts, setShowSuccessAlert, setSuccessAlertMessage]);


  const values = useMemo(() => {
    return {
      showSuccessAlert,
      showErrorAlert,
      successAlertMessage,
      errorAlertMessage,
      setShowSuccessAlertHandler
    };
  }, [
    showSuccessAlert,
    showErrorAlert,
    successAlertMessage,
    errorAlertMessage,
    setShowSuccessAlertHandler]);

  return (
    <TransactionAndAlertContext.Provider value={values}>
      {children}
    </TransactionAndAlertContext.Provider>
  );
};


