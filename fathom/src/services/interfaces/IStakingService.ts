import ILockPosition from "stores/interfaces/ILockPosition";
import ActiveWeb3Transactions from "stores/transaction.store";

export default interface IStakingService {
  createLock(
    address: string,
    stakePosition: number,
    unlockPeriod: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;

  getLockPositions(account: string): Promise<ILockPosition[]>;

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
  handleWithdrawRewards(
    account: string,
    streamId: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;
  getAPR(): Promise<number>;
  getWalletBalance(account: string): Promise<number>;
  getVOTEBalance(account: string): Promise<number>;
  handleClaimRewardsSingle(
    account: string,
    lockId: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;

  getLockInfo(
    lockId: number,
    account: string,
  ): Promise<ILockPosition>;

  getLockPositionsLength(account: string): Promise<number>;

  approvalStatusStakingFTHM(
    address: string,
    stakingPosition: number,
  ): Promise<Boolean>;
  approveStakingFTHM(
    address: string,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;
}
