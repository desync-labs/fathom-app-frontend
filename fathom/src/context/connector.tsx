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
import Xdc3 from "xdc3";
import WalletConnectProvider from "@walletconnect/ethereum-provider";
import { Web3Utils } from "../helpers/Web3Utils";

export const ConnectorContext = createContext(null);

type ConnectorProviderType = {
  children: ReactElement;
};

export const ConnectorProvider: FC<ConnectorProviderType> = ({ children }) => {
  const { activate, account, active, deactivate, chainId, error, library } =
    useWeb3React();
  const [isMetamask, setIsMetamask] = useState(false);
  const [isWalletConnect, setIsWalletConnect] = useState(false);

  useEffect(() => {
    if (library) {
      library.then((library: Xdc3) => {
        // @ts-ignore
        const { isMetaMask } = library.currentProvider;
        setIsMetamask(!!isMetaMask);

        setIsWalletConnect(
          library.currentProvider instanceof WalletConnectProvider
        );

        Web3Utils.provider = library.currentProvider;
      });
    } else {
      setIsMetamask(false);
    }
  }, [library, setIsMetamask, setIsWalletConnect, chainId]);

  const [isActive, setIsActive] = useState(false);
  const [shouldDisable, setShouldDisable] = useState(false); // Should disable connect button while connecting to MetaMask
  const [isLoading, setIsLoading] = useState(true);

  // Connect to MetaMask wallet
  const connectMetamask = useCallback(async () => {
    setShouldDisable(true);
    try {
      await activate(injected).then(() => {
        setShouldDisable(false);
      });

      sessionStorage.setItem("isConnected", "metamask");
    } catch (error) {
      console.log("Error on connecting: ", error);
    }
  }, [activate, setShouldDisable]);

  const connectWalletConnect = useCallback(async () => {
    setShouldDisable(true);
    try {
      await activate(walletconnect).then(() => {
        setShouldDisable(false);
      });

      sessionStorage.setItem("isConnected", "walletConnect");
    } catch (error) {
      console.log("Error on connecting: ", error);
    }
  }, [activate]);

  // Init Loading
  useEffect(() => {
    const isConnected = sessionStorage.getItem("isConnected");
    if (isConnected === "metamask") {
      connectMetamask().then(() => {
        setIsLoading(false);
      });
    } else if (isConnected === "walletConnect") {
      connectWalletConnect().then(() => {
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
