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
import Xdc3 from "xdc3";
import { injected, WalletConnect } from "connectors/networks";
import { useStores } from "stores";
import { useWeb3React } from "@web3-react/core";
import { injected, WalletConnect } from "connectors/networks";
import WalletConnectProvider from "@walletconnect/ethereum-provider";
import { ConnectorEvent } from "@web3-react/types";
import { getDefaultProvider } from "utils/defaultProvider";
import { providerOptions } from "xdcpay-connect";
import Web3Modal from "web3modal";

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

  const [web3Modal, setWeb3Modal] = useState<Web3Modal | null>(null);
  const [xdcPayAccount, setXdcPayAccount] = useState<string | null>(null);
  const [xdcPayChainId, setXdcPayChainId] = useState<number | null>(null);
  const [connected, setConnected] = useState<boolean>(false);

  const [isMetamask, setIsMetamask] = useState<boolean>(false);
  const [isWalletConnect, setIsWalletConnect] = useState<boolean>(false);
  const [isXdcPay, setIsXdcPay] = useState<boolean>(false)

  const [isActive, setIsActive] = useState(false);
  const [shouldDisable, setShouldDisable] = useState(false); // Should disable connect button while connecting to MetaMask
  const [isLoading, setIsLoading] = useState(true);
  const [web3Library, setWeb3Library] = useState<Xdc3 | null>(library);

  const { transactionStore } = useStores();

  useEffect(() => {
    const _web3Modal = new Web3Modal({
      cacheProvider: true, // optional
      providerOptions, // required
      disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
    });

    setWeb3Modal(_web3Modal);
  }, []);

  useEffect(() => {
    !!library ? setWeb3Library(library) : setWeb3Library(getDefaultProvider());
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
    sessionStorage.removeItem("isConnected");
  }, []);

  const createWeb3 = useCallback((provider: Xdc3) => {
    let realProvider;

    if (typeof provider === "string") {
      // @ts-ignore
      if (provider.includes("wss")) {
        realProvider = new Xdc3.providers.WebsocketProvider(provider);
      } else {
        realProvider = new Xdc3.providers.HttpProvider(provider);
      }
    } else {
      realProvider = provider;
    }

    // @ts-ignore
    return new Xdc3(realProvider);
  }, []);

  const resetWeb3 = useCallback(() => {
    setWeb3Library(null);
    setXdcPayAccount(null);
    setXdcPayChainId(null);
    setConnected(false);
  }, []);

  const subscribeProvider = useCallback(
    async (_provider: any, _web3: Xdc3) => {
      if (!_provider.on) return;

      _provider.on("close", () => {
        resetWeb3();
      });

      _provider.on("accountsChanged", async (accounts: string[]) => {
        setXdcPayAccount(_web3.utils.toChecksumAddress(accounts[0]));
      });
      _provider.on("chainChanged", async (chainId: number) => {
        console.log("Chain changed: ", chainId);
        setXdcPayChainId(Number(chainId));
      });

      _provider.on("networkChanged", async (networkId: number) => {
        const chainId = await _web3.eth.getChainId();
        setXdcPayChainId(Number(chainId));
      });
    },
    [resetWeb3]
  );

  const connectXdc = useCallback(async (onClose?: () => void) => {
    if (!web3Modal) return;

    const _provider = await web3Modal.connect();
    if (_provider === null) return;

    const _web3 = createWeb3(_provider);

    setIsXdcPay(true);
    setWeb3Library(_web3);

    await subscribeProvider(_provider, _web3);

    const accounts = await _web3.eth.getAccounts();
    const _account = _web3.utils.toChecksumAddress(accounts[0]);
    const _chainId = await _web3.eth.getChainId();

    setXdcPayAccount(_account);
    setXdcPayChainId(Number(_chainId));
    setConnected(true);
    onClose && onClose()
  }, [web3Modal, subscribeProvider, createWeb3]);

  useEffect(() => {
    if (web3Modal && web3Modal.cachedProvider) {
      connectXdc();
    }
  }, [web3Modal, connectXdc]);

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

  const disconnectXdc3 = useCallback(async () => {
    if (web3Library && web3Library.currentProvider) {
      const _provider: any = web3Library.currentProvider;
      if (_provider.close) await _provider.close();
    }
    if (web3Modal) {
      await web3Modal.clearCachedProvider();
    }
    resetWeb3();
    setIsXdcPay(false)
  }, [web3Modal, web3Library, resetWeb3]);


  // Connect to MetaMask wallet
  const connectMetamask = useCallback(() => {
    setShouldDisable(true);
    return activate(injected).then(() => {
      setShouldDisable(false);
      sessionStorage.setItem("isConnected", "metamask");
    });
  }, [activate, setShouldDisable]);

  const connectWalletConnect = useCallback(() => {
    setShouldDisable(true);
    return activate(WalletConnect).then(() => {
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
    if (isXdcPay) {
      return disconnectXdc3();
    }

    try {
      await deactivate();
      sessionStorage.removeItem("isConnected");
      setIsMetamask(false);
      setIsWalletConnect(false);
    } catch (error) {
      console.log(`Error on disconnnect: ${error}`);
    }
  }, [isXdcPay, disconnectXdc3, deactivate, setIsMetamask, setIsWalletConnect]);

  const values = useMemo(
    () => ({
      connector,
      isActive: isXdcPay ? connected : isActive,
      account: isXdcPay ? xdcPayAccount: account,
      isLoading,
      connectMetamask,
      connectWalletConnect,
      connectXdc,
      disconnect,
      shouldDisable,
      chainId: isXdcPay ? xdcPayChainId: chainId,
      error,
      library: web3Library,
      isMetamask,
      isWalletConnect,
      isXdcPay,
    }),
    [
      connector,
      isActive,
      isLoading,
      shouldDisable,
      account,
      connectMetamask,
      connectWalletConnect,
      connectXdc,
      disconnect,
      chainId,
      error,
      web3Library,
      isMetamask,
      isWalletConnect,
      isXdcPay,

      xdcPayAccount,
      xdcPayChainId,
      connected,
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
