import ILockPosition from "stores/interfaces/ILockPosition";
import ActiveWeb3Transactions from "stores/transaction.store";

export default interface IStakingService {
  createLock(
    account: string,
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

  handleClaimRewardsSingle(
    account: string,
    streamId: number,
    lockId: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;

  handleWithdrawAll(
    account: string,
    streamId: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;

  getAPR(): Promise<number>;
  getWalletBalance(account: string, fthmTokenAddress: string): Promise<number>;
  getVOTEBalance(account: string): Promise<number>;

  getLockInfo(
    lockId: number,
    account: string,
  ): Promise<ILockPosition>;

  getLockPositionsLength(account: string): Promise<number>;

  approvalStatusStakingFTHM(
    address: string,
    stakingPosition: number,
    fthmTokenAddress: string,
  ): Promise<Boolean>;
  approveStakingFTHM(
    address: string,
    fthmTokenAddress: string,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;
}
