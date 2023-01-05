import ActiveWeb3Transactions from "stores/transaction.store";
import Xdc3 from "xdc3";

export default interface IStableSwapService {
  swapTokenToStableCoin(
    address: string,
    tokenIn: number,
    transactionStore: ActiveWeb3Transactions,
    library: Xdc3
  ): Promise<void>;
  swapStableCoinToToken(
    address: string,
    stableCoinIn: number,
    transactionStore: ActiveWeb3Transactions,
    library: Xdc3
  ): Promise<void>;
  approveStableCoin(
    address: string,
    transactionStore: ActiveWeb3Transactions,
    library: Xdc3
  ): Promise<void>;
  approveUsdt(
    address: string,
    transactionStore: ActiveWeb3Transactions,
    library: Xdc3
  ): Promise<void>;
  approvalStatusStablecoin(
    address: string,
    tokenIn: number,
    library: Xdc3
  ): Promise<Boolean>;
  approvalStatusUsdt(
    address: string,
    tokenIn: number,
    library: Xdc3
  ): Promise<Boolean>;

  getFeeIn(library: Xdc3): Promise<number>;
  getFeeOut(library: Xdc3): Promise<number>;
}
