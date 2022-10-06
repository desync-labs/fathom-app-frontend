import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import OpenPositionsList from "../PositionList/OpenPositionsList";
import { useStores } from "../../stores";
import { LogLevel, useLogger } from "../../helpers/Logger";
import { observer } from "mobx-react";
import ProtocolStats from "./ProtocolStats";
import { useWeb3React } from "@web3-react/core";
import PoolsListView from "../Pools/PoolsListView";

const DashboardContent = observer(() => {
  const { chainId } = useWeb3React();
  const rootStore = useStores();
  const { poolStore } = rootStore;
  const logger = useLogger();

  useEffect(() => {
    if (chainId) {
      logger.log(LogLevel.info, "fetching pool information.");
      setTimeout(() => poolStore.fetchPools());
    } else {
      poolStore.setPool([]);
    }
  }, [poolStore, logger, chainId]);

  return (
    <Grid container spacing={3}>
      {/* Chart */}
      <Grid item xs={12} md={8} lg={6}>
        <ProtocolStats />
      </Grid>
      {/* Available Pools */}
      {/* {poolStore.pools.map((pool, idx) => (
        <Grid key={idx} item xs={12} md={4} lg={3}>
          <PoolListView pool={pool} />
        </Grid>
      ))} */}
      <Grid item xs={12} md={8} lg={6}>
        <PoolsListView />
      </Grid>
      <Grid item xs={12}>
        <OpenPositionsList />
      </Grid>
    </Grid>
  );
});

export default DashboardContent;
