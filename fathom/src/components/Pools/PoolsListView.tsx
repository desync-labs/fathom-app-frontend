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
import { observer } from "mobx-react";
import ICollateralPool from "stores/interfaces/ICollateralPool";
import PoolsListItem from "components/Pools/PoolsListItem";
import OpenNewPositionDialog from "components/Positions/OpenNewPositionDialog";
import { styled } from "@mui/material/styles";
import { AppTableHeaderRow } from "components/AppComponents/AppTable/AppTable";
import {
  NoResults,
  TitleSecondary,
} from "components/AppComponents/AppBox/AppBox";
import usePoolsList from "hooks/usePoolsList";

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

type PoolsListViewProps = {
  refetchData: () => void;
};

const PoolsListView: FC<PoolsListViewProps> = observer(({ refetchData }) => {
  const { pools, selectedPool, onCloseNewPosition, setSelectedPool, loading } =
    usePoolsList();

  return (
    <>
      <TitleSecondary variant="h2">Available Pools</TitleSecondary>
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
                  setSelectedPool={setSelectedPool!}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {useMemo(() => {
        return (
          selectedPool && (
            <OpenNewPositionDialog
              pool={selectedPool!}
              onClose={onCloseNewPosition}
              refetchData={refetchData}
            />
          )
        );
      }, [selectedPool, onCloseNewPosition])}
    </>
  );
});

export default PoolsListView;
