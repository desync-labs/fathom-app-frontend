import * as React from 'react';
import { styled, createTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';

import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import useMetaMask from '../../hooks/metamask';
import PoolListView from '../Pools/PoolListView';
import OpenPositionsList from '../PositionList/OpenPositionsList';
import { useStores } from '../../stores';
import { LogLevel, useLogger } from '../../helpers/Logger';
import { useEffect } from 'react';
import { observer } from 'mobx-react';

const DashboardContent = observer(() => {

  let poolStore = useStores().poolStore;
  let logger = useLogger();

  useEffect(() => {
    // Update the document title using the browser API
    logger.log(LogLevel.info,'fetching pool information.');
    poolStore.fetchPools()
  },[poolStore]);

  return (
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={6}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                    <div>Protocol Stats...</div>
                </Paper>
              </Grid>
              {/* Available Pools */}
              { poolStore.pools.map(
                  (pool, idx) =>
                  <Grid item xs={12} md={4} lg={3}>
                    <PoolListView pool={pool}/>
                  </Grid>
             )}
              <Grid item xs={12}>
                <OpenPositionsList />
              </Grid>
            </Grid>
          </Container>
        </Box>
  );
})

export default DashboardContent;