import * as React from 'react';
import Box from '@mui/material/Box';

import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import PoolListView from '../Pools/PoolListView';
import OpenPositionsList from '../PositionList/OpenPositionsList';
import { useStores } from '../../stores';
import { LogLevel, useLogger } from '../../helpers/Logger';
import { useEffect } from 'react';
import { observer } from 'mobx-react';
import AlertMessages from '../Common/AlertMessages';
import ProtocolStats from './ProtocolStats';
import TransactionStatus from '../Transaction/TransactionStatus';


const DashboardContent = observer(() => {

  let rootStore = useStores()
  let poolStore = useStores().poolStore;
  let logger = useLogger();

  useEffect(() => {
    // Update the document title using the browser API
    logger.log(LogLevel.info,'fetching pool information.');
    poolStore.fetchPools()
  },[poolStore,rootStore.alertStore, logger]);

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
          <AlertMessages/>
          <TransactionStatus/>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
             <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={6}>
                <ProtocolStats/>
              </Grid>
              {/* Available Pools */}
              { poolStore.pools.map(
                  (pool, idx) =>
                  <Grid key={idx} item xs={12} md={4} lg={3}>
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