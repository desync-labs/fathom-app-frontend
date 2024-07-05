import {
  createContext,
  Dispatch,
  FC,
  memo,
  ReactElement,
  SetStateAction,
  useContext,
} from "react";
import useVaultDetail, {
  IVaultStrategyHistoricalApr,
  VaultInfoTabs,
} from "hooks/Vaults/useVaultDetail";
import { IVault, IVaultPosition, IVaultStrategyReport } from "fathom-sdk";
import { FunctionFragment } from "@into-the-fathom/abi";

export type VaultContextType = {
  vaultId: string | undefined;
  children: ReactElement;
  urlParams: string | undefined;
};

export type UseVaultContextReturnType = {
  vault: IVault;
  vaultLoading: boolean;
  vaultPosition: IVaultPosition;
  vaultPositionLoading: boolean;
  reports: Record<string, IVaultStrategyReport[]>;
  historicalApr: Record<string, IVaultStrategyHistoricalApr[]>;
  balanceEarned: number;
  balanceToken: string;
  protocolFee: number;
  performanceFee: number;
  activeVaultInfoTab: VaultInfoTabs;
  vaultMethods: FunctionFragment[];
  strategyMethods: FunctionFragment[];
  setActiveVaultInfoTab: Dispatch<SetStateAction<VaultInfoTabs>>;
  managedStrategiesIds: string[];
  isUserManager: boolean;
  isReportsLoaded: boolean;
  isUserKycPassed: boolean;
  isTfVaultType: boolean;
  tfVaultDepositEndDate: string | null;
  tfVaultLockEndDate: string | null;
  tfVaultDepositLimit: string;
  activeTfPeriod: number;
  minimumDeposit: number;
  setMinimumDeposit: Dispatch<SetStateAction<number>>;
  handleWithdrawAll: () => void;
  isWithdrawAllLoading: boolean;
  tfVaultDepositEndTimeLoading: boolean;
  tfVaultLockEndTimeLoading: boolean;
  showWithdrawAllButton: boolean;
  isShowWithdrawAllButtonLoading: boolean;
  setActiveVaultInfoTabHandler: (value: VaultInfoTabs) => void;
  urlParams: string | undefined;
};

export const VaultContext = createContext<UseVaultContextReturnType>(
  {} as UseVaultContextReturnType
);

export const VaultProvider: FC<VaultContextType> = memo(
  ({ vaultId, children, urlParams }) => {
    const values = useVaultDetail({ vaultId, urlParams });

    return (
      <VaultContext.Provider value={values}>{children}</VaultContext.Provider>
    );
  }
);

const useVaultContext = () => useContext(VaultContext);

export default useVaultContext;
