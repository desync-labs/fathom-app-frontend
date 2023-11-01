import React, {
  FC,
  ReactElement,
  useMemo
} from "react";
import { RootStore } from "services";
import useAlertAndTransactionContext from "./alertAndTransaction";


const StoresContext = React.createContext<RootStore>(
  {} as RootStore
);



export const ServicesProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const {
    setShowSuccessAlertHandler,
    setShowErrorAlertHandler,
    addTransaction
  } = useAlertAndTransactionContext()

  const rootStore = useMemo(() => new RootStore({
    setShowSuccessAlertHandler,
    setShowErrorAlertHandler,
    addTransaction
  }), [
    setShowSuccessAlertHandler,
    setShowErrorAlertHandler,
    addTransaction
  ])

  return (
    <StoresContext.Provider value={rootStore}>
      {children}
    </StoresContext.Provider>
  )
}

// this will be the function available for the app to connect to the stores
export const useStores = () => React.useContext(StoresContext);

