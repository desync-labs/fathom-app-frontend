import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import useVaultList from "hooks/Vaults/useVaultList";
import useSharedContext from "context/shared";
import VaultsTotalStats from "components/Vaults/VaultList/VaultsTotalStats";
import VaultsList from "components/Vaults/VaultList/VaultsList";
import VaultsListMobile from "components/Vaults/VaultList/VaultsListMobile";
import VaultFilters from "components/Vaults/VaultList/VaultFilters";
import BasePageHeader from "components/Base/PageHeader";
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

  const [listLoading, setListLoading] = useState<boolean>(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setListLoading(vaultsLoading || vaultPositionsLoading);
    }, 50);

    return () => {
      clearTimeout(timeout);
    };
  }, [vaultsLoading, vaultPositionsLoading, setListLoading]);

  return (
    <>
      <BasePageHeader
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
      {vaultSortedList.length === 0 &&
      !(vaultsLoading || vaultPositionsLoading) ? (
        <EmptyVaultsWrapper>
          <Typography>
            No vaults found.{" "}
            {search && <>Please try a different search criteria.</>}
          </Typography>
        </EmptyVaultsWrapper>
      ) : isMobile ? (
        <VaultsListMobile
          vaults={vaultSortedList}
          isLoading={listLoading}
          performanceFee={performanceFee}
          filterCurrentPosition={filterCurrentPosition}
          vaultCurrentPage={vaultCurrentPage}
          vaultItemsCount={vaultItemsCount}
          handlePageChange={handlePageChange}
        />
      ) : (
        <VaultsList
          vaults={vaultSortedList}
          isLoading={listLoading}
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
