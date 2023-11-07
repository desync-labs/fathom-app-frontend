import React, { FC, ReactElement, useEffect, useMemo, useState } from "react";
import { RootStore } from "services";
// import useAlertAndTransactionContext from "./alertAndTransaction";
import useConnector from "./connector";
import Xdc3 from "xdc3";
import { supportedChainIds } from "connectors/networks";
import { getDefaultProvider } from "utils/defaultProvider";

const StoresContext = React.createContext<RootStore>({} as RootStore);

export const ServicesProvider: FC<{ children: ReactElement }> = ({
  children,
}) => {
  // const {
  //   setShowSuccessAlertHandler,
  //   setShowErrorAlertHandler,
  //   addTransaction
  // } = useAlertAndTransactionContext();

  const { library, account, chainId } = useConnector();

  const [provider, setProvider] = useState<Xdc3>(library);

  useEffect(() => {
    if (library && account && chainId && supportedChainIds.includes(chainId)) {
      setProvider(library);
    } else {
      setProvider(getDefaultProvider());
    }
  }, [library, account, chainId, setProvider]);

  const rootStore = useMemo(() => new RootStore(provider), [provider]);

  return (
    <StoresContext.Provider value={rootStore}>
      {children}
    </StoresContext.Provider>
  );
};

// this will be the function available for the app to connect to the stores
export const useServices = () => React.useContext(StoresContext);
