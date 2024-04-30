import { PageHeader } from "components/Dashboard/PageHeader";
import VaultsTotalStats from "components/Vaults/VaultList/VaultsTotalStats";

const VaultListView = () => {
  return (
    <>
      <PageHeader
        title={"Vaults"}
        description={`Explore existing Vaults, and deposit your assets for a sustainable yield.`}
      />
      <VaultsTotalStats />
    </>
  );
};

export default VaultListView;
