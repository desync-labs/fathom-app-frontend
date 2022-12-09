import ActiveWeb3Transactions from "stores/transaction.store";

export default interface IStakingService {
  createLock(
    account: string,
    stakePosition: number,
    unlockPeriod: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;

  handleUnlock(
    account: string,
    lockId: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;

  handleEarlyWithdrawal(
    account: string,
    lockId: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;

  handleClaimRewards(
    account: string,
    streamId: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;

  handleWithdrawAll(
    account: string,
    streamId: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;

  approvalStatusStakingFTHM(
    address: string,
    stakingPosition: number,
    fthmTokenAddress: string,
  ): Promise<boolean>;

  getStreamClaimableAmountPerLock(
    streamId: number,
    account: string,
    lockId: number
  ): Promise<number>

  approveStakingFTHM(
    address: string,
    fthmTokenAddress: string,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;
}
