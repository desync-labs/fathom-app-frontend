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
import { DEFAULT_CHAIN_ID } from "utils/Constants";
import BigNumber from "bignumber.js";
import moment from "moment";

type PricesProviderType = {
  children: ReactElement;
};

export type UsePricesContextReturn = {
  fxdPrice: string;
  xdcPrice: string;
  fthmPrice: string;
  prevXdcPrice: string | null;
};

export const PricesContext = createContext<UsePricesContextReturn>(
  {} as UsePricesContextReturn
);

export const PricesProvider: FC<PricesProviderType> = ({ children }) => {
  const { stakingService, oracleService } = useServices();
  const { chainId } = useConnector();
  const { provider } = useServices();

  const [fxdPrice, setFxdPrice] = useState<string>("0");
  const [xdcPrice, setXdcPrice] = useState<string>("0");
  const [prevXdcPrice, setPrevXdcPrice] = useState<string | null>(null);
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
        let fthmPromise;

        if (process.env.REACT_APP_ENV === "prod") {
          fthmPromise = stakingService.getPairPrice(
            fthmTokenAddress,
            wxdcTokenAddress
          );
        } else {
          fthmPromise = stakingService.getPairPrice(
            fxdTokenAddress,
            fthmTokenAddress
          );
        }

        const xdcUsdtPromise = oracleService.getXdcPrice();

        const xdcFxdPromise = stakingService.getPairPrice(
          fxdTokenAddress,
          wxdcTokenAddress
        );

        Promise.all([fthmPromise, xdcUsdtPromise, xdcFxdPromise])
          .then(([fthmPrice, xdcUsdtPrice, xdcFxdPrice]) => {
            const fxdPrice = BigNumber(xdcFxdPrice[1].toString())
              .dividedBy(xdcUsdtPrice[1].toString())
              .multipliedBy(10 ** 18)
              .toString();

            setXdcPrice(xdcUsdtPrice[0].toString());
            setFxdPrice(fxdPrice);

            const prevPriceData = localStorage.getItem("prevPrice");
            const startOfDay = moment().startOf("day").utc();
            const now = Date.now() / 1000;

            if (!prevPriceData) {
              localStorage.setItem(
                "prevPrice",
                JSON.stringify({
                  value: xdcUsdtPrice[0].toString(),
                  time: now,
                })
              );
            } else {
              const parsedData = JSON.parse(prevPriceData) as {
                value: string;
                time: string;
              };

              if (BigNumber(parsedData.time).isLessThan(startOfDay.unix())) {
                localStorage.setItem(
                  "prevPrice",
                  JSON.stringify({
                    value: xdcUsdtPrice[0].toString(),
                    time: now,
                  })
                );
              } else {
                setPrevXdcPrice(parsedData.value);
              }
            }

            let fthmPriceValue: string;
            if (process.env.REACT_APP_ENV === "prod") {
              fthmPriceValue = BigNumber(xdcUsdtPrice[0].toString())
                .multipliedBy(
                  BigNumber(fthmPrice[0].toString()).dividedBy(10 ** 18)
                )
                .toString();
            } else {
              fthmPriceValue = fthmPrice[0].toString();
            }

            setFthmPrice(fthmPriceValue);

            console.log({
              "fthm/usdt": fthmPriceValue,
              "fxd/usdt": fxdPrice,
              "xdc/usdt": xdcUsdtPrice[0].toString(),
            });
          })
          .catch((e) => {
            console.log("Pairs not exists on DEX", e);
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
    setXdcPrice,
  ]);

  useEffect(() => {
    fetchPairPrices();
  }, [fetchPairPrices]);

  useEffect(() => {
    if ((syncFXD && !prevSyncFxd) || (syncDao && !prevSyncDao)) {
      fetchPairPrices();
    }
  }, [syncFXD, prevSyncFxd, syncDao, prevSyncDao]);

  const values = useMemo(() => {
    return {
      fxdPrice,
      xdcPrice,
      fthmPrice,
      prevXdcPrice,
    };
  }, [fxdPrice, xdcPrice, fthmPrice, prevXdcPrice]);

  return (
    <PricesContext.Provider value={values}>{children}</PricesContext.Provider>
  );
};

const usePricesContext = () => useContext(PricesContext);

export default usePricesContext;
