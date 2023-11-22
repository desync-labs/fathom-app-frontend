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
import { SmartContractFactory } from "fathom-sdk";
import { useServices } from "context/services";
import useSyncContext from "context/sync";
import useConnector from "context/connector";
import { DEFAULT_CHAIN_ID } from "helpers/Constants";

type PricesProviderType = {
  children: ReactElement;
};

export type UsePricesContextReturn = {
  fxdPrice: string;
  wxdcPrice: string;
  fthmPrice: string;
};

// @ts-ignore
export const PricesContext = createContext<UsePricesContextReturn>(
  {} as UsePricesContextReturn
);

export const PricesProvider: FC<PricesProviderType> = ({ children }) => {
  const { stakingService } = useServices();
  const { chainId } = useConnector();
  const { provider } = useServices();

  const [fxdPrice, setFxdPrice] = useState<string>("0");
  const [wxdcPrice, setWxdcPrice] = useState<string>("0");
  const [fthmPrice, setFthmPrice] = useState<string>("0");

  const { syncDao, prevSyncDao, syncFXD, prevSyncFxd } = useSyncContext();

  const fthmTokenAddress = useMemo(() => {
    return SmartContractFactory.FthmToken(chainId ? chainId : DEFAULT_CHAIN_ID)
      .address;
  }, [chainId]);

  const usdtTokenAddress = useMemo(() => {
    return SmartContractFactory.USDT(chainId ? chainId : DEFAULT_CHAIN_ID)
      .address;
  }, [chainId]);

  const fxdTokenAddress = useMemo(() => {
    return SmartContractFactory.FathomStableCoin(
      chainId ? chainId : DEFAULT_CHAIN_ID
    ).address;
  }, [chainId]);

  const wxdcTokenAddress = useMemo(() => {
    return SmartContractFactory.WXDC(chainId ? chainId : DEFAULT_CHAIN_ID)
      .address;
  }, [chainId]);

  const fetchPairPrices = useCallback(async () => {
    if (provider) {
      try {
        if (process.env.REACT_APP_ENV !== "prod") {
          stakingService
            .getPairPrice(fxdTokenAddress, fthmTokenAddress)
            .then((fthmPrice) => {
              console.log("Price for pair FTHM/FXD", fthmPrice[0].toString());
              setFthmPrice(fthmPrice[0].toString());
            })
            .catch((e) => {
              console.log(e);
              console.log("Pair FTHM/FXD not exists on DEX");
            });
        }

        (process.env.REACT_APP_ENV === "prod"
          ? stakingService.getPairPrice(wxdcTokenAddress, usdtTokenAddress)
          : stakingService.getPairPrice(usdtTokenAddress, wxdcTokenAddress)
        )
          .then((wxdcPrice) => {
            console.log("Price for pair USDT/WXDC", wxdcPrice[0].toString());
            setWxdcPrice(wxdcPrice[0].toString());
          })
          .catch(() => {
            console.log("Pair USDT/WXDC not exists on DEX");
          });

        (process.env.REACT_APP_ENV === "prod"
          ? stakingService.getPairPrice(fxdTokenAddress, usdtTokenAddress)
          : stakingService.getPairPrice(usdtTokenAddress, fxdTokenAddress)
        )
          .then((fxdPrice) => {
            console.log("Price for pair USDT/FXD", fxdPrice[0].toString());
            setFxdPrice(fxdPrice[0].toString());
          })
          .catch(() => {
            console.log("Pair USDT/FXD not exists on DEX");
          });
      } catch (e: any) {
        console.log(e);
      }
    }
  }, [
    provider,
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
