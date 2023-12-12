import { useState } from "react";

export enum VaultInfoTabs {
  POSITION,
  ABOUT,
  STRATEGIES,
}

const useVaultListItem = () => {
  const [extended, setExtended] = useState<boolean>(true);
  const [manageVault, setManageVault] = useState<boolean>(false);
  const [newVaultDeposit, setNewVaultDeposit] = useState<boolean>(false);
  const [activeVaultInfoTab, setActiveVaultInfoTab] = useState<VaultInfoTabs>(
    VaultInfoTabs.POSITION
  );

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
