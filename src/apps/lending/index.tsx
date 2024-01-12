import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { FC } from "react";
import { AddressBlocked } from "apps/lending/components/AddressBlocked";
import { TransactionEventHandler } from "apps/lending/components/TransactionEventHandler";
import { GasStationProvider } from "apps/lending/components/transactions/GasStation/GasStationProvider";
import { BackgroundDataProvider } from "apps/lending/hooks/app-data-provider/BackgroundDataProvider";
import { AppDataProvider } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { ModalContextProvider } from "apps/lending/hooks/useModal";
import { PermissionProvider } from "apps/lending/hooks/usePermissions";
import { Web3ContextProvider } from "apps/lending/libs/web3-data-provider/Web3Provider";
import { SharedDependenciesProvider } from "apps/lending/ui-config/SharedDependenciesProvider";

import { AppGlobalStyles } from "apps/lending/layouts/AppGlobalStyles";
import { Outlet } from "react-router-dom";

import BorrowModal from "apps/lending/components/transactions/Borrow/BorrowModal";

import ClaimRewardsModal from "apps/lending/components/transactions/ClaimRewards/ClaimRewardsModal";
import CollateralChangeModal from "apps/lending/components/transactions/CollateralChange/CollateralChangeModal";
import DebtSwitchModal from "apps/lending/components/transactions/DebtSwitch/DebtSwitchModal";
import EmodeModal from "apps/lending/components/transactions/Emode/EmodeModal";
import FaucetModal from "apps/lending/components/transactions/Faucet/FaucetModal";
import RateSwitchModal from "apps/lending/components/transactions/RateSwitch/RateSwitchModal";
import RepayModal from "apps/lending/components/transactions/Repay/RepayModal";
import SupplyModal from "apps/lending/components/transactions/Supply/SupplyModal";
import SwapModal from "apps/lending/components/transactions/Swap/SwapModal";
import WithdrawModal from "apps/lending/components/transactions/Withdraw/WithdrawModal";
import { LendingViewProps } from "components/Dashboard/LendingView";
import { AppsSharedProvider } from "context/appsShared";

export const queryClient = new QueryClient();

const LendingIndexComponent: FC<LendingViewProps> = ({ openConnectorMenu }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Web3ContextProvider>
        <AppGlobalStyles>
          <AddressBlocked>
            <PermissionProvider>
              <ModalContextProvider>
                <BackgroundDataProvider>
                  <AppDataProvider>
                    <GasStationProvider>
                      <SharedDependenciesProvider>
                        <AppsSharedProvider
                          openConnectorMenu={openConnectorMenu}
                        >
                          <Outlet />
                        </AppsSharedProvider>
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
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default LendingIndexComponent;
