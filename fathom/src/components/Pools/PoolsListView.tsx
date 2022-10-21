import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Typography,
} from "@mui/material";
import { useStores } from "stores";
import useMetaMask from "hooks/metamask";
import { LogLevel, useLogger } from "helpers/Logger";
import { observer } from "mobx-react";
import ICollateralPool from "stores/interfaces/ICollateralPool";
import PoolsListItem from "components/Pools/PoolsListItem";
import CustomizedDialogs from "components/Positions/OpenNewPositionDialog";
import { styled } from "@mui/material/styles";
import { AppTableHeaderRow } from "components/AppComponents/AppTable/AppTable";
import { TitleSecondary } from "components/AppComponents/AppTypography/AppTypography";

const PoolsListHeaderRow = styled(AppTableHeaderRow)(({ theme }) => ({
  background: "transparent",
  th: {
    textAlign: "left",
  },
  "th:first-child": {
    textAlign: "center",
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
      <TitleSecondary variant="h2">Availlable Pools</TitleSecondary>
      {poolStore.pools.length === 0 ? (
        <Typography variant="h6">No Pool Available!</Typography>
      ) : (
        <TableContainer>
          <Table
            sx={{ minWidth: 500, "& td": { padding: "9px" } }}
            aria-label="simple table"
          >
            <TableHead>
              <PoolsListHeaderRow>
                <TableCell>Pool</TableCell>
                <TableCell>Available FXD</TableCell>
                <TableCell>Total FXD Borrowed</TableCell>
                <TableCell>Lending APR</TableCell>
                <TableCell>Staking APR</TableCell>
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
      {selectedPool && (
        <CustomizedDialogs
          pool={selectedPool}
          onClose={() => setSelectedPool(undefined)}
        />
      )}
    </>
  );
});

export default PoolsListView;
