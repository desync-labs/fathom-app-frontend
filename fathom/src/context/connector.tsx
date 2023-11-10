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
import { AbstractConnector } from "@web3-react/abstract-connector";
import Xdc3 from "xdc3";
import { useWeb3React } from "@web3-react/core";
import WalletConnectProvider from "@walletconnect/ethereum-provider";
import { ConnectorEvent } from "@web3-react/types";
import { useServices } from "context/services";
import {
  ChainId,
  injected,
  WalletConnect,
  xdcInjected,
} from "connectors/networks";

type ConnectorProviderType = {
  children: ReactElement;
};

export type UseConnectorReturnType = {
  connector: AbstractConnector | undefined;
  isActive: boolean;
  account: string;
  isLoading: boolean;
  connectMetamask: () => Promise<void>;
  connectXdcPay: () => Promise<void>;
  connectWalletConnect: () => Promise<void>;
  disconnect: () => Promise<void>;
  addERC20Token: (tokenData: ERC20TokenType) => Promise<boolean>;
  shouldDisable: boolean;
  chainId: ChainId;
  error: Error | undefined;
  library: Xdc3;
  isMetamask: boolean;
  isWalletConnect: boolean;
  isXdcPay: boolean;
  isDecentralizedState: boolean;
  isDecentralizedMode: boolean;
  isUserWhiteListed: boolean;
  isUserWrapperWhiteListed: boolean;
  isOpenPositionWhitelisted: boolean;
  allowStableSwap: boolean;
  allowStableSwapInProgress: boolean;
};

export type ERC20TokenType = {
  address: string;
  symbol: string;
  decimals: number;
  image?: string;
};

export const ConnectorContext = createContext<UseConnectorReturnType>(
  {} as UseConnectorReturnType
);

