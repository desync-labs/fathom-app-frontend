import useAlertAndTransactionContext from "context/alertAndTransaction";
import { getErrorTextFromError, TxAction } from "fathom-sdk";

const useRpcError = () => {
  const { setShowErrorAlertHandler } = useAlertAndTransactionContext();

  const showErrorNotification = (error: any) => {
    const { error: parsedError } = getErrorTextFromError(
      error,
      TxAction.MAIN_ACTION
    );
    if (error) {
      setShowErrorAlertHandler(true, parsedError as string);
    }
  };

  return { showErrorNotification };
};

export default useRpcError;
