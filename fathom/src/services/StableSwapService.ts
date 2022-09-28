import { SmartContractFactory } from "../config/SmartContractFactory";
import { Constants } from "../helpers/Constants";
import { Web3Utils } from "../helpers/Web3Utils";
import { TransactionStatus, TransactionType } from "../stores/interfaces/ITransaction";
import ActiveWeb3Transactions from "../stores/transaction.store";
import IStableSwapService from "./interfaces/IStableSwapService";
import BigNumber from "bignumber.js";


export default class StableSwapService implements IStableSwapService{
    readonly tokenBuffer:number = 5;

    async swapTokenToStablecoin(address: string, tokenIn: number,transactionStore:ActiveWeb3Transactions ): Promise<void> {
        try{
            console.log(`Performing swapTokenToStablecoin from address: ${address} amount: ${tokenIn}`)
          
    
            const stableSwapModule = Web3Utils.getContractInstance(SmartContractFactory.StableSwapModule)
            
            await stableSwapModule.methods.swapTokenToStablecoin(address, Constants.WeiPerWad.multipliedBy(tokenIn).toString()).send({from:address}).on('transactionHash', (hash:any) => {
                                        transactionStore.addTransaction({hash:hash, 
                                                type:TransactionType.ClosePosition,
                                                active:false, 
                                                status:TransactionStatus.None,
                                                title:'USDT to FXD Swap Pending.',
                                                message:'Click on transaction to view on Etherscan.'
                                            })
                                        })
        }catch(error){
            console.error(`Error in swapTokenToStablecoin ${error}`)
            throw error;
        }
    }

    async swapStablecoinToToken(address: string, stablecoinIn: number,transactionStore:ActiveWeb3Transactions): Promise<void> {
        try{
            console.log(`Performing swapTokenToStablecoin from address: ${address} amount: ${stablecoinIn}`)
            const stableSwapModule = Web3Utils.getContractInstance(SmartContractFactory.StableSwapModule)

            await stableSwapModule.methods.swapStablecoinToToken(address, Constants.WeiPerWad.multipliedBy(stablecoinIn).toString()).send({from:address}).on('transactionHash', (hash:any) => {
                                        transactionStore.addTransaction({hash:hash, 
                                                type:TransactionType.ClosePosition,
                                                active:false, 
                                                status:TransactionStatus.None,
                                                title:'FXD to USDT Swap Pending.',
                                                message:'Click on transaction to view on Etherscan.'
                                            })
                                        })
        
        }catch(error){
            console.error(`Error in swapStablecoinToToke ${error}`)
            throw error;
        }
    }

    async approveStablecoin(address:string, transactionStore:ActiveWeb3Transactions): Promise<void>{
        try{

            const fathomStableCoin = Web3Utils.getContractInstance(SmartContractFactory.FathomStableCoin)

            await fathomStableCoin.methods.approve(SmartContractFactory.StableSwapModule.address,  Constants.MAX_UINT256).send({from:address}).on('transactionHash', (hash:any) => {
                transactionStore.addTransaction({hash:hash, 
                        type:TransactionType.ClosePosition,
                        active:false, 
                        status:TransactionStatus.None,
                        title:'Approval Pending.',
                        message:'Click on transaction to view on Etherscan.'
                    })
                })
        }catch(error){
            console.error(`Error in open position approve token: ${error}`)
            throw error;
        }
    }

    async approveUsdt(address:string, tokenIn:number, transactionStore:ActiveWeb3Transactions): Promise<void>{
        try{
            const USDT = Web3Utils.getContractInstance(SmartContractFactory.USDT)

            await USDT.methods.approve(SmartContractFactory.AuthtokenAdapter.address,  Constants.MAX_UINT256).send({from:address}).on('transactionHash', (hash:any) => {
                                        transactionStore.addTransaction({hash:hash, 
                                                type:TransactionType.ClosePosition,
                                                active:false, 
                                                status:TransactionStatus.None,
                                                title:'Approval Pending',
                                                message:'Click on transaction to view on Etherscan.'
                                            })
                                        })
        }catch(error){
            console.error(`Error in open position approve token: ${error}`)
            throw error;
        }
    }

    async approvalStatusStablecoin(address:string, tokenIn:number): Promise<Boolean>{
        try{
            const fathomStableCoin = Web3Utils.getContractInstance(SmartContractFactory.FathomStableCoin)

            let allowance = await fathomStableCoin.methods.allowance(address, SmartContractFactory.StableSwapModule.address).call()
            
            let buffer = Number(tokenIn) + Number((tokenIn * this.tokenBuffer / 100))

            return +allowance > +Constants.WeiPerWad.multipliedBy(buffer)
        }catch(error){
            console.error(`Error in open position approve token: ${error}`)
            throw error;
        }
    }

    async approvalStatusUsdt(address:string, tokenIn:number): Promise<Boolean>{
        try{
            const USDT = Web3Utils.getContractInstance(SmartContractFactory.USDT)

            let allowance = await USDT.methods.allowance(address, SmartContractFactory.AuthtokenAdapter.address).call()

            let buffer = Number(tokenIn) + Number((tokenIn * this.tokenBuffer / 100))
            
            return +allowance > +Constants.WeiPerWad.multipliedBy(buffer)
        }catch(error){
            console.error(`Error in open position approve token: ${error}`)
            throw error;
        }
    }
}