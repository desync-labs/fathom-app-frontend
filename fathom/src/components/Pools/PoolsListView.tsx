import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableContainer,
  Typography,
} from "@mui/material";
import { useStores } from "../../stores";
import useMetaMask from "../../hooks/metamask";
import { LogLevel, useLogger } from "../../helpers/Logger";
import { observer } from "mobx-react";
import ICollatralPool from "../../stores/interfaces/ICollatralPool";
import PoolsListItem from "./PoolsListItem";
import CustomizedDialogs from "../Positions/OpenNewPositionDialog";
import { AppPaper } from "components/AppComponents/AppPaper/AppPaper";

const PoolsListView = observer(() => {
  const poolStore = useStores().poolStore;
  const { account, chainId } = useMetaMask()!;
  const logger = useLogger();
  const [selectedPool, setSelectedPool] = useState<ICollatralPool>();

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
    <AppPaper sx={{ p: 2, display: "flex", flexDirection: "column", height: 360 }}>
      {/* <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Pools
      </Typography> */}
      {poolStore.pools.length === 0 ? (
        <Typography variant="h6">No Pool Available!</Typography>
      ) : (
        <TableContainer>
          <Table sx={{ minWidth: 500 }} aria-label="simple table">
            <TableBody>
              {poolStore.pools.map((pool: ICollatralPool) => (
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
    </AppPaper>
  );
});

export default PoolsListView;
