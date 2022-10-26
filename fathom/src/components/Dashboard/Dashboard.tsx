import React, { useCallback, useEffect } from "react";
import { Grid } from "@mui/material";
import OpenPositionsList from "components/PositionList/OpenPositionsList";
import { useStores } from "stores";
import { LogLevel, useLogger } from "helpers/Logger";
import { observer } from "mobx-react";
import ProtocolStats from "components/Dashboard/ProtocolStats";
import { useWeb3React } from "@web3-react/core";
import PoolsListView from "components/Pools/PoolsListView";
import debounce from "lodash.debounce";
import { PageHeader } from "components/Dashboard/PageHeader";

const DashboardContent = observer(() => {
  const { chainId, account } = useWeb3React();
  const { poolStore, positionStore } = useStores();
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
      <PageHeader
        title={"FXD"}
        description={
          " FXD is an auto-farming stablecoin that earns passive yields for you in\n" +
          "        the background. Now, instead of paying for loans, you can get loans\n" +
          "        while earning on your collateral."
        }
      />
      <Grid item xs={12}>
        <ProtocolStats />
      </Grid>
      <Grid item xs={12}>
        <PoolsListView />
      </Grid>
      <Grid item xs={12} sx={{ marginTop: "30px" }}>
        <OpenPositionsList />
      </Grid>
    </Grid>
  );
});

export default DashboardContent;
