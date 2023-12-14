import { useState } from "react";

const useVaultListItem = () => {
  const [extended, setExtended] = useState<boolean>(true);
  const [manageVault, setManageVault] = useState<boolean>(false);
  const [newVaultDeposit, setNewVaultDeposit] = useState<boolean>(false);

  return {
    manageVault,
    newVaultDeposit,
    extended,
    setExtended,
    setManageVault,
    setNewVaultDeposit,
  };
};

export default useVaultListItem;
