import {
  createContext,
  FC,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SmartContractFactory } from "fathom-contracts-helper";
import { useServices } from "context/services";
import useSyncContext from "context/sync";
import useConnector from "context/connector";

type PricesProviderType = {
  children: ReactElement;
};

export type UsePricesContextReturn = {
  fxdPrice: number;
  wxdcPrice: number;
  fthmPrice: number;
};

// @ts-ignore
export const PricesContext = createContext<UsePricesContextReturn>(
  {} as UsePricesContextReturn
);

export const PricesProvider: FC<PricesProviderType> = ({ children }) => {
  const { stakingService } = useServices();
  const { chainId, library } = useConnector();

  const [fxdPrice, setFxdPrice] = useState<number>(0);
  const [wxdcPrice, setWxdcPrice] = useState<number>(0);
  const [fthmPrice, setFthmPrice] = useState<number>(0);

  const { syncDao, prevSyncDao, syncFXD, prevSyncFxd } = useSyncContext();

  const fthmTokenAddress = useMemo(() => {
    return SmartContractFactory.FthmToken(chainId).address;
  }, [chainId]);

  const usdtTokenAddress = useMemo(() => {
    return SmartContractFactory.USDT(chainId).address;
  }, [chainId]);

  const fxdTokenAddress = useMemo(() => {
    return SmartContractFactory.FathomStableCoin(chainId).address;
  }, [chainId]);

  const wxdcTokenAddress = useMemo(() => {
    return SmartContractFactory.WXDC(chainId).address;
  }, [chainId]);

  const fetchPairPrices = useCallback(async () => {
    if (library) {
      try {
        if (process.env.REACT_APP_ENV !== "prod") {
          stakingService
            .getPairPrice(fxdTokenAddress, fthmTokenAddress)
            .then((fthmPrice) => {
              console.log("Price for pair FTHM/FXD", (fthmPrice as any)[0]);
              setFthmPrice((fthmPrice as any)[0]);
            })
            .catch(() => {
              console.log("Pair FTHM/FXD not exists on DEX");
            });
        }

        (process.env.REACT_APP_ENV === "prod"
          ? stakingService.getPairPrice(wxdcTokenAddress, usdtTokenAddress)
          : stakingService.getPairPrice(usdtTokenAddress, wxdcTokenAddress)
        )
          .then((wxdcPrice) => {
            console.log("Price for pair USDT/WXDC", (wxdcPrice as any)[0]);
            setWxdcPrice((wxdcPrice as any)[0]);
          })
          .catch(() => {
            console.log("Pair USDT/WXDC not exists on DEX");
          });

        (process.env.REACT_APP_ENV === "prod"
          ? stakingService.getPairPrice(fxdTokenAddress, usdtTokenAddress)
          : stakingService.getPairPrice(usdtTokenAddress, fxdTokenAddress)
        )
          .then((fxdPrice) => {
            console.log("Price for pair USDT/FXD", (fxdPrice as any)[0]);
            setFxdPrice((fxdPrice as any)[0]);
          })
          .catch(() => {
            console.log("Pair USDT/FXD not exists on DEX");
          });
      } catch (e: any) {
        console.log(e);
      }
    }
  }, [
    stakingService,
    usdtTokenAddress,
    fthmTokenAddress,
    fxdTokenAddress,
    wxdcTokenAddress,
    setFxdPrice,
    setFthmPrice,
    setWxdcPrice,
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
      fthmPrice,
    };
  }, [fxdPrice, wxdcPrice, fthmPrice]);

  return (
    <PricesContext.Provider value={values}>{children}</PricesContext.Provider>
  );
};

const usePricesContext = () => {
  const context = useContext(PricesContext);

  if (!context) {
    throw new Error(
      "usePricesContext hook must be used with a PricesContext component"
    );
  }

  return context;
};

export default usePricesContext;
