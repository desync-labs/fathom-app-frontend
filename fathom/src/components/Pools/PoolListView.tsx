//import ICollatralPool from "../../stores/interfaces/ICollatralPool";
import {observer} from 'mobx-react'
import { useEffect } from 'react';

import { useStores } from "../../stores";

 
const PoolListView = observer(() => {

  let poolStore = useStores().poolStore;

  useEffect(() => {
    // Update the document title using the browser API
    poolStore.fetchPools()
  },[]); 

  return (
    <div>
      <ul>
        { poolStore.pools.map(
          (pool, idx) => <div key={ idx } >{pool.name}</div>
        ) }
      </ul>
    </div>
  );
})

export default PoolListView;
