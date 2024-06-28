import { ChangeEvent, FC, memo } from "react";
import { IVault, IVaultPosition } from "fathom-sdk";
import { styled } from "@mui/material/styles";
import {
  Box,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { COUNT_PER_PAGE_VAULT } from "utils/Constants";
import VaultListItemMobile from "components/Vaults/VaultList/VaultListItemMobile";
import { VaultListItemMobileSkeleton } from "components/Vaults/VaultList/VaultListItemSkeleton";

const VaultListTableHeaderRow = styled(TableRow)`
  height: 16px;
  background: transparent;
  padding: 8px 0;
`;

const VaultListTableCell = styled(TableCell)`
  color: #8ea4cc;
  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0.44px;
  text-transform: uppercase;
  padding: 8px 0;
  border: none;

  &:first-of-type {
    padding: 8px 0 8px 16px;
  }
`;

const PaginationWrapper = styled(Box)`
  display: flex;
  justify-content: center;
`;

type VaultListPropsType = {
  vaults: IVault[];
  isLoading: boolean;
  performanceFee: number;
  filterCurrentPosition: (vaultId: string) => IVaultPosition | null;
  vaultCurrentPage: number;
  vaultItemsCount: number;
  handlePageChange: (event: ChangeEvent<unknown>, page: number) => void;
};

const VaultsListMobile: FC<VaultListPropsType> = ({
  vaults,
  isLoading,
  performanceFee,
  filterCurrentPosition,
  vaultCurrentPage,
  vaultItemsCount,
  handlePageChange,
}) => {
  return (
    <TableContainer>
      <Table aria-label="vaults table">
        <TableHead>
          <VaultListTableHeaderRow>
            <VaultListTableCell colSpan={2}>Name</VaultListTableCell>
            <VaultListTableCell colSpan={1}>Apy</VaultListTableCell>
            <VaultListTableCell colSpan={2}>Tvl</VaultListTableCell>
            <VaultListTableCell colSpan={1}>Status</VaultListTableCell>
          </VaultListTableHeaderRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <>
              <VaultListItemMobileSkeleton />
              <VaultListItemMobileSkeleton />
            </>
          ) : (
            vaults.map((vault) => (
              <VaultListItemMobile
                key={vault.id}
                vaultItemData={vault}
                vaultPosition={filterCurrentPosition(vault.id)}
                performanceFee={performanceFee}
              />
            ))
          )}
        </TableBody>
      </Table>
      {!isLoading && vaults.length > COUNT_PER_PAGE_VAULT && (
        <PaginationWrapper>
          <Pagination
            count={Math.ceil(vaultItemsCount / COUNT_PER_PAGE_VAULT)}
            page={vaultCurrentPage}
            onChange={handlePageChange}
          />
        </PaginationWrapper>
      )}
    </TableContainer>
  );
};

export default memo(VaultsListMobile);
