import useVaultList from "hooks/useVaultList";
import { PageHeader } from "components/Dashboard/PageHeader";
import VaultsTotalStats from "components/Vaults/VaultList/VaultsTotalStats";
import VaultsList from "components/Vaults/VaultList/VaultsList";

const VaultListView = () => {
  const {
    vaultMethods,
    strategyMethods,
    vaultSortedList,
    vaultsLoading,
    vaultPositionsLoading,
    vaultPositionsList,
    vaultCurrentPage,
    vaultItemsCount,
    protocolFee,
    performanceFee,
    isShutdown,
    search,
    sortBy,
    handleIsShutdown,
    setSearch,
    setSortBy,
    handlePageChange,
    filterCurrentPosition,
    expandedVault,
    handleExpandVault,
    handleCollapseVault,
  } = useVaultList();
  return (
    <>
      <PageHeader
        title={"Vaults"}
        description={`Explore existing Vaults, and deposit your assets for a sustainable yield.`}
      />
      <VaultsTotalStats />
      <VaultsList
        vaults={vaultSortedList}
        vaultsLoading={vaultsLoading}
        vaultPositionsLoading={vaultPositionsLoading}
        vaultPositionsList={vaultPositionsList}
        filterCurrentPosition={filterCurrentPosition}
        isMobileFiltersOpen
      />
    </>
  );
};

export default VaultListView;
