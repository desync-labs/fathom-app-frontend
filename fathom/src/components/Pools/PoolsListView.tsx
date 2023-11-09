import React, { FC, useMemo } from "react";
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Box,
} from "@mui/material";
import { ICollateralPool } from "fathom-contracts-helper";
import PoolsListItem from "components/Pools/PoolsListItem";
import OpenNewPositionDialog from "components/Positions/OpenNewPositionDialog";
import { styled } from "@mui/material/styles";
import { AppTableHeaderRow } from "components/AppComponents/AppTable/AppTable";
import {
  NoResults,
  TitleSecondary,
} from "components/AppComponents/AppBox/AppBox";
import usePoolsList from "hooks/usePoolsList";
import PoolsListItemMobile from "components/Pools/PoolsListItemMobile";
import { OpenPositionProvider } from "context/openPosition";

const PoolsListHeaderRow = styled(AppTableHeaderRow)`
  background: transparent;

  th {
    text-align: left;
  }
`;

const CircleWrapper = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PoolsTitle = styled(TitleSecondary)`
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-bottom: 15px;
    margin-top: 25px;
  }
`;

const PoolsListView: FC = () => {
  const {
    isMobile,
    pools,
    selectedPool,
    onCloseNewPosition,
    setSelectedPool,
    loading,
  } = usePoolsList();

  return (
    <>
      <PoolsTitle variant="h2">Available Pools</PoolsTitle>
      {pools.length === 0 ? (
        <NoResults variant="h6">
          {loading ? (
            <CircleWrapper>
              <CircularProgress size={30} />
            </CircleWrapper>
          ) : (
            "No Pool Available!"
          )}
        </NoResults>
      ) : (
        <>
          {!isMobile && (
            <TableContainer>
              <Table
                sx={{ minWidth: 500, "& td": { padding: "9px" } }}
                aria-label="simple table"
              >
                <TableHead>
                  <PoolsListHeaderRow>
                    <TableCell>Pool</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Borrowed</TableCell>
                    <TableCell>Available</TableCell>
                    <TableCell></TableCell>
                  </PoolsListHeaderRow>
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
            </TableContainer>
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
            >
              <OpenNewPositionDialog />
            </OpenPositionProvider>
          )
        );
      }, [selectedPool, onCloseNewPosition])}
    </>
  );
};

export default PoolsListView;
