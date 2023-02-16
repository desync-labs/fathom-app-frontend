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
import { useWeb3React } from "@web3-react/core";
import useSyncContext from "context/sync";
import useConnector from "context/connector";
import BigNumber from "bignumber.js";

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
  const { chainId } = useWeb3React();
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
      const [{ 0: fthmPrice }, { 0: wxdcPriceInUsPlus }, { 0: wxdcPriceInFXD }] =
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
            fxdTokenAddress,
            wxdcTokenAddress,
            library,
          )
        ]);

      const fxdPrice = BigNumber(wxdcPriceInUsPlus).multipliedBy(10 ** 18).dividedBy(wxdcPriceInFXD).toNumber();
      const formattedFthmPrice = BigNumber( fthmPrice ).multipliedBy(fxdPrice).dividedBy(10 ** 18);

      setFxdPrice(fxdPrice);
      setFthmPrice(formattedFthmPrice.toNumber());
      setWxdcPrice(wxdcPriceInUsPlus);
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
