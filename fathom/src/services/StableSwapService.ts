import { SmartContractFactory } from "../config/SmartContractFactory";
import { Constants } from "../helpers/Constants";
import { Web3Utils } from "../helpers/Web3Utils";
import IStableSwapService from "./interfaces/IStableSwapService";


export default class StableSwapService implements IStableSwapService{
    readonly tokenBuffer:number = 5;

    async swapTokenToStablecoin(address: string, tokenIn: number): Promise<void> {
        try{
            console.log(`Performing swapTokenToStablecoin from address: ${address} amount: ${tokenIn}`)
            const USDT = Web3Utils.getContractInstance(SmartContractFactory.USDT)
            let buffer = Number(tokenIn) + Number((tokenIn * this.tokenBuffer / 100))
            await USDT.methods.approve(SmartContractFactory.AuthtokenAdapter.address, Constants.WeiPerWad.multipliedBy(buffer)).send({from:address});
    
            const stableSwapModule = Web3Utils.getContractInstance(SmartContractFactory.StableSwapModule)
            
            await stableSwapModule.methods.swapTokenToStablecoin(address, Constants.WeiPerWad.multipliedBy(tokenIn)).send({from:address});
        }catch(error){
            console.error(`Error in swapTokenToStablecoin`)
            throw error;
        }
    }

    async swapStablecoinToToken(address: string, stablecoinIn: number): Promise<void> {
        try{
            console.log(`Performing swapTokenToStablecoin from address: ${address} amount: ${stablecoinIn}`)
            const fathomStableCoin = Web3Utils.getContractInstance(SmartContractFactory.FathomStableCoin)
            const stableSwapModule = Web3Utils.getContractInstance(SmartContractFactory.StableSwapModule)
    
            let buffer = Number(stablecoinIn) + Number((stablecoinIn * this.tokenBuffer / 100))
            await fathomStableCoin.methods.approve(SmartContractFactory.StableSwapModule.address, Constants.WeiPerWad.multipliedBy(buffer)).send({from:address});
            await stableSwapModule.methods.swapStablecoinToToken(address, Constants.WeiPerWad.multipliedBy(stablecoinIn)).send({from:address});
        }catch(error){
            console.error(`Error in swapStablecoinToToke ${error}`)
            throw error;
        }
    }
}