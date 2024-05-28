import useAlertAndTransactionContext from "../context/alertAndTransaction";

export const contractTxErrorMapping: Record<number, string> = {
  502: "Problem with the selected rpc. Try changing the url of the rpc in MetaMask ",
  4001: "You cancelled the transaction.",
};
const useRpcError = () => {
  const { setShowErrorAlertHandler } = useAlertAndTransactionContext();
  const parseRpcError = (error: any) => {
    const errorBody = error?.body;
    const errorCode = error?.code;

    if (
      error.code === 4001 ||
      error.code === "ACTION_REJECTED" ||
      error.code === 5000
    ) {
      return {
        error: errorBody ? JSON.parse(errorBody) : error,
        code: errorCode,
        message: contractTxErrorMapping[4001],
      };
    }

    return {
      error: errorBody ? JSON.parse(errorBody) : error,
      code: errorCode,
      message: contractTxErrorMapping[errorCode] || null,
    };
  };

  const showErrorNotification = (error: any) => {
    const { message } = parseRpcError(error);
    if (message) {
      setShowErrorAlertHandler(true, message);
    }
  };

  return { parseRpcError, showErrorNotification };
};

export default useRpcError;
