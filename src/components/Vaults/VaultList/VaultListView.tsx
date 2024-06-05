import { FC, MouseEvent } from "react";
import useVaultList from "hooks/useVaultList";
import { PageHeader } from "components/Dashboard/PageHeader";
import VaultsTotalStats from "components/Vaults/VaultList/VaultsTotalStats";
import VaultsList from "components/Vaults/VaultList/VaultsList";
import VaultFilters from "components/Vaults/VaultList/VaultFilters";

type VaultListViewPropsType = {
  isMobileFiltersOpen: boolean;
  openMobileFilterMenu: (event: MouseEvent<HTMLElement>) => void;
};

const VaultListView: FC<VaultListViewPropsType> = ({
  isMobileFiltersOpen,
  openMobileFilterMenu,
}) => {
  const {
    vaultSortedList,
    vaultsLoading,
    vaultPositionsLoading,
    vaultPositionsList,
    performanceFee,
    vaultCurrentPage,
    vaultItemsCount,
    isShutdown,
    search,
    sortBy,
    handleIsShutdown,
    setSearch,
    setSortBy,
    handlePageChange,
    filterCurrentPosition,
  } = useVaultList();
  return (
    <>
      <PageHeader
        title={"Vaults"}
        description={`Explore existing Vaults, and deposit your assets for a sustainable yield.`}
      />
      <VaultsTotalStats
        positionsList={vaultPositionsList}
        positionsLoading={vaultPositionsLoading}
      />
      <VaultFilters
        search={search}
        sortBy={sortBy}
        setSearch={setSearch}
        setSortBy={setSortBy}
        handleIsShutdown={handleIsShutdown}
        isShutdown={isShutdown}
      />
      <VaultsList
        vaults={vaultSortedList}
        vaultsLoading={vaultsLoading}
        vaultPositionsLoading={vaultPositionsLoading}
        performanceFee={performanceFee}
        vaultPositionsList={vaultPositionsList}
        filterCurrentPosition={filterCurrentPosition}
        isMobileFiltersOpen={isMobileFiltersOpen}
        openMobileFilterMenu={openMobileFilterMenu}
        vaultCurrentPage={vaultCurrentPage}
        vaultItemsCount={vaultItemsCount}
        handlePageChange={handlePageChange}
      />
    </>
  );
};

export default VaultListView;
