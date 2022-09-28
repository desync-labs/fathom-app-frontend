import React, { useEffect, useMemo } from "react";
import Box from "@mui/material/Box";

import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import PoolListView from "../Pools/PoolListView";
import OpenPositionsList from "../PositionList/OpenPositionsList";
import { useStores } from "../../stores";
import { LogLevel, useLogger } from "../../helpers/Logger";
import { observer } from "mobx-react";
import AlertMessages from "../Common/AlertMessages";
import ProtocolStats from "./ProtocolStats";
import TransactionStatus from "../Transaction/TransactionStatus";
import {
  UnsupportedChainIdError,
  useWeb3React
} from "@web3-react/core";

const DashboardContent = observer(() => {
  const { chainId, error } = useWeb3React()
  const rootStore = useStores();
  const { poolStore } = rootStore;
  const logger = useLogger();
  const unsupportedError = useMemo(() => (error as Error) instanceof UnsupportedChainIdError, [error]);

  useEffect(() => {
    // Update the document title using the browser API
    if (chainId && (!error || !unsupportedError)) {
      logger.log(LogLevel.info, "fetching pool information.");
      setTimeout(() => {
        poolStore.fetchPools();
      })
    } else {
      poolStore.setPool([])
    }
  }, [poolStore, rootStore.alertStore, logger, chainId, error, unsupportedError]);

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: "#000",
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Toolbar />
      <AlertMessages />
      <TransactionStatus />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Chart */}
          <Grid item xs={12} md={8} lg={6}>
            <ProtocolStats />
          </Grid>
          {/* Available Pools */}
          {poolStore.pools.map((pool, idx) => (
            <Grid key={idx} item xs={12} md={4} lg={3}>
              <PoolListView pool={pool} />
            </Grid>
          ))}
          <Grid item xs={12}>
            <OpenPositionsList />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
});

export default DashboardContent;
