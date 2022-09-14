// import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { SmartContractFactory } from "../config/SmartContractFactory";
import ICollatralPool from "../stores/interfaces/ICollatralPool";
import IPoolService from "./interfaces/IPoolService";
import BigNumber from "bignumber.js";

// function GetProvider (){
//     let { library, chainId, account } = useWeb3React();
//     let web3 = new Web3(library.provider);
//     return web3;
// }


export default class PoolService implements IPoolService{
    
    // web3
    // constructor(){
    //     this.web3 = GetProvider()
    // }

    //Ideally this should be dynamic
    getPools():ICollatralPool[]{
        let pools:ICollatralPool[] =  []
        
        pools.push({
            id: '0x5553445400000000000000000000000000000000000000000000000000000000',
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
        let poolConfigMetaData = SmartContractFactory.PoolConfig;
        var web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

        let contract = new web3.eth.Contract(poolConfigMetaData.abi, poolConfigMetaData.address)

        let pool  = this.getPools()[0];
        //this.getPools().forEach(async (pool) => {
        let response = await contract.methods.getCollateralPoolInfo(pool.id).call();
        let debtShare = new BigNumber(response[1])
        let debtCeiling = new BigNumber(response[2]).div('1e45')
        pool.availableFathom = debtCeiling.minus(debtShare).toFormat(0)
        pool.borrowedFathom = debtShare.toFormat(0)
        pools.push(pool)
        //});

        console.log(JSON.stringify(pools));
        return pools;

       }catch(exception){
        console.log(`Error fetching pool information: ${exception}`)
       } finally{
        return pools;
       }
    }

    async openPosition(): Promise<void>{
        console.log('Opening a position...')

    }

}