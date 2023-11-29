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
import { IVault } from "fathom-sdk";

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
  vaultList: IVault[];
  vaultsLoading: boolean;
  vaultItemsCount: number;
  vaultCurrentPage: number;
  handlePageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
};

const VaultList: FC<VaultListProps> = ({
  vaultList,
  vaultsLoading,
  vaultItemsCount,
  vaultCurrentPage,
  handlePageChange,
}) => {
  const { isMobile } = useVaultList();

  return (
    <>
      {useMemo(
        () => (
          <>
            {!vaultList.length && (
              <NoResults variant="h6">
                {vaultsLoading ? (
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
                <VaultListItemMobile vaultItemData={vaultList[0]} />
                <VaultListItemMobile vaultItemData={vaultList[0]} hasDeposit />
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
                    {vaultList.map((vault) => (
                      <VaultListItem key={vault.id} vaultItemData={vault} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            {!vaultsLoading && vaultList.length > 0 && (
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
        [vaultsLoading, vaultList, isMobile]
      )}
    </>
  );
};

export default memo(VaultList);
