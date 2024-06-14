import { FC, memo, MouseEvent } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Pagination,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import useSharedContext from "context/shared";
import { COUNT_PER_PAGE } from "utils/Constants";
import useVaultList from "hooks/useVaultList";

import { AppTableHeaderRow } from "components/AppComponents/AppTable/AppTable";
import { NoResults } from "components/AppComponents/AppBox/AppBox";
import VaultListItem from "components/Vault/VaultListItem";
import VaultFilters from "components/Vault/VaultFilters";
import VaultListItemMobile from "components/Vault/VaultListItemMobile";
import VaultFiltersMobile from "components/Vault/VaultFiltersMobile";
import {
  VaultListItemMobileSkeleton,
  VaultListItemSkeleton,
} from "components/Vault/VaultListItemSkeleton";
import AppPopover from "components/AppComponents/AppPopover/AppPopover";
import useConnector from "context/connector";

const PaginationWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const VaultListTableCell = styled(TableCell)`
  padding: 0 !important;
`;

const VaultListTableCellPopover = styled(Box)`
  display: flex;
  justify-content: left;
  gap: 7px;
  line-height: 1.2rem;
  padding-top: 4px !important;
`;

type VaultListPropsType = {
  isMobileFiltersOpen: boolean;
  openMobileFilterMenu: (event: MouseEvent<HTMLElement>) => void;
};

const VaultList: FC<VaultListPropsType> = ({
  isMobileFiltersOpen,
  openMobileFilterMenu,
}) => {
  const {
    vaultMethods,
    strategyMethods,
    vaultSortedList,
    vaultsLoading,
    vaultPositionsLoading,
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
  const { isMobile } = useSharedContext();
  const { account } = useConnector();

  return (
    <>
      {isMobile ? (
        <>
          <VaultFiltersMobile
            isShutdown={isShutdown}
            isMobileFiltersOpen={isMobileFiltersOpen}
            search={search}
            sortBy={sortBy}
            handleIsShutdown={handleIsShutdown}
            setSearch={setSearch}
            setSortBy={setSortBy}
            openMobileFilterMenu={openMobileFilterMenu}
          />
          {vaultsLoading || vaultPositionsLoading || !vaultSortedList.length ? (
            <>
              {vaultsLoading || vaultPositionsLoading ? (
                <>
                  <VaultListItemMobileSkeleton />
                  <VaultListItemMobileSkeleton />
                </>
              ) : (
                <NoResults variant={"h6"}>
                  There are no Vaults for this query.
                </NoResults>
              )}
            </>
          ) : (
            vaultSortedList.map((vault, index) => (
              <VaultListItemMobile
                vaultMethods={vaultMethods}
                strategyMethods={strategyMethods}
                key={vault.id}
                vaultItemData={vault}
                vaultPosition={filterCurrentPosition(vault.id)}
                protocolFee={protocolFee}
                performanceFee={performanceFee}
                index={index}
                isExtended={expandedVault === index}
                handleExpandVault={handleExpandVault}
                handleCollapseVault={handleCollapseVault}
              />
            ))
          )}
        </>
      ) : (
        <TableContainer>
          <VaultFilters
            isShutdown={isShutdown}
            search={search}
            sortBy={sortBy}
            handleIsShutdown={handleIsShutdown}
            setSearch={setSearch}
            setSortBy={setSortBy}
          />
          {!vaultsLoading &&
          !vaultPositionsLoading &&
          !vaultSortedList.length ? (
            <NoResults variant={"h6"}>
              There are no Vaults for this query.
            </NoResults>
          ) : (
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <AppTableHeaderRow
                  sx={{
                    th: {
                      textAlign: "left",
                      "&:first-of-type": { paddingLeft: "0" },
                    },
                  }}
                >
                  <VaultListTableCell
                    colSpan={2}
                    sx={{ paddingLeft: "20px !important" }}
                  >
                    Token
                  </VaultListTableCell>
                  <VaultListTableCell colSpan={1}>
                    <VaultListTableCellPopover>
                      Fee
                      <AppPopover
                        id={"fee"}
                        text={<>The amount of fee that this Vault takes.</>}
                      />
                    </VaultListTableCellPopover>
                  </VaultListTableCell>
                  {account && (
                    <VaultListTableCell colSpan={1}>
                      <VaultListTableCellPopover>
                        Earned
                        <AppPopover
                          id={"earned"}
                          text={
                            <>How much have you earned on this Vault so far.</>
                          }
                        />
                      </VaultListTableCellPopover>
                    </VaultListTableCell>
                  )}
                  <VaultListTableCell colSpan={1}>
                    <VaultListTableCellPopover>
                      Apy
                      <AppPopover
                        id={"apr"}
                        text={
                          <>
                            Annual Percentage Yield – The annualized rate of
                            return for the vault.
                          </>
                        }
                      />
                    </VaultListTableCellPopover>
                  </VaultListTableCell>
                  <VaultListTableCell colSpan={1}>
                    <VaultListTableCellPopover>
                      Tvl
                      <AppPopover
                        id={"tvl"}
                        text={
                          <>
                            Total value locked (TVL) is a metric that refers to
                            the sum of assets that are staked in the Vault.
                          </>
                        }
                      />
                    </VaultListTableCellPopover>
                  </VaultListTableCell>
                  <VaultListTableCell colSpan={1}>Available</VaultListTableCell>
                  <VaultListTableCell colSpan={1}>Staked</VaultListTableCell>
                  <TableCell colSpan={2}></TableCell>
                </AppTableHeaderRow>
              </TableHead>
              <TableBody>
                {vaultsLoading || vaultPositionsLoading ? (
                  <>
                    <VaultListItemSkeleton />
                    <VaultListItemSkeleton />
                  </>
                ) : (
                  vaultSortedList.map((vault, index) => (
                    <VaultListItem
                      vaultMethods={vaultMethods}
                      strategyMethods={strategyMethods}
                      key={vault.id}
                      vaultItemData={vault}
                      vaultPosition={filterCurrentPosition(vault.id)}
                      protocolFee={protocolFee}
                      performanceFee={performanceFee}
                      index={index}
                      isExtended={expandedVault === index}
                      handleExpandVault={handleExpandVault}
                      handleCollapseVault={handleCollapseVault}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      )}
      {!vaultsLoading && vaultSortedList.length > COUNT_PER_PAGE && (
        <PaginationWrapper>
          <Pagination
            count={Math.ceil(vaultItemsCount / COUNT_PER_PAGE)}
            page={vaultCurrentPage}
            onChange={handlePageChange}
          />
        </PaginationWrapper>
      )}
    </>
  );
};

export default memo(VaultList);
