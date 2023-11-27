import React, { Dispatch, FC, memo, useMemo } from "react";
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Pagination,
} from "@mui/material";
import {
  AppTableCellWithPopover,
  AppTableHeaderRow,
} from "components/AppComponents/AppTable/AppTable";
import { NoResults } from "components/AppComponents/AppBox/AppBox";
import { styled } from "@mui/material/styles";
import { COUNT_PER_PAGE } from "utils/Constants";
import useVaultList from "hooks/useVaultList";
import VaultListItem from "components/Vault/VaultListItem";
import VaultFilters from "components/Vault/VaultFilters";
import VaultListItemMobile from "components/Vault/VaultListItemMobile";
import VaultFiltersMobile from "components/Vault/VaultFiltersMobile";
import AppPopover from "../AppComponents/AppPopover/AppPopover";

const CircleWrapper = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PaginationWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const VaultListTableCell = styled(TableCell)`
  padding: 0 !important;
`;

type VaultListProps = {
  vaultItemsCount: number;
  vaultCurrentPage: number;
  setVaultCurrentPage: Dispatch<number>;
};

const VaultList: FC<VaultListProps> = ({
  vaultItemsCount,
  vaultCurrentPage,
  setVaultCurrentPage,
}) => {
  const { isMobile, vaultList, loading, handlePageChange } = useVaultList();

  return (
    <>
      {useMemo(
        () => (
          <>
            {!vaultList.length && (
              <NoResults variant="h6">
                {loading ? (
                  <CircleWrapper>
                    <CircularProgress size={30} />
                  </CircleWrapper>
                ) : (
                  "You have not opened vaults"
                )}
              </NoResults>
            )}
            {isMobile ? (
              <>
                <VaultFiltersMobile />
                <VaultListItemMobile vaultItemData={vaultList} />
                <VaultListItemMobile vaultItemData={vaultList} hasDeposit />
              </>
            ) : (
              <TableContainer>
                <VaultFilters />
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <AppTableHeaderRow
                      sx={{
                        th: { textAlign: "left", paddingLeft: "10px" },
                      }}
                    >
                      <VaultListTableCell>Token</VaultListTableCell>
                      <VaultListTableCell>
                        <AppTableCellWithPopover>
                          Fee
                          <AppPopover id={"fee"} text={<>Fee Test Text</>} />
                        </AppTableCellWithPopover>
                      </VaultListTableCell>
                      <VaultListTableCell>
                        <AppTableCellWithPopover>
                          Earned
                          <AppPopover
                            id={"earned"}
                            text={<>Earned Test Text</>}
                          />
                        </AppTableCellWithPopover>
                      </VaultListTableCell>
                      <VaultListTableCell>
                        <AppTableCellWithPopover>
                          Apr
                          <AppPopover id={"apr"} text={<>Apr Test Text</>} />
                        </AppTableCellWithPopover>
                      </VaultListTableCell>
                      <VaultListTableCell>
                        <AppTableCellWithPopover>
                          Tvl
                          <AppPopover id={"tvl"} text={<>Tvl Test Text</>} />
                        </AppTableCellWithPopover>
                      </VaultListTableCell>
                      <VaultListTableCell>Available</VaultListTableCell>
                      <VaultListTableCell>Deposited</VaultListTableCell>
                      <TableCell></TableCell>
                    </AppTableHeaderRow>
                  </TableHead>
                  <TableBody>
                    {vaultList.map((vault: any) => (
                      <VaultListItem key={vault.id} vaultItemData={vault} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <PaginationWrapper>
              <Pagination
                count={Math.ceil(vaultItemsCount / COUNT_PER_PAGE)}
                page={vaultCurrentPage}
                onChange={handlePageChange}
              />
            </PaginationWrapper>
          </>
        ),
        [loading, vaultList, isMobile]
      )}
    </>
  );
};

export default memo(VaultList);
