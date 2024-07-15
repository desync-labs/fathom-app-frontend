import { FC, useMemo, memo } from "react";
import { Table, TableBody, TableHead, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ICollateralPool } from "fathom-sdk";

import { OpenPositionProvider } from "context/openPosition";
import useSharedContext from "context/shared";
import usePoolsList from "hooks/Pools/usePoolsList";
import PoolsListItem from "components/Pools/PoolsListItem";
import OpenNewPositionDialog from "components/Positions/OpenNewPositionDialog";
import { TitleSecondary } from "components/AppComponents/AppBox/AppBox";
import PoolsListItemMobile from "components/Pools/PoolsListItemMobile";
import {
  BaseTableCell,
  BaseTableContainer,
  BaseTableHeaderRow,
} from "components/Base/Table/StyledTable";
import { NoResults } from "components/Base/Typography/StyledTypography";
import { PoolListSkeleton } from "components/Base/Skeletons/StablecoinSkeletons";

const PoolsTitle = styled(TitleSecondary)`
  font-size: 20px;
  margin-bottom: 12px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 16px;
    margin-bottom: 10px;
  }
`;

type PoolsListViewProps = {
  proxyWallet: string;
  fetchProxyWallet: () => void;
};

const PoolsListView: FC<PoolsListViewProps> = ({
  proxyWallet,
  fetchProxyWallet,
}) => {
  const { pools, selectedPool, onCloseNewPosition, setSelectedPool, loading } =
    usePoolsList();
  const { isMobile } = useSharedContext();

  return (
    <Box>
      <PoolsTitle variant="h2">Available Pools</PoolsTitle>
      {pools.length === 0 ? (
        <>
          {loading ? (
            <PoolListSkeleton />
          ) : (
            <NoResults variant={"h6"}>No Pool Available!</NoResults>
          )}
        </>
      ) : (
        <>
          {!isMobile && (
            <BaseTableContainer>
              <Table aria-label="pools table">
                <TableHead>
                  <BaseTableHeaderRow>
                    <BaseTableCell>Pool</BaseTableCell>
                    <BaseTableCell>Price</BaseTableCell>
                    <BaseTableCell>Borrowed</BaseTableCell>
                    <BaseTableCell>Available</BaseTableCell>
                    <BaseTableCell></BaseTableCell>
                  </BaseTableHeaderRow>
                </TableHead>

                <TableBody>
                  {pools.map((pool: ICollateralPool) => (
                    <PoolsListItem
                      pool={pool}
                      key={pool.id}
                      setSelectedPool={setSelectedPool}
                    />
                  ))}
                </TableBody>
              </Table>
            </BaseTableContainer>
          )}
          {isMobile &&
            pools.map((pool: ICollateralPool) => (
              <PoolsListItemMobile
                pool={pool}
                key={pool.id}
                setSelectedPool={setSelectedPool}
              />
            ))}
        </>
      )}
      {useMemo(() => {
        return (
          selectedPool && (
            <OpenPositionProvider
              onClose={onCloseNewPosition}
              pool={selectedPool}
              proxyWallet={proxyWallet}
              fetchProxyWallet={fetchProxyWallet}
            >
              <OpenNewPositionDialog />
            </OpenPositionProvider>
          )
        );
      }, [selectedPool, onCloseNewPosition, proxyWallet])}
    </Box>
  );
};

export default memo(PoolsListView);
