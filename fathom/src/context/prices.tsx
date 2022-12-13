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
  const { stakingStore } = useStores();
  const { chainId } = useWeb3React();
  const [fxdPrice, setFxdPrice] = useState(0);
  const [wxdcPrice, setWxdcPrice] = useState(0);
  const [fthmPrice, setFthmPrice] = useState(0);

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
    // @ts-ignore
    const [{ 0: fxdPrice }, { 0: fthmPrice }, { 0: wxdcPrice }] =
      await Promise.all([
        stakingStore.getPairPrice(usdtTokenAddress, fxdTokenAddress),
        stakingStore.getPairPrice(usdtTokenAddress, fthmTokenAddress),
        stakingStore.getPairPrice(usdtTokenAddress, wxdcTokenAddress),
      ]);

    setFxdPrice(fxdPrice);
    setFthmPrice(fthmPrice);
    setWxdcPrice(wxdcPrice);
  }, [
    stakingStore,
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
  }, []);

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
      "useMetaMask hook must be used with a MetaMaskProvider component"
    );
  }

  return context;
};

export default usePricesContext;
