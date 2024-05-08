import { FC, MouseEvent } from "react";
import { IVault, IVaultPosition } from "fathom-sdk";
import { styled } from "@mui/material/styles";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import useConnector from "context/connector";
import AppPopover from "components/AppComponents/AppPopover/AppPopover";
import { VaultListItemSkeleton } from "components/Vaults/VaultList/VaultListItemSkeleton";
import VaultListItem from "components/Vaults/VaultList/VaultListItem";
import AppPagination from "../../AppComponents/AppPagination/AppPagination";

const VaultListTableContainer = styled(TableContainer)`
  border-radius: 12px;
  background: #132340;
`;
const VaultListTableHeaderRow = styled(TableRow)`
  height: 50px;
  background: #2c4066;
`;

const VaultListTableCell = styled(TableCell)`
  color: #8ea4cc;
  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0.44px;
  text-transform: uppercase;
  padding: 16px 8px;

  &:first-child {
    padding: 16px 24px;
  }
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
  vaults: IVault[];
  vaultPositionsList: IVaultPosition[];
  vaultsLoading: boolean;
  vaultPositionsLoading: boolean;
  filterCurrentPosition: (vaultId: string) => IVaultPosition | null;
};

const VaultsList: FC<VaultListPropsType> = ({
  vaults,
  vaultsLoading,
  vaultPositionsList,
  vaultPositionsLoading,
  filterCurrentPosition,
}) => {
  const { account } = useConnector();
  return (
    <VaultListTableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <VaultListTableHeaderRow>
            <VaultListTableCell colSpan={2}>Token</VaultListTableCell>
            <VaultListTableCell colSpan={1}>
              <VaultListTableCellPopover>
                Earned
                <AppPopover
                  id={"earned"}
                  text={<>How much have you earned on this Vault so far.</>}
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
                      Annual Percentage Yield – The annualized rate of return
                      for the vault.
                    </>
                  }
                />
              </VaultListTableCellPopover>
            </VaultListTableCell>
            <VaultListTableCell colSpan={2}>
              <VaultListTableCellPopover>
                Tvl
                <AppPopover
                  id={"tvl"}
                  text={
                    <>
                      Total value locked (TVL) is a metric that refers to the
                      sum of assets that are staked in the Vault.
                    </>
                  }
                />
              </VaultListTableCellPopover>
            </VaultListTableCell>
            <VaultListTableCell colSpan={1}>Available</VaultListTableCell>
            <VaultListTableCell colSpan={1}>Staked</VaultListTableCell>
            <VaultListTableCell colSpan={4}></VaultListTableCell>
          </VaultListTableHeaderRow>
        </TableHead>
        <TableBody>
          {vaultsLoading || vaultPositionsLoading ? (
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
              />
            ))
          )}
        </TableBody>
      </Table>
      <AppPagination
        currentPage={1}
        totalPages={3}
        onPageChange={() => {
          console.log("Change page");
        }}
      />
    </VaultListTableContainer>
  );
};

export default VaultsList;
