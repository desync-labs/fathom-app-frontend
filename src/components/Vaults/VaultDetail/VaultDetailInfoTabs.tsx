import { styled } from "@mui/material";
import useVaultContext from "context/vault";
import { VaultInfoTabs } from "hooks/Vaults/useVaultDetail";
import { VaultPaper } from "components/AppComponents/AppPaper/AppPaper";
import VaultDetailInfoNav from "components/Vaults/VaultDetail/VaultDetailInfoNav";
import VaultDetailInfoTabAbout from "components/Vaults/VaultDetail/VaultDetailInfoTabAbout";
import VaultDetailInfoTabStrategies from "components/Vaults/VaultDetail/VaultDetailInfoTabStrategies";
import ManagementVaultMethodList from "components/Vaults/VaultDetail/Managment/ManagementVaultMethodList";
import ManagementStrategiesMethodList from "components/Vaults/VaultDetail/Managment/ManagementStrategiesMethodList";

const VaultDetailInfoPaper = styled(VaultPaper)`
  overflow: hidden;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    position: relative;
    width: 100%;
    padding-top: 50px;
  }
`;

const VaultDetailInfoTabs = () => {
  const {
    vault,
    activeVaultInfoTab,
    isUserManager,
    managedStrategiesIds,
    vaultMethods,
    strategyMethods,
  } = useVaultContext();
  return (
    <VaultDetailInfoPaper>
      <VaultDetailInfoNav />
      {activeVaultInfoTab === VaultInfoTabs.ABOUT && (
        <VaultDetailInfoTabAbout />
      )}
      {activeVaultInfoTab === VaultInfoTabs.STRATEGIES && (
        <VaultDetailInfoTabStrategies />
      )}
      {isUserManager && (
        <ManagementVaultMethodList
          isShow={activeVaultInfoTab === VaultInfoTabs.MANAGEMENT_VAULT}
          vaultId={vault.id}
          vaultMethods={vaultMethods}
        />
      )}
      {managedStrategiesIds.length > 0 && (
        <ManagementStrategiesMethodList
          isShow={activeVaultInfoTab === VaultInfoTabs.MANAGEMENT_STRATEGY}
          strategyMethods={strategyMethods}
          strategiesIds={managedStrategiesIds}
        />
      )}
    </VaultDetailInfoPaper>
  );
};

export default VaultDetailInfoTabs;
