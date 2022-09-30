import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
  ReactElement,
  FC
} from "react";
import { injected } from "../connectors/networks";
import { useWeb3React } from "@web3-react/core";

export const MetaMaskContext = createContext(null);

type MetaMaskProviderType = {
  children: ReactElement
}

export const MetaMaskProvider: FC<MetaMaskProviderType> = ( { children } ) => {

  const { activate, account, active, deactivate, chainId, error } = useWeb3React();

  const [isActive, setIsActive] = useState(false);
  const [shouldDisable, setShouldDisable] = useState(false); // Should disable connect button while connecting to MetaMask
  const [isLoading, setIsLoading] = useState(true);

  // Connect to MetaMask wallet
  const connect = useCallback(async () => {
    console.log("Connecting to MetaMask...");
    setShouldDisable(true);
    try {
      await activate(injected).then(() => {
        setShouldDisable(false);
      });
    } catch (error) {
      console.log("Error on connecting: ", error);
    }
  }, [activate, setShouldDisable]);

  // Init Loading
  useEffect(() => {
    connect().then(val => {
      setIsLoading(false);
    });
  }, [connect]);

  // Check when App is Connected or Disconnected to MetaMask
  const handleIsActive = useCallback(() => {
    console.log("App is connected with MetaMask ", active);
    setIsActive(active);
  }, [active]);

  useEffect(() => {
    handleIsActive();
  }, [handleIsActive]);

  // Disconnect from Metamask wallet
  const disconnect = useCallback(async () => {
    console.log("Disconnecting wallet from App...");
    try {
      await deactivate();
    } catch (error) {
      console.log("Error on disconnnect: ", error);
    }
  }, [deactivate]);

  const values = useMemo(
    () => ({
      isActive,
      account,
      isLoading,
      connect,
      disconnect,
      shouldDisable,
      chainId,
      error
    }),
    [isActive, isLoading, shouldDisable, account, connect, disconnect, chainId, error]
  );

  // @ts-ignore
  return <MetaMaskContext.Provider value={ values }>{ children }</MetaMaskContext.Provider>;
};

const useMetaMask = function useMetaMask() {
  const context = useContext(MetaMaskContext);

  if (context === undefined) {
    throw new Error("useMetaMask hook must be used with a MetaMaskProvider component");
  }

  return context;
};

export default useMetaMask;