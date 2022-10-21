import React, { useCallback, useEffect } from "react";
import { Grid, Box, Typography } from "@mui/material";
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
      <Grid item xs={12} md={9} lg={7}>
        <Typography
          component="h2"
          variant="h6"
          gutterBottom
          sx={{ fontWeight: "bold", fontSize: "1.9rem" }}
        >
          FXD
        </Typography>
        <Box sx={{ fontSize: "14px", color: "#9FADC6" }}>
          FXD is an auto-farming stablecoin that earns passive yields for you in
          the background. Now, instead of paying for loans, you can get loans
          while earning on your collateral.
        </Box>
      </Grid>
      <Grid item xs={12}>
        <ProtocolStats />
      </Grid>
      <Grid item xs={12}>
        <PoolsListView />
      </Grid>
      <Grid item xs={12} sx={{ marginTop: '30px' }}>
        <OpenPositionsList />
      </Grid>
    </Grid>
  );
});

export default DashboardContent;
