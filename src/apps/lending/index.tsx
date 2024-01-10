import loadable from "@loadable/component";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Web3ReactProvider } from "@web3-react/core";
import { providers } from "fathom-ethers";
import { useEffect } from "react";
import { AddressBlocked } from "apps/lending/components/AddressBlocked";
import { TransactionEventHandler } from "apps/lending/components/TransactionEventHandler";
import { GasStationProvider } from "apps/lending/components/transactions/GasStation/GasStationProvider";
import { BackgroundDataProvider } from "apps/lending/hooks/app-data-provider/BackgroundDataProvider";
import { AppDataProvider } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { ModalContextProvider } from "apps/lending/hooks/useModal";
import { PermissionProvider } from "apps/lending/hooks/usePermissions";
import { Web3ContextProvider } from "apps/lending/libs/web3-data-provider/Web3Provider";
import { useRootStore } from "apps/lending/store/root";
import { SharedDependenciesProvider } from "apps/lending/ui-config/SharedDependenciesProvider";

import { AppGlobalStyles } from "apps/lending/layouts/AppGlobalStyles";
import { LanguageProvider } from "apps/lending/libs/LanguageProvider";
import { MainLayout } from "apps/lending/layouts/MainLayout";
import { Outlet } from "react-router-dom";

const BorrowModal = loadable(
  () => import("./components/transactions/Borrow/BorrowModal")
);

const ClaimRewardsModal = loadable(
  () => import("./components/transactions/ClaimRewards/ClaimRewardsModal")
);
const CollateralChangeModal = loadable(
  () =>
    import("./components/transactions/CollateralChange/CollateralChangeModal")
);
const DebtSwitchModal = loadable(
  () => import("./components/transactions/DebtSwitch/DebtSwitchModal")
);
const EmodeModal = loadable(
  () => import("./components/transactions/Emode/EmodeModal")
);
const FaucetModal = loadable(
  () => import("./components/transactions/Faucet/FaucetModal")
);
const RateSwitchModal = loadable(
  () => import("./components/transactions/RateSwitch/RateSwitchModal")
);
const RepayModal = loadable(
  () => import("./components/transactions/Repay/RepayModal")
);
const SupplyModal = loadable(
  () => import("./components/transactions/Supply/SupplyModal")
);
const SwapModal = loadable(
  () => import("./components/transactions/Swap/SwapModal")
);
const WithdrawModal = loadable(
  () => import("./components/transactions/Withdraw/WithdrawModal")
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getWeb3Library(provider: any): providers.Web3Provider {
  const library = new providers.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

export const queryClient = new QueryClient();

export default function MyApp() {
  const initializeMixpanel = useRootStore((store) => store.initializeMixpanel);

  const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL;
  useEffect(() => {
    if (MIXPANEL_TOKEN) {
      initializeMixpanel();
    } else {
      console.log("no analytics tracking");
    }
  }, [MIXPANEL_TOKEN, initializeMixpanel]);

  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <Web3ReactProvider getLibrary={getWeb3Library}>
          <Web3ContextProvider>
            <AppGlobalStyles>
              <AddressBlocked>
                <PermissionProvider>
                  <ModalContextProvider>
                    <BackgroundDataProvider>
                      <AppDataProvider>
                        <GasStationProvider>
                          <SharedDependenciesProvider>
                            <MainLayout>
                              <Outlet />
                            </MainLayout>
                            <SupplyModal />
                            <WithdrawModal />
                            <BorrowModal />
                            <RepayModal />
                            <CollateralChangeModal />
                            <RateSwitchModal />
                            <DebtSwitchModal />
                            <ClaimRewardsModal />
                            <EmodeModal />
                            <SwapModal />
                            <FaucetModal />
                            <TransactionEventHandler />
                          </SharedDependenciesProvider>
                        </GasStationProvider>
                      </AppDataProvider>
                    </BackgroundDataProvider>
                  </ModalContextProvider>
                </PermissionProvider>
              </AddressBlocked>
            </AppGlobalStyles>
          </Web3ContextProvider>
        </Web3ReactProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </LanguageProvider>
  );
}
