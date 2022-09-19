//import ICollatralPool from "../../stores/interfaces/ICollatralPool";
import {observer} from 'mobx-react'
import { useEffect } from 'react';
import { useStores } from "../../stores";
import { LogLevel, useLogger } from '../../helpers/Logger';
import { Link, Typography } from '@mui/material';
import React from 'react';
import useMetaMask from '../../hooks/metamask';
import CustomizedDialogs from '../Positions/OpenNewPositionDialog';

 
const PoolListView = observer(() => {

  let poolStore = useStores().poolStore;
  let logger = useLogger();


  useEffect(() => {
    // Update the document title using the browser API
    logger.log(LogLevel.info,'fetching pool information.');
    poolStore.fetchPools()
  },[poolStore]);


  return (
    <>
    { poolStore.pools.map(
      (pool, idx) =>
      <React.Fragment key={ idx }>
      
      <Typography component="h2" variant="h5" color="primary" gutterBottom>
        {pool.name} Pool
        </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
          Available Fathom  
      </Typography>
      <Typography component="p" variant="h4">
        {pool.availableFathom}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
         Borrowed Fathom
      </Typography>
      <Typography component="p" variant="h4">
        {pool.borrowedFathom}
      </Typography >
      <CustomizedDialogs pool={pool} />
    </React.Fragment>

    )}
  </>
  );
})

export default PoolListView;
