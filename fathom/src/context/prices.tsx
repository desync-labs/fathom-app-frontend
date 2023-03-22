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
  const { stakingService } = useStores();
  const { chainId } = useConnector();
  const { library } = useConnector()
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
      // @ts-ignore
      const [{ 0: fthmPrice }, { 0: wxdcPrice }, { 0: fxdPrice }] =
        await Promise.all([
          stakingService.getPairPrice(
            fxdTokenAddress,
            fthmTokenAddress,
            library
          ),
          stakingService.getPairPrice(
            usdtTokenAddress,
            wxdcTokenAddress,
            library
          ),
          stakingService.getPairPrice(
            usdtTokenAddress,
            fxdTokenAddress,
            library,
          )
        ]);

      setFxdPrice(fxdPrice);
      setFthmPrice(fthmPrice);
      setWxdcPrice(wxdcPrice);
    }
  }, [
    stakingService,
    usdtTokenAddress,
    fthmTokenAddress,
    fxdTokenAddress,
    wxdcTokenAddress,
    library,
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
