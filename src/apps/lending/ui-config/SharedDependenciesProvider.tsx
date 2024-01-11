import { createContext, FC, ReactNode, useContext } from "react";
import { WalletBalanceService } from "apps/lending/services/WalletBalanceService";
import { useRootStore } from "apps/lending/store/root";
import { getProvider } from "apps/lending/utils/marketsAndNetworksConfig";
import invariant from "tiny-invariant";

interface SharedDependenciesContext {
  poolTokensBalanceService: WalletBalanceService;
}

const SharedDependenciesContext =
  createContext<SharedDependenciesContext | null>(null);

export const SharedDependenciesProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const currentMarketData = useRootStore((state) => state.currentMarketData);

  // providers
  const currentProvider = getProvider(currentMarketData.chainId);

  // services
  const poolTokensBalanceService = new WalletBalanceService(
    currentProvider,
    currentMarketData.addresses.WALLET_BALANCE_PROVIDER,
    currentMarketData.chainId
  );

  return (
    <SharedDependenciesContext.Provider
      value={{
        poolTokensBalanceService,
      }}
    >
      {children}
    </SharedDependenciesContext.Provider>
  );
};

export const useSharedDependencies = () => {
  const context = useContext(SharedDependenciesContext);
  invariant(
    context,
    "Component should be wrapper inside a <SharedDependenciesProvider />"
  );
  return context;
};
