import { useEffect, useState } from "react";
import { IVaultPosition } from "fathom-sdk";
import BigNumber from "bignumber.js";

interface UseVaultListItemProps {
  vaultPosition: IVaultPosition | null | undefined;
}

export enum VaultInfoTabs {
  POSITION,
  ABOUT,
  STRATEGIES,
}

const useVaultListItem = ({ vaultPosition }: UseVaultListItemProps) => {
  const [extended, setExtended] = useState<boolean>(true);
  const [manageVault, setManageVault] = useState<boolean>(false);
  const [newVaultDeposit, setNewVaultDeposit] = useState<boolean>(false);
  const [activeVaultInfoTab, setActiveVaultInfoTab] = useState<VaultInfoTabs>(
    vaultPosition && BigNumber(vaultPosition.balanceShares).isGreaterThan(0)
      ? VaultInfoTabs.POSITION
      : VaultInfoTabs.ABOUT
  );

  useEffect(() => {
    if (
      vaultPosition &&
      BigNumber(vaultPosition.balanceShares).isGreaterThan(0)
    ) {
      setActiveVaultInfoTab(VaultInfoTabs.POSITION);
    } else if (activeVaultInfoTab === VaultInfoTabs.POSITION) {
      setActiveVaultInfoTab(VaultInfoTabs.ABOUT);
    }
  }, [vaultPosition]);

  return {
    manageVault,
    newVaultDeposit,
    extended,
    activeVaultInfoTab,
    setActiveVaultInfoTab,
    setExtended,
    setManageVault,
    setNewVaultDeposit,
  };
};

export default useVaultListItem;
