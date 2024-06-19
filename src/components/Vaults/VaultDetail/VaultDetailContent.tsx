import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import useVaultContext from "context/vault";
import VaultBreadcrumbs from "components/Vaults/VaultDetail/Breadcrumbs";
import VaultLockingBar from "components/Vaults/VaultDetail//VaultLockingBar";
import VaultPositionStats from "components/Vaults/VaultDetail/VaultPositionStats";
import VaultDetailInfoTabs from "components/Vaults/VaultDetail/VaultDetailInfoTabs";
import VaultDetailManageForm from "components/Vaults/VaultDetail/VaultDetailForm/VaultDetailManageForm";
import VaultDetailDepositForm from "components/Vaults/VaultDetail/VaultDetailForm/VaultDetailDepositForm";

const VaultDetailContent = () => {
  const {
    vaultLoading,
    vaultPosition,
    vaultPositionLoading,
    isTfVaultType,
    activeTfPeriod,
  } = useVaultContext();

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
    <>
      <VaultBreadcrumbs />
      <VaultPositionStats />
      {!vaultLoading && isTfVaultType && <VaultLockingBar />}
      {isTfVaultType && activeTfPeriod > 0 ? null : notLoading &&
        BigNumber(vaultPosition.balanceShares).isGreaterThan(0) ? (
        <VaultDetailManageForm />
      ) : (
        <VaultDetailDepositForm notLoading={notLoading} />
      )}
      <VaultDetailInfoTabs />
    </>
  );
};

export default VaultDetailContent;
