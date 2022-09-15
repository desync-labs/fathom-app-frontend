//import ICollatralPool from "../../stores/interfaces/ICollatralPool";
import {observer} from 'mobx-react'
import { useEffect } from 'react';
import { useStores } from "../../stores";
import { LogLevel, useLogger } from '../../helpers/Logger';
import { Link, Typography } from '@mui/material';
import React from 'react';

// import { useWinstonLogger } from 'winston-react'

 
const PoolListView = observer(() => {

  let poolStore = useStores().poolStore;
  let positionStore = useStores().positionStore;
  let logger = useLogger();
  // const logger = useWinstonLogger();


  useEffect(() => {
    // Update the document title using the browser API
    logger.log(LogLevel.info,'fetching pool information.');
    poolStore.fetchPools()
  },[]); 

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
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={positionStore.openPosition}>
          Open Position
        </Link>
      </div>
    </React.Fragment>

    )}
  </>
  );
})

export default PoolListView;
