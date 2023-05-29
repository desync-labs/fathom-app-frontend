import {
  createContext,
  FC,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { SmartContractFactory } from "config/SmartContractFactory";
import { useStores } from "stores";
import useSyncContext from "context/sync";
import useConnector from "context/connector";

type PricesProviderType = {
  children: ReactElement;
};

type UsePricesContextReturn = {
  fxdPrice: number;
  wxdcPrice: number;
  fthmPrice: number;
};

// @ts-ignore
export const PricesContext = createContext<UseStakingViewType>(null);

export const PricesProvider: FC<PricesProviderType> = ({ children }) => {
  const { stakingService, centralizedOracleService } = useStores();
  const { chainId, library } = useConnector();
  const [fxdPrice, setFxdPrice] = useState<number>(0);
  const [wxdcPrice, setWxdcPrice] = useState<number>(0);
  const [fthmPrice, setFthmPrice] = useState<number>(0);

  const { syncDao, prevSyncDao, syncFXD, prevSyncFxd } = useSyncContext();

  const fthmTokenAddress = useMemo(() => {
    return SmartContractFactory.FthmToken(chainId!).address;
  }, [chainId]);

  const usdtTokenAddress = useMemo(() => {
    return SmartContractFactory.USDT(chainId!).address;
  }, [chainId]);

  const fxdTokenAddress = useMemo(() => {
    return SmartContractFactory.FathomStableCoin(chainId!).address;
  }, [chainId]);

  const wxdcTokenAddress = useMemo(() => {
    return SmartContractFactory.WXDC(chainId!).address;
  }, [chainId]);

  const fetchPairPrices = useCallback(async () => {
    if (library) {
      try {
        if (process.env.REACT_APP_ENV !== "prod") {
          stakingService.getPairPrice(
            fxdTokenAddress,
            fthmTokenAddress,
            library
          ).then((fthmPrice) => {
            console.log('Price for pair FTHM/FXD', (fthmPrice as any)[0])
            setFthmPrice((fthmPrice as any)[0]);
          }).catch((e) => {
            console.log('Pair FTHM/FXD not exists on DEX')
          });
        }

        (process.env.REACT_APP_ENV === "prod" ? stakingService.getPairPrice(
          wxdcTokenAddress,
          usdtTokenAddress,
          library
        ) : stakingService.getPairPrice(
          usdtTokenAddress,
          wxdcTokenAddress,
          library
        )).then((wxdcPrice) => {
          console.log('Price for pair USDT/WXDC', (wxdcPrice as any)[0])
          setWxdcPrice((wxdcPrice as any)[0]);
        }).catch((e) => {
          console.log('Pair USDT/WXDC not exists on DEX')
        });


        (process.env.REACT_APP_ENV === "prod" ? stakingService.getPairPrice(
          fxdTokenAddress,
          usdtTokenAddress,
          library
        ) : stakingService.getPairPrice(
          usdtTokenAddress,
          fxdTokenAddress,
          library
        )).then((fxdPrice) => {
          console.log('Price for pair USDT/FXD', (fxdPrice as any)[0])
          setFxdPrice((fxdPrice as any)[0]);
        }).catch((e) => {
          console.log('Pair USDT/FXD not exists on DEX')
        });

        centralizedOracleService.cryptocompareConvertXdcUsdt().then((centralizedPrice) => {
          console.log(centralizedPrice);
        });
      } catch (e: any) {
        console.log(e);
      }
    }
  }, [
    stakingService,
    centralizedOracleService,
    usdtTokenAddress,
    fthmTokenAddress,
    fxdTokenAddress,
    wxdcTokenAddress,
    library,
    setFxdPrice,
    setFthmPrice,
    setWxdcPrice
  ]);

  useEffect(() => {
    fetchPairPrices();
  }, [fetchPairPrices]);

  useEffect(() => {
    if ((syncFXD && !prevSyncFxd) || (syncDao && !prevSyncDao)) {
      fetchPairPrices();
    }
  }, [syncFXD, prevSyncFxd, syncDao, prevSyncDao, fetchPairPrices]);

  const values = useMemo(() => {
    return {
      fxdPrice,
      wxdcPrice,
      fthmPrice
    };
  }, [fxdPrice, wxdcPrice, fthmPrice]);

  return (
    <PricesContext.Provider value={values}>{children}</PricesContext.Provider>
  );
};

const usePricesContext = (): UsePricesContextReturn => {
  const context = useContext(PricesContext);

  if (context === undefined) {
    throw new Error(
      "usePricesContext hook must be used with a PricesContext component"
    );
  }

  return context;
};

export default usePricesContext;
