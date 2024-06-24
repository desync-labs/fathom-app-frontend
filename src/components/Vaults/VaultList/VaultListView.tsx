import { Typography } from "@mui/material";
import useVaultList from "hooks/Vaults/useVaultList";
import useSharedContext from "context/shared";
import VaultsTotalStats from "components/Vaults/VaultList/VaultsTotalStats";
import VaultsList from "components/Vaults/VaultList/VaultsList";
import VaultsListMobile from "components/Vaults/VaultList/VaultsListMobile";
import VaultFilters from "components/Vaults/VaultList/VaultFilters";
import VaultPageHeader from "components/Vaults/VaultList/VaultPageHeader";
import { EmptyVaultsWrapper } from "components/AppComponents/AppBox/AppBox";

const VaultListView = () => {
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
  const { isMobile } = useSharedContext();
  return (
    <>
      <VaultPageHeader
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
      {vaultSortedList.length === 0 ? (
        <EmptyVaultsWrapper>
          <Typography>
            No vaults found.{" "}
            {search && <>Please try a different search criteria.</>}
          </Typography>
        </EmptyVaultsWrapper>
      ) : isMobile ? (
        <VaultsListMobile
          vaults={vaultSortedList}
          vaultsLoading={vaultsLoading}
          vaultPositionsLoading={vaultPositionsLoading}
          performanceFee={performanceFee}
          filterCurrentPosition={filterCurrentPosition}
          vaultCurrentPage={vaultCurrentPage}
          vaultItemsCount={vaultItemsCount}
          handlePageChange={handlePageChange}
        />
      ) : (
        <VaultsList
          vaults={vaultSortedList}
          vaultsLoading={vaultsLoading}
          vaultPositionsLoading={vaultPositionsLoading}
          performanceFee={performanceFee}
          filterCurrentPosition={filterCurrentPosition}
          vaultCurrentPage={vaultCurrentPage}
          vaultItemsCount={vaultItemsCount}
          handlePageChange={handlePageChange}
        />
      )}
    </>
  );
};

export default VaultListView;
