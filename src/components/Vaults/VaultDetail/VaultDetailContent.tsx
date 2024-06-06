import BigNumber from "bignumber.js";
import useVaultContext from "context/vault";
import VaultBreadcrumbs from "components/Vaults/VaultDetail/Breadcrumbs";
import VaultPositionStats from "components/Vaults/VaultDetail/VaultPositionStats";
import VaultDetailInfoTabs from "components/Vaults/VaultDetail/VaultDetailInfoTabs";
import VaultDetailManageForm from "components/Vaults/VaultDetail/VaultDetailForm/VaultDetailManageForm";
import VaultDetailDepositForm from "components/Vaults/VaultDetail/VaultDetailForm/VaultDetailDepositForm";

const VaultDetailContent = () => {
  const { vault, vaultLoading, vaultPosition } = useVaultContext();

  if (vaultLoading || !vault.id) {
    return <>Loading...</>;
  }
  return (
    <>
      <VaultBreadcrumbs />
      <VaultPositionStats />
      {!vault.shutdown ? (
        vaultPosition &&
        BigNumber(vaultPosition.balanceShares).isGreaterThan(0) ? (
          <VaultDetailManageForm />
        ) : (
          <VaultDetailDepositForm />
        )
      ) : null}
      <VaultDetailInfoTabs />
    </>
  );
};

export default VaultDetailContent;
