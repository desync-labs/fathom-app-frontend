import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { Box } from "@mui/material";
import useVaultContext from "context/vault";
import useSharedContext from "context/shared";
import VaultBreadcrumbs from "components/Vaults/VaultDetail/Breadcrumbs";
import VaultLockingBar from "components/Vaults/VaultDetail//VaultLockingBar";
import VaultPositionStats from "components/Vaults/VaultDetail/VaultPositionStats";
import VaultDetailInfoTabs from "components/Vaults/VaultDetail/VaultDetailInfoTabs";
import VaultDetailManageForm from "components/Vaults/VaultDetail/VaultDetailForm/VaultDetailManageForm";
import VaultDetailDepositForm from "components/Vaults/VaultDetail/VaultDetailForm/VaultDetailDepositForm";
import VaultProfitCalculator from "components/Vaults/VaultDetail/VaultProfitCalculator";

const VaultDetailContent = () => {
  const {
    vaultLoading,
    vaultPosition,
    vaultPositionLoading,
    isTfVaultType,
    activeTfPeriod,
    vault,
  } = useVaultContext();
  const { isMobile } = useSharedContext();
  const { shutdown } = vault;

  const [notLoading, setNotLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setNotLoaded(vaultPosition && !vaultPositionLoading && !vaultLoading);
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [vaultPosition, vaultPositionLoading, vaultLoading, setNotLoaded]);
  return (
    <Box>
      <VaultBreadcrumbs />
      <VaultPositionStats />
      {isTfVaultType && <VaultLockingBar />}
      {!isMobile && <VaultProfitCalculator />}
      {isTfVaultType && activeTfPeriod > 0 ? null : notLoading &&
        BigNumber(vaultPosition.balanceShares).isGreaterThan(0) ? (
        <VaultDetailManageForm />
      ) : !shutdown ? (
        <VaultDetailDepositForm notLoading={notLoading} />
      ) : null}
      <VaultDetailInfoTabs />
    </Box>
  );
};

export default VaultDetailContent;
