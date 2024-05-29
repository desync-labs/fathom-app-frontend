import { FC, MouseEvent } from "react";
import useVaultList from "hooks/useVaultList";
import { PageHeader } from "components/Dashboard/PageHeader";
import VaultsTotalStats from "components/Vaults/VaultList/VaultsTotalStats";
import VaultsList from "components/Vaults/VaultList/VaultsList";

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
    // vaultCurrentPage,
    // vaultItemsCount,
    // protocolFee,
    // performanceFee,
    // isShutdown,
    // search,
    // sortBy,
    // handleIsShutdown,
    // setSearch,
    // setSortBy,
    // handlePageChange,
    filterCurrentPosition,
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
        isMobileFiltersOpen={isMobileFiltersOpen}
        openMobileFilterMenu={openMobileFilterMenu}
      />
    </>
  );
};

export default VaultListView;
