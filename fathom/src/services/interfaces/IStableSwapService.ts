import ActiveWeb3Transactions from "stores/transaction.store";

export default interface IStableSwapService {
  swapTokenToStablecoin(
    address: string,
    tokenIn: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;
  swapStablecoinToToken(
    address: string,
    stablecoinIn: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;
  approveStablecoin(
    address: string,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;
  approveUsdt(
    address: string,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;
  approvalStatusStablecoin(address: string, tokenIn: number): Promise<Boolean>;
  approvalStatusUsdt(address: string, tokenIn: number): Promise<Boolean>;
}
