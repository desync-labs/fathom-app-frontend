import { useCallback, useEffect, useMemo, useState } from "react";
import { IVault, IVaultPosition } from "fathom-sdk";
import BigNumber from "bignumber.js";
import { useServices } from "context/services";

interface UseVaultListItemProps {
  vaultPosition: IVaultPosition | null | undefined;
  vault: IVault;
}

export enum VaultInfoTabs {
  POSITION,
  ABOUT,
  STRATEGIES,
}

const useVaultListItem = ({ vaultPosition, vault }: UseVaultListItemProps) => {
  const [extended, setExtended] = useState<boolean>(true);
  const [manageVault, setManageVault] = useState<boolean>(false);
  const [newVaultDeposit, setNewVaultDeposit] = useState<boolean>(false);
  const [balanceToken, setBalanceToken] = useState<string>("0");

  const [activeVaultInfoTab, setActiveVaultInfoTab] = useState<VaultInfoTabs>(
    vaultPosition && BigNumber(vaultPosition.balanceShares).isGreaterThan(0)
      ? VaultInfoTabs.POSITION
      : VaultInfoTabs.ABOUT
  );

  const { vaultService } = useServices();

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

  const fetchBalanceToken = useCallback(() => {
    vaultService
      .previewRedeem(
        BigNumber(vaultPosition?.balanceShares as string)
          .dividedBy(10 ** 18)
          .toString(),
        vault.id
      )
      .then((balanceToken: string) => {
        setBalanceToken(balanceToken);
      });
  }, [vaultService, vault.id, vaultPosition, setBalanceToken]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (vaultPosition && vault) {
      fetchBalanceToken();
      interval = setInterval(fetchBalanceToken, 15 * 1000);
    }
    return () => clearInterval(interval);
  }, [vaultPosition, vault, fetchBalanceToken]);

  const balanceEarned = useMemo(() => {
    return BigNumber(balanceToken || "0")
      .minus(vaultPosition?.balancePosition as string)
      .dividedBy(10 ** 18)
      .toNumber();
  }, [vaultPosition, balanceToken]);

  return {
    balanceEarned,
    balanceToken,
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
