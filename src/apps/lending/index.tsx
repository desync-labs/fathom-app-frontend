import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

import { Outlet } from "react-router-dom";

import BorrowModal from "apps/lending/components/transactions/Borrow/BorrowModal";

import CollateralChangeModal from "apps/lending/components/transactions/CollateralChange/CollateralChangeModal";
import EmodeModal from "apps/lending/components/transactions/Emode/EmodeModal";
import FaucetModal from "apps/lending/components/transactions/Faucet/FaucetModal";
import RateSwitchModal from "apps/lending/components/transactions/RateSwitch/RateSwitchModal";
import RepayModal from "apps/lending/components/transactions/Repay/RepayModal";
import SupplyModal from "apps/lending/components/transactions/Supply/SupplyModal";
import WithdrawModal from "apps/lending/components/transactions/Withdraw/WithdrawModal";
import ClaimRewardsModal from "apps/lending/components/transactions/ClaimRewards/ClaimRewardsModal";
import SwapModal from "apps/lending/components/transactions/Swap/SwapModal";
import DebtSwitchModal from "apps/lending/components/transactions/DebtSwitch/DebtSwitchModal";

export const queryClient = new QueryClient();

const LendingIndexComponent: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Web3ContextProvider>
        <AddressBlocked>
          <PermissionProvider>
            <ModalContextProvider>
              <BackgroundDataProvider>
                <AppDataProvider>
                  <GasStationProvider>
                    <SharedDependenciesProvider>
                      <Outlet />
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
      </Web3ContextProvider>
    </QueryClientProvider>
  );
};

export default LendingIndexComponent;
