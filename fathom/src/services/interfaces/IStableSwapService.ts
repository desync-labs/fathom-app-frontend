import ActiveWeb3Transactions from "../../stores/transaction.store";

export default interface IStableSwapService{
    swapTokenToStablecoin(address:string, tokenIn:number,transactionStore:ActiveWeb3Transactions): Promise<void>;
    swapStablecoinToToken(address:string, stablecoinIn:number,transactionStore:ActiveWeb3Transactions): Promise<void>;
}