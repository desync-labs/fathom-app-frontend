import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
} from "@mui/material";
import { useStores } from "stores";
import useMetaMask from "hooks/metamask";
import { LogLevel, useLogger } from "helpers/Logger";
import { observer } from "mobx-react";
import ICollateralPool from "stores/interfaces/ICollateralPool";
import PoolsListItem from "components/Pools/PoolsListItem";
import OpenNewPositionDialog from "components/Positions/OpenNewPositionDialog";
import { styled } from "@mui/material/styles";
import { AppTableHeaderRow } from "components/AppComponents/AppTable/AppTable";
import {
  NoResults,
  TitleSecondary
} from "components/AppComponents/AppBox/AppBox";

const PoolsListHeaderRow = styled(AppTableHeaderRow)(({ theme }) => ({
  background: "transparent",
  th: {
    textAlign: "left",
  },
}));

const PoolsListView = observer(() => {
  const poolStore = useStores().poolStore;
  const { account, chainId } = useMetaMask()!;
  const logger = useLogger();
  const [selectedPool, setSelectedPool] = useState<ICollateralPool>();

  useEffect(() => {
    if (chainId) {
      setTimeout(() => {
        // Update the document title using the browser API
        logger.log(LogLevel.info, `fetching open positions. ${account}`);
        poolStore.fetchPools();
      });
    } else {
      poolStore.setPool([]);
    }
    setSelectedPool(undefined);
  }, [poolStore, account, chainId, logger, setSelectedPool]);

  return (
    <>
      <TitleSecondary variant="h2">Available Pools</TitleSecondary>
      {poolStore.pools.length === 0 ? (
        <NoResults variant="h6">No Pool Available!</NoResults>
      ) : (
        <TableContainer>
          <Table
            sx={{ minWidth: 500, "& td": { padding: "9px" } }}
            aria-label="simple table"
          >
            <TableHead>
              <PoolsListHeaderRow
                sx={{ "th:first-child": { paddingLeft: "20px" } }}
              >
                <TableCell>Pool</TableCell>
                <TableCell>Total Borrowed</TableCell>
                <TableCell>TVL</TableCell>
                <TableCell>Available</TableCell>
                <TableCell>APR</TableCell>
                <TableCell>Total APY</TableCell>
                <TableCell></TableCell>
              </PoolsListHeaderRow>
            </TableHead>

            <TableBody>
              {poolStore.pools.map((pool: ICollateralPool) => (
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
              onClose={() => setSelectedPool(undefined)}
            />
          )
        );
      }, [selectedPool])}
    </>
  );
});

export default PoolsListView;
