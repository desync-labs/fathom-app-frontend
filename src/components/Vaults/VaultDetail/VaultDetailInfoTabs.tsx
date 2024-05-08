import useVaultContext from "context/vault";
import { VaultInfoTabs } from "hooks/useVaultDetail";
import { VaultPaper } from "components/AppComponents/AppPaper/AppPaper";
import VaultDetailInfoNav from "components/Vaults/VaultDetail/VaultDetailInfoNav";
import VaultDetailInfoTabAbout from "components/Vaults/VaultDetail/VaultDetailInfoTabAbout";
import VaultDetailInfoTabStrategies from "components/Vaults/VaultDetail/VaultDetailInfoTabStrategies";

const VaultDetailInfoTabs = () => {
  const { vault, activeVaultInfoTab } = useVaultContext();
  return (
    <VaultPaper>
      <VaultDetailInfoNav />
      {vault && activeVaultInfoTab === VaultInfoTabs.ABOUT && (
        <VaultDetailInfoTabAbout />
      )}
      {vault && activeVaultInfoTab === VaultInfoTabs.STRATEGIES && (
        <VaultDetailInfoTabStrategies />
      )}
    </VaultPaper>
  );
};

export default VaultDetailInfoTabs;
