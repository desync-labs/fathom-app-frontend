import {
  createContext,
  Dispatch,
  FC,
  ReactElement,
  SetStateAction,
  useContext,
} from "react";
import useVaultDetail, {
  IVaultStrategyHistoricalApr,
  VaultInfoTabs,
} from "hooks/useVaultDetail";
import { IVault, IVaultPosition, IVaultStrategyReport } from "fathom-sdk";
import { FunctionFragment } from "@into-the-fathom/abi";

export type VaultContextType = {
  vaultId: string;
  children: ReactElement;
};

export type UseVaultContextReturnType = {
  vault: IVault | null;
  vaultLoading: boolean;
  vaultPosition: IVaultPosition | null;
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
};

export const VaultContext = createContext<UseVaultContextReturnType>(
  {} as UseVaultContextReturnType
);

export const VaultProvider: FC<VaultContextType> = ({ vaultId, children }) => {
  const values = useVaultDetail({ vaultId });

  return (
    <VaultContext.Provider value={values}>{children}</VaultContext.Provider>
  );
};

const useVaultContext = () => useContext(VaultContext);

export default useVaultContext;
