import { FC, memo, useMemo, MouseEvent } from "react";
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
    setIsShutdown,
    setSearch,
    setSortBy,
    handlePageChange,
    filterCurrentPosition,
  } = useVaultList();
  const { isMobile } = useSharedContext();

  if (process.env.REACT_APP_ENV === "prod") {
    return <NoResults variant={"h6"}>Vaults coming soon.</NoResults>;
  }

  return (
    <>
      {useMemo(
        () => (
          <>
            {isMobile ? (
              <>
                <VaultFiltersMobile
                  isShutdown={isShutdown}
                  isMobileFiltersOpen={isMobileFiltersOpen}
                  search={search}
                  sortBy={sortBy}
                  setIsShutdown={setIsShutdown}
                  setSearch={setSearch}
                  setSortBy={setSortBy}
                  openMobileFilterMenu={openMobileFilterMenu}
                />
                {vaultsLoading ||
                vaultPositionsLoading ||
                !vaultSortedList.length ? (
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
                  vaultSortedList.map((vault) => (
                    <VaultListItemMobile
                      key={vault.id}
                      vaultItemData={vault}
                      vaultPosition={filterCurrentPosition(vault.id)}
                      protocolFee={protocolFee}
                      performanceFee={performanceFee}
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
                  setIsShutdown={setIsShutdown}
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
                              text={
                                <>The amount of fee that this Vault takes</>
                              }
                            />
                          </VaultListTableCellPopover>
                        </VaultListTableCell>
                        <VaultListTableCell colSpan={1}>
                          <VaultListTableCellPopover>
                            Earned
                            <AppPopover
                              id={"earned"}
                              text={
                                <>
                                  How much have you earned on this Vault so far
                                </>
                              }
                            />
                          </VaultListTableCellPopover>
                        </VaultListTableCell>
                        <VaultListTableCell colSpan={1}>
                          <VaultListTableCellPopover>
                            Apr
                            <AppPopover
                              id={"apr"}
                              text={
                                <>
                                  Annual Percentage Rate – refers to the total
                                  cost of your borrowing for a year.
                                  Importantly, it includes the standard fees and
                                  interest you'll have to pay.
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
                                  Total value locked (TVL) is a metric that
                                  refers to the sum of assets that are staked in
                                  the Vault.
                                </>
                              }
                            />
                          </VaultListTableCellPopover>
                        </VaultListTableCell>
                        <VaultListTableCell colSpan={1}>
                          Available
                        </VaultListTableCell>
                        <VaultListTableCell colSpan={1}>
                          Staked
                        </VaultListTableCell>
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
                        vaultSortedList.map((vault) => (
                          <VaultListItem
                            key={vault.id}
                            vaultItemData={vault}
                            vaultPosition={filterCurrentPosition(vault.id)}
                            protocolFee={protocolFee}
                            performanceFee={performanceFee}
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
        ),
        [
          search,
          sortBy,
          isShutdown,
          isMobile,
          isMobileFiltersOpen,
          vaultSortedList,
          performanceFee,
          protocolFee,
          vaultsLoading,
          vaultPositionsList,
          vaultPositionsLoading,
        ]
      )}
    </>
  );
};

export default memo(VaultList);
