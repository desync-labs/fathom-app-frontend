import ActiveWeb3Transactions from "stores/transaction.store";
import Xdc3 from "xdc3";

export default interface IStakingService {
  createLock(
    account: string,
    stakePosition: number,
    unlockPeriod: number,
    transactionStore: ActiveWeb3Transactions,
    library: Xdc3
  ): Promise<void>;

  handleUnlock(
    account: string,
    lockId: number,
    amount: number,
    transactionStore: ActiveWeb3Transactions,
    library: Xdc3
  ): Promise<void>;

  handleEarlyWithdrawal(
    account: string,
    lockId: number,
    transactionStore: ActiveWeb3Transactions,
    library: Xdc3
  ): Promise<void>;

  handleClaimRewards(
    account: string,
    streamId: number,
    transactionStore: ActiveWeb3Transactions,
    library: Xdc3
  ): Promise<void>;

  handleWithdrawAll(
    account: string,
    streamId: number,
    transactionStore: ActiveWeb3Transactions,
    library: Xdc3
  ): Promise<void>;

  approvalStatusStakingFTHM(
    address: string,
    stakingPosition: number,
    fthmTokenAddress: string,
    library: Xdc3
  ): Promise<boolean>;

  getStreamClaimableAmountPerLock(
    streamId: number,
    account: string,
    lockId: number,
    library: Xdc3
  ): Promise<number>;

  getPairPrice(token0: string, token1: string, library: Xdc3): Promise<number>;

  getStreamClaimableAmount(account: string, library: Xdc3): Promise<number>;

  approveStakingFTHM(
    address: string,
    fthmTokenAddress: string,
    transactionStore: ActiveWeb3Transactions,
    library: Xdc3
  ): Promise<void>;
}
