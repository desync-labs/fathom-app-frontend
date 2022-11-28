import ActiveWeb3Transactions from "stores/transaction.store";

export default interface IStableSwapService {
  swapTokenToStableCoin(
    address: string,
    tokenIn: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;
  swapStableCoinToToken(
    address: string,
    stableCoinIn: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;
  approveStableCoin(
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
