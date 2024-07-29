import { ChangeEvent, FC, memo } from "react";
import { IVault, IVaultPosition } from "fathom-sdk";
import { Pagination, Table, TableBody, TableHead } from "@mui/material";
import { COUNT_PER_PAGE_VAULT } from "utils/Constants";
import BasePopover from "components/Base/Popover/BasePopover";
import { VaultListItemSkeleton } from "components/Vaults/VaultList/VaultListItemSkeleton";
import VaultListItem from "components/Vaults/VaultList/VaultListItem";
import {
  BaseTableCell,
  BaseTableCellPopover,
  BaseTableContainer,
  BaseTableHeaderRow,
  BaseTablePaginationWrapper,
} from "components/Base/Table/StyledTable";

type VaultListPropsType = {
  vaults: IVault[];
  performanceFee: number;
  isLoading: boolean;
  filterCurrentPosition: (vaultId: string) => IVaultPosition | null;
  vaultCurrentPage: number;
  vaultItemsCount: number;
  handlePageChange: (event: ChangeEvent<unknown>, page: number) => void;
};

const VaultsList: FC<VaultListPropsType> = ({
  vaults,
  isLoading,
  performanceFee,
  filterCurrentPosition,
  vaultCurrentPage,
  vaultItemsCount,
  handlePageChange,
}) => {
  return (
    <BaseTableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <BaseTableHeaderRow>
            <BaseTableCell colSpan={2}>Name</BaseTableCell>
            <BaseTableCell colSpan={1}>
              <BaseTableCellPopover>
                Earned
                <BasePopover
                  id={"earned"}
                  text={<>How much have you earned on this Vault so far.</>}
                />
              </BaseTableCellPopover>
            </BaseTableCell>
            <BaseTableCell colSpan={1}>
              <BaseTableCellPopover>
                Apy
                <BasePopover
                  id={"apr"}
                  text={
                    <>
                      Annual Percentage Yield – The annualized rate of return
                      for the vault.
                    </>
                  }
                />
              </BaseTableCellPopover>
            </BaseTableCell>
            <BaseTableCell colSpan={2}>
              <BaseTableCellPopover>
                Tvl
                <BasePopover
                  id={"tvl"}
                  text={
                    <>
                      Total value locked (TVL) is a metric that refers to the
                      sum of assets that are staked in the Vault.
                    </>
                  }
                />
              </BaseTableCellPopover>
            </BaseTableCell>
            <BaseTableCell colSpan={1}>Available</BaseTableCell>
            <BaseTableCell colSpan={1}>Staked</BaseTableCell>
            <BaseTableCell colSpan={4}></BaseTableCell>
          </BaseTableHeaderRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <>
              <VaultListItemSkeleton />
              <VaultListItemSkeleton />
            </>
          ) : (
            vaults.map((vault) => (
              <VaultListItem
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
        <BaseTablePaginationWrapper>
          <Pagination
            count={Math.ceil(vaultItemsCount / COUNT_PER_PAGE_VAULT)}
            page={vaultCurrentPage}
            onChange={handlePageChange}
          />
        </BaseTablePaginationWrapper>
      )}
    </BaseTableContainer>
  );
};

export default memo(VaultsList);
