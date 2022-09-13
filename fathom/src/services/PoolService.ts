import ICollatralPool from "../stores/interfaces/ICollatralPool";
import IPoolService from "./interfaces/IPoolService";

export default class PoolService implements IPoolService{

    async fetchPools(): Promise<ICollatralPool> {
       console.log('fetching Pools...'); 
       await setInterval(() => {
        console.log('wait is over...'); 
       }, 10000);

       console.log('returning data...'); 
       return {id:'5', name:'iBNB', tvl: 6000}

    }

}