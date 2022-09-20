import { SmartContractFactory } from "../config/SmartContractFactory";
import { Constants } from "../helpers/Constants";
import { Web3Utils } from "../helpers/Web3Utils";
import IStableSwapService from "./interfaces/IStableSwapService";


export default class StableSwapService implements IStableSwapService{

    async swapTokenToStablecoin(address: string, tokenIn: number): Promise<void> {
        try{
            console.log(`Performing swapTokenToStablecoin from address: ${address} amount: ${tokenIn}`)
            const WXDC = Web3Utils.getContractInstance(SmartContractFactory.WXDC)
            await WXDC.methods.approve(SmartContractFactory.AuthtokenAdapter.address, Constants.WeiPerWad.multipliedBy(tokenIn)).send({from:address});
    
            const stableSwapModule = Web3Utils.getContractInstance(SmartContractFactory.StableSwapModule)
            
            await stableSwapModule.methods.swapTokenToStablecoin(address, Constants.WeiPerWad.multipliedBy(tokenIn)).send({from:address});
        }catch(error){
            console.error(`Error in swapTokenToStablecoin`)
        }
    }

    async swapStablecoinToToken(address: string, stablecoinIn: number): Promise<void> {
        
        try{
            console.log(`Performing swapTokenToStablecoin from address: ${address} amount: ${stablecoinIn}`)
            const fathomStableCoin = Web3Utils.getContractInstance(SmartContractFactory.FathomStableCoin)
            const stableSwapModule = Web3Utils.getContractInstance(SmartContractFactory.StableSwapModule)
    
            await fathomStableCoin.methods.approve(stableSwapModule.address, Constants.WeiPerWad.multipliedBy(stablecoinIn)).send({from:address});
            
            await stableSwapModule.methods.swapStablecoinToToken(address, Constants.WeiPerWad.multipliedBy(stablecoinIn)).send({from:address});
        }catch(error){
            console.error(`Error in swapStablecoinToToken`)
        }
    }
}