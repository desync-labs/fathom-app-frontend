import React, { useCallback, useEffect } from "react";
import { Grid, Container } from "@mui/material";
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <PageHeader
          title={"FXD"}
          description={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget tristique malesuada pulvinar commodo. Euismod massa, dis metus mattis porttitor ac est quis. Ut quis cursus ac nunc, aliquam curabitur nisl amet. Elit etiam dignissim orci. If this is the first-time you’re here, please <a href="/">visit our Whitepaper.</a`}
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
    </Container>
  );
});

export default DashboardContent;
