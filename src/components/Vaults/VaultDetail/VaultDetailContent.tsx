import BigNumber from "bignumber.js";
import { VaultType } from "fathom-sdk";
import useVaultContext from "context/vault";
import VaultBreadcrumbs from "components/Vaults/VaultDetail/Breadcrumbs";
import VaultLockingBar from "components/Vaults/VaultDetail//VaultLockingBar";
import VaultPositionStats from "components/Vaults/VaultDetail/VaultPositionStats";
import VaultDetailInfoTabs from "components/Vaults/VaultDetail/VaultDetailInfoTabs";
import VaultDetailManageForm from "components/Vaults/VaultDetail/VaultDetailForm/VaultDetailManageForm";
import VaultDetailDepositForm from "components/Vaults/VaultDetail/VaultDetailForm/VaultDetailDepositForm";

const VaultDetailContent = () => {
  const { vault, vaultLoading, vaultPosition } = useVaultContext();
  return (
    <>
      <VaultBreadcrumbs />
      <VaultPositionStats />
      {!vaultLoading && vault.type === VaultType.TRADEFLOW && (
        <VaultLockingBar />
      )}
      {vaultPosition &&
      BigNumber(vaultPosition.balanceShares).isGreaterThan(0) ? (
        <VaultDetailManageForm />
      ) : (
        <VaultDetailDepositForm />
      )}
      <VaultDetailInfoTabs />
    </>
  );
};

export default VaultDetailContent;
