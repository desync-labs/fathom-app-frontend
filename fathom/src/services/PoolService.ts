import { SmartContractFactory } from "../config/SmartContractFactory";
import ICollatralPool from "../stores/interfaces/ICollatralPool";
import IPoolService from "./interfaces/IPoolService";
import BigNumber from "bignumber.js";
import { Constants } from "../helpers/Constants";
import { Web3Utils } from "../helpers/Web3Utils";



export default class PoolService implements IPoolService{
    
    //Ideally this should be dynamic
    getPools():ICollatralPool[]{
        let pools:ICollatralPool[] =  []
        //
        pools.push({
            id: '0x57584443000000000000000000000000000000000000000000000000000000',
            name:'WXDC',
            availableFathom: '',
            borrowedFathom: ''
        },
        {
            id: '0x555344542d535441424c450000000000000000000000000000000000000000',
            name:'USDT',
            availableFathom: '',
            borrowedFathom: ''
        })

        return pools;
    }

    async fetchPools(): Promise<ICollatralPool[]> {

       console.log('fetching Pools...');
       let pools:ICollatralPool[] = []
       try{
        let contract = Web3Utils.getContractInstance(SmartContractFactory.PoolConfig)
        let pool  = this.getPools()[0];
        //this.getPools().forEach(async (pool) => {
        let response = await contract.methods.getCollateralPoolInfo(pool.id).call();
        let debtShare = new BigNumber(response[1]).div(Constants.WeiPerWad)
        let debtCeiling = new BigNumber(response[2]).div(Constants.WeiPerRad)
        pool.availableFathom = debtCeiling.minus(debtShare).toFormat(0)
        pool.borrowedFathom = debtShare.toFormat(0)
        pools.push(pool)
        //});

        console.log(`Pool details ${JSON.stringify(pools)} `);
        return pools;

       }catch(exception){
        console.log(`Error fetching pool information: ${exception}`)
       } finally{
        return pools;
       }
    }
}