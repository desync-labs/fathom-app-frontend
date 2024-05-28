import useVaultContext from "context/vault";
import VaultBreadcrumbs from "components/Vaults/VaultDetail/Breadcrumbs";
import VaultPositionStats from "components/Vaults/VaultDetail/VaultPositionStats";
import VaultDetailInfoTabs from "components/Vaults/VaultDetail/VaultDetailInfoTabs";
import VaultDetailForm from "./VaultDetailForm/VaultDetailForm";

const VaultDetailContent = () => {
  const { vault, vaultLoading } = useVaultContext();

  if (vaultLoading || !vault.id) {
    return <>Loading...</>;
  }
  return (
    <>
      <VaultBreadcrumbs />
      <VaultPositionStats />
      <VaultDetailForm />
      <VaultDetailInfoTabs />
    </>
  );
};

export default VaultDetailContent;
