import { createContext, FC, ReactNode, useContext } from "react";
import {
  usePoolDataSubscription,
  useIncentiveDataSubscription,
} from "apps/lending/store/root";

interface BackgroundDataProviderContextType {
  refetchIncentiveData?: () => Promise<void>;
  refetchPoolData?: () => Promise<void> | Promise<void[]>;
}

const BackgroundDataProviderContext =
  createContext<BackgroundDataProviderContextType>(
    {} as BackgroundDataProviderContextType
  );

/**
 * Naive provider that subscribes to different data sources.
 * This context provider will run useEffects that relate to instantiating subscriptions as a poll every 60s to consistently fetch data from on-chain and update the Zustand global store.
 * @returns
 */
export const BackgroundDataProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const refetchPoolData = usePoolDataSubscription();
  const refetchIncentiveData = useIncentiveDataSubscription();
  return (
    <BackgroundDataProviderContext.Provider
      value={{ refetchPoolData, refetchIncentiveData }}
    >
      {children}
    </BackgroundDataProviderContext.Provider>
  );
};

export const useBackgroundDataProvider = () =>
  useContext(BackgroundDataProviderContext);