export const ConnectorProvider: FC<ConnectorProviderType> = ({ children }) => {
  const { connector, activate, account, active, deactivate, chainId, error } =
    useWeb3React();

  const { stableSwapService, positionService, provider } = useServices();

  const [isMetamask, setIsMetamask] = useState<boolean>(false);
  const [isWalletConnect, setIsWalletConnect] = useState<boolean>(false);
  const [isXdcPay, setIsXdcPay] = useState<boolean>(false);

  const [shouldDisable, setShouldDisable] = useState<boolean>(false); // Should disable connect button while connecting to MetaMask
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isDecentralizedState, setIsDecentralizedState] = useState<
    boolean | undefined
  >(undefined);
  const [isDecentralizedMode, setIsDecentralizedMode] = useState<
    boolean | undefined
  >(undefined);
  const [isUserWhiteListed, setIsUserWhitelisted] = useState<
    boolean | undefined
  >(undefined);
  const [isUserWrapperWhiteListed, setIsUserWrapperWhiteListed] =
    useState<boolean>(false);
  const [isOpenPositionWhitelisted, setIsOpenPositionWhitelisted] =
    useState<boolean>(true);

  const [allowStableSwapInProgress, setAllowStableSwapInProgress] =
    useState<boolean>(true);

  useEffect(() => {
    if (provider) {
      const { isMetaMask, isXDCPay } = (provider as any).currentProvider;
      const connected = sessionStorage.getItem("isConnected");

      if (isXDCPay || connected === "xdc-pay") {
        setIsXdcPay(true);
      } else if (isMetaMask || connected === "metamask") {
        setIsMetamask(true);
      } else {
        setIsXdcPay(false);
        setIsMetamask(false);
      }

      setIsWalletConnect(
        provider.currentProvider instanceof WalletConnectProvider
      );
    } else {
      setIsMetamask(false);
      setIsWalletConnect(false);
    }
  }, [provider, setIsMetamask, setIsWalletConnect]);

  useEffect(() => {
    if (chainId) {
      setAllowStableSwapInProgress(true);
      stableSwapService
        .isDecentralizedState()
        .then((isDecentralizedState: boolean) => {
          setIsDecentralizedState(isDecentralizedState);
          if (isDecentralizedState === false && account) {
            stableSwapService
              .isUserWhitelisted(account)
              .then((isWhitelisted: boolean) => {
                setAllowStableSwapInProgress(false);
                setIsUserWhitelisted(isWhitelisted);
              });
          } else {
            setAllowStableSwapInProgress(false);
          }
        });
      positionService
        .isDecentralizedMode()
        .then((isDecentralizedMode: boolean) => {
          setIsDecentralizedMode(isDecentralizedMode);
          if (isDecentralizedMode === false && account) {
            positionService
              .isWhitelisted(account)
              .then((isOpenPositionWhitelisted: boolean) => {
                setIsOpenPositionWhitelisted(isOpenPositionWhitelisted);
              });
          }
        });
    }

    if (account) {
      stableSwapService
        .usersWrapperWhitelist(account)
        .then((isWhitelisted: boolean) => {
          setIsUserWrapperWhiteListed(isWhitelisted);
        });
    }
  }, [
    chainId,
    account,
    provider,
    stableSwapService,
    positionService,
    setIsUserWrapperWhiteListed,
    setIsDecentralizedState,
    setIsUserWhitelisted,
    setAllowStableSwapInProgress,
  ]);

  const deactivateEvent = useCallback(() => {
    sessionStorage.removeItem("isConnected");
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
  const connectMetamask = useCallback(() => {
    setShouldDisable(true);
    return activate(injected).then(() => {
      setShouldDisable(false);
      sessionStorage.setItem("isConnected", "metamask");
      setIsMetamask(true);
    });
  }, [activate, setShouldDisable, setIsMetamask]);

  const connectXdcPay = useCallback(() => {
    setShouldDisable(true);
    return activate(xdcInjected).then(() => {
      setShouldDisable(false);
      sessionStorage.setItem("isConnected", "xdc-pay");
      setIsXdcPay(true);
    });
  }, [activate, setShouldDisable, setIsXdcPay]);

  const connectWalletConnect = useCallback(() => {
    setShouldDisable(true);
    return activate(WalletConnect).then(() => {
      setShouldDisable(false);
      sessionStorage.setItem("isConnected", "walletConnect");
      setIsWalletConnect(true);
    });
  }, [activate, setShouldDisable, setIsWalletConnect]);

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
    } else if (isConnected === "xdc-pay") {
      connectXdcPay().then(() => {
        setIsLoading(false);
      });
    }
  }, [connectMetamask, connectWalletConnect, connectXdcPay]);

  const allowStableSwap = useMemo(() => {
    return (
      isDecentralizedState ||
      (isDecentralizedState === false && isUserWhiteListed === true)
    );
  }, [isDecentralizedState, isUserWhiteListed]);

  const disconnect = useCallback(async () => {
    try {
      await deactivate();
      sessionStorage.removeItem("isConnected");
      setIsMetamask(false);
      setIsWalletConnect(false);
      setIsXdcPay(false);
    } catch (error) {
      console.log(`Error on disconnnect: ${error}`);
    }
  }, [deactivate, setIsMetamask, setIsWalletConnect]);

  const addERC20Token = useCallback(
    async ({
      address,
      symbol,
      decimals,
      image,
    }: ERC20TokenType): Promise<boolean> => {
      const injectedProvider = (window as any).ethereum;
      if (provider && account && window && injectedProvider) {
        await injectedProvider.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address,
              symbol,
              decimals,
              image,
            },
          },
        });
      }
      return false;
    },
    [provider, account]
  );

  const values = useMemo(
    () => ({
      addERC20Token,
      connector,
      isActive: active,
      account,
      isLoading,
      connectMetamask,
      connectXdcPay,
      connectWalletConnect,
      disconnect,
      shouldDisable,
      chainId,
      error,
      library: provider,
      isMetamask,
      isWalletConnect,
      isXdcPay,
      isDecentralizedState,
      isDecentralizedMode,
      isUserWhiteListed,
      isUserWrapperWhiteListed,
      isOpenPositionWhitelisted,
      allowStableSwap,
      allowStableSwapInProgress,
    }),
    [
      addERC20Token,
      provider,
      connector,
      active,
      isLoading,
      shouldDisable,
      account,
      connectMetamask,
      connectWalletConnect,
      connectXdcPay,
      disconnect,
      chainId,
      error,
      isMetamask,
      isWalletConnect,
      isXdcPay,
      isDecentralizedState,
      isDecentralizedMode,
      isUserWhiteListed,
      isUserWrapperWhiteListed,
      isOpenPositionWhitelisted,
      allowStableSwap,
      allowStableSwapInProgress,
    ]
  );

  return (
    // @ts-ignore
    <ConnectorContext.Provider value={values}>
      {children}
    </ConnectorContext.Provider>
  );
};

const useConnector = () => {
  const context = useContext(ConnectorContext);

  if (!context) {
    throw new Error(
      "useConnector hook must be used with a ConnectorProvider component"
    );
  }

  return context;
};

export default useConnector;
