import React, { useCallback, useEffect } from "react";
import Grid from "@mui/material/Grid";
import OpenPositionsList from "../PositionList/OpenPositionsList";
import { useStores } from "../../stores";
import { LogLevel, useLogger } from "../../helpers/Logger";
import { observer } from "mobx-react";
import ProtocolStats from "./ProtocolStats";
import { useWeb3React } from "@web3-react/core";
import PoolsListView from "../Pools/PoolsListView";
import debounce from "lodash.debounce";

const DashboardContent = observer(() => {
  const { chainId, account } = useWeb3React();
  const rootStore = useStores();
  const { poolStore, positionStore } = rootStore;
  const logger = useLogger();

  const fetchData = useCallback(
    debounce(async () => {
      await poolStore.fetchPools();
      await positionStore.fetchPositions(account!);
    }, 100),
    [poolStore, positionStore, account]
  );

  useEffect(() => {
    if (chainId && account) {
      logger.log(LogLevel.info, "fetching pool information.");
      fetchData();
    } else {
      poolStore.setPool([]);
    }
  }, [poolStore, logger, chainId, account, fetchData]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8} lg={6}>
        <ProtocolStats />
      </Grid>
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
