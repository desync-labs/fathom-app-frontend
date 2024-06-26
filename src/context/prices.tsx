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
import { useServices } from "context/services";
import useSyncContext from "context/sync";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import useConnector from "context/connector";
import { ChainId } from "connectors/networks";

type PricesProviderType = {
  children: ReactElement;
};

export type UsePricesContextReturn = {
  fxdPrice: string;
  xdcPrice: string;
  fthmPrice: string;
  prevXdcPrice: string | null;
  fetchPricesInProgress: boolean;
};

export const PricesContext = createContext<UsePricesContextReturn>(
  {} as UsePricesContextReturn
);

export const PricesProvider: FC<PricesProviderType> = ({ children }) => {
  const { oracleService, provider } = useServices();
  const { chainId } = useConnector();

  const [fxdPrice, setFxdPrice] = useState<string>("0");
  const [xdcPrice, setXdcPrice] = useState<string>("0");
  const [prevXdcPrice, setPrevXdcPrice] = useState<string | null>(null);
  const [fthmPrice, setFthmPrice] = useState<string>("0");
  const [fetchPricesInProgress, setFetchPricesInProgress] =
    useState<boolean>(false);

  const {
    syncDao,
    prevSyncDao,
    syncFXD,
    prevSyncFxd,
    syncVault,
    prevSyncVault,
    syncDex,
    prevSyncDex,
  } = useSyncContext();

  const fetchPairPrices = useCallback(async () => {
    if (provider) {
      try {
        const xdcPromise =
          !chainId || [ChainId.XDC, ChainId.AXDC].includes(chainId)
            ? oracleService.getXdcPrice()
            : Promise.resolve([new BigNumber(0)]);

        setFetchPricesInProgress(true);

        const pricesPromise = fetch(
          process.env.REACT_APP_PRICE_FEED_URL as string
        )
          .then((data) => data.json())
          .then((response) => {
            return {
              fxd: BigNumber(response["fathom-dollar"]["usd"])
                .multipliedBy(10 ** 18)
                .toString(),
              fthm: BigNumber(response["fathom-protocol"]["usd"])
                .multipliedBy(10 ** 18)
                .toString(),
            };
          });

        Promise.all([pricesPromise, xdcPromise])
          .then(([prices, xdcPrice]) => {
            setFxdPrice(prices.fxd);
            setFthmPrice(prices.fthm);
            setXdcPrice(xdcPrice[0].toString());

            const prevPriceData = localStorage.getItem("prevPrice");
            const startOfDay = dayjs().startOf("day").unix();
            const now = Date.now() / 1000;

            if (!prevPriceData) {
              localStorage.setItem(
                "prevPrice",
                JSON.stringify({
                  value: xdcPrice[0].toString(),
                  time: now,
                })
              );
            } else {
              const parsedData = JSON.parse(prevPriceData) as {
                value: string;
                time: string;
              };

              if (BigNumber(parsedData.time).isLessThan(startOfDay)) {
                localStorage.setItem(
                  "prevPrice",
                  JSON.stringify({
                    value: xdcPrice[0].toString(),
                    time: now,
                  })
                );
              } else {
                setPrevXdcPrice(parsedData.value);
              }
            }

            console.log({
              "fthm/usdt": prices.fthm,
              "fxd/usdt": prices.fxd,
              "xdc/usdt": xdcPrice[0].toString(),
            });
          })
          .catch((e) => {
            console.log("Can`t retrieve prices", e);
          })
          .finally(() => setFetchPricesInProgress(false));
      } catch (e: any) {
        console.log(e);
      }
    }
  }, [
    chainId,
    provider,
    setFxdPrice,
    setFthmPrice,
    setXdcPrice,
    setFetchPricesInProgress,
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      !fetchPricesInProgress && fetchPairPrices();
    }, 100);

    return () => timeout && clearTimeout(timeout);
  }, [fetchPairPrices]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (
      (syncFXD && !prevSyncFxd) ||
      (syncDao && !prevSyncDao) ||
      (syncVault && !prevSyncVault) ||
      (syncDex && !prevSyncDex)
    ) {
      timeout = setTimeout(() => {
        fetchPairPrices();
      }, 300);
    }

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [
    syncFXD,
    prevSyncFxd,
    syncDao,
    prevSyncDao,
    syncVault,
    prevSyncVault,
    syncDex,
    prevSyncDex,
  ]);

  const values = useMemo(() => {
    return {
      fxdPrice,
      xdcPrice,
      fthmPrice,
      prevXdcPrice,
      fetchPricesInProgress,
    };
  }, [fxdPrice, xdcPrice, fthmPrice, prevXdcPrice, fetchPricesInProgress]);

  return (
    <PricesContext.Provider value={values}>{children}</PricesContext.Provider>
  );
};

const usePricesContext = () => useContext(PricesContext);

export default usePricesContext;
