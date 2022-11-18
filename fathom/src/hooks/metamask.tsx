import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
  ReactElement,
  FC,
} from "react";
import { injected } from "../connectors/networks";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import Xdc3 from "xdc3";

export const MetaMaskContext = createContext(null);

type MetaMaskProviderType = {
  children: ReactElement;
};

export const MetaMaskProvider: FC<MetaMaskProviderType> = ({ children }) => {
  const { activate, account, active, deactivate, chainId, error, library } =
    useWeb3React();
  const [isMetamask, setIsMetamask] = useState(false)

  useEffect(() => {
    if (library) {
      library.then((library: Web3 | Xdc3) => {
        // @ts-ignore
        const { isMetaMask } = library.currentProvider
        setIsMetamask(!!isMetaMask);
      })
    } else {
      setIsMetamask(false);
    }
  }, [library, setIsMetamask, chainId])

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

      localStorage.setItem("isConnected", "true");
    } catch (error) {
      console.log("Error on connecting: ", error);
    }
  }, [activate, setShouldDisable]);

  // Init Loading
  useEffect(() => {
    const isConnected = localStorage.getItem("isConnected");
    if (isConnected === "true") {
      connect().then((val) => {
        setIsLoading(false);
      });
    }
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
      error,
      isMetamask,
    }),
    [
      isActive,
      isLoading,
      shouldDisable,
      account,
      connect,
      disconnect,
      chainId,
      error,
      isMetamask
    ]
  );

  return (
    // @ts-ignore
    <MetaMaskContext.Provider value={values}>
      {children}
    </MetaMaskContext.Provider>
  );
};

const useMetaMask = function useMetaMask() {
  const context = useContext(MetaMaskContext);

  if (context === undefined) {
    throw new Error(
      "useMetaMask hook must be used with a MetaMaskProvider component"
    );
  }

  return context;
};

export default useMetaMask;
