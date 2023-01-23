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
import { injected, walletconnect } from "connectors/networks";
import { useWeb3React } from "@web3-react/core";
import WalletConnectProvider from "@walletconnect/ethereum-provider";
import { useStores } from "stores";
import { ConnectorEvent } from "@web3-react/types";
import { getDefaultProvider } from "../utils/defaultProvider";

export const ConnectorContext = createContext(null);

type ConnectorProviderType = {
  children: ReactElement;
};

export const ConnectorProvider: FC<ConnectorProviderType> = ({ children }) => {
  const {
    connector,
    activate,
    account,
    active,
    deactivate,
    chainId,
    error,
    library,
  } = useWeb3React();

  const [isMetamask, setIsMetamask] = useState(false);
  const [isWalletConnect, setIsWalletConnect] = useState(false);

  const [isActive, setIsActive] = useState(false);
  const [shouldDisable, setShouldDisable] = useState(false); // Should disable connect button while connecting to MetaMask
  const [isLoading, setIsLoading] = useState(true);
  const [web3Library, setWeb3Library] = useState(library);

  const { transactionStore } = useStores();

  useEffect(() => {
    if (!library) {
      setWeb3Library(getDefaultProvider())
    }
  }, [library, setWeb3Library]);

  useEffect(() => {
    if (library) {
      // @ts-ignore
      const { isMetaMask } = library.currentProvider;
      setIsMetamask(!!isMetaMask);

      setIsWalletConnect(
        library.currentProvider instanceof WalletConnectProvider
      );

      transactionStore.setLibrary(library);
    } else {
      setIsMetamask(false);
      setIsWalletConnect(false);
    }
  }, [library, transactionStore, setIsMetamask, setIsWalletConnect]);

  const deactivateEvent = useCallback(() => {
    sessionStorage.removeItem('isConnected')
  }, []);

  useEffect(() => {
    if (connector) {
      connector.on(ConnectorEvent.Deactivate, deactivateEvent);
    }

    return () => {
      if (connector) {
        connector.off(ConnectorEvent.Deactivate, deactivateEvent);
      }
    };
  }, [connector, deactivateEvent]);

  // Connect to MetaMask wallet
  const connectMetamask = useCallback( () => {
    setShouldDisable(true);
    return activate(injected).then(() => {
      setShouldDisable(false);
      sessionStorage.setItem("isConnected", "metamask");
    });
  }, [activate, setShouldDisable]);

  const connectWalletConnect = useCallback( () => {
    setShouldDisable(true);
    return activate(walletconnect).then(() => {
      setShouldDisable(false);
      sessionStorage.setItem("isConnected", "walletConnect");
    });
  }, [activate]);

  // Init Loading
  useEffect(() => {
    const isConnected = sessionStorage.getItem("isConnected");
    if (isConnected === "metamask") {
      connectMetamask()!.then(() => {
        setIsLoading(false);
      });
    } else if (isConnected === "walletConnect") {
      connectWalletConnect()!.then(() => {
        setIsLoading(false);
      });
    }
  }, [connectMetamask, connectWalletConnect]);

  // Check when App is Connected or Disconnected to MetaMask
  const handleIsActive = useCallback(() => {
    setIsActive(active);
  }, [active]);

  useEffect(() => {
    handleIsActive();
  }, [handleIsActive]);

  const disconnect = useCallback(async () => {
    try {
      await deactivate();
      sessionStorage.removeItem("isConnected");
      setIsMetamask(false);
      setIsWalletConnect(false);
    } catch (error) {
      console.log("Error on disconnnect: ", error);
    }
  }, [deactivate, setIsMetamask, setIsWalletConnect]);

  const values = useMemo(
    () => ({
      isActive,
      account,
      isLoading,
      connectMetamask,
      connectWalletConnect,
      disconnect,
      shouldDisable,
      chainId,
      error,
      library: web3Library,
      isMetamask,
      isWalletConnect,
    }),
    [
      isActive,
      isLoading,
      shouldDisable,
      account,
      connectMetamask,
      connectWalletConnect,
      disconnect,
      chainId,
      error,
      web3Library,
      isMetamask,
      isWalletConnect,
    ]
  );

  return (
    // @ts-ignore
    <ConnectorContext.Provider value={values}>
      {children}
    </ConnectorContext.Provider>
  );
};

const useConnector = (): any => {
  const context = useContext(ConnectorContext);

  if (context === undefined) {
    throw new Error(
      "useConnector hook must be used with a ConnectorProvider component"
    );
  }

  return context;
};

export default useConnector;
