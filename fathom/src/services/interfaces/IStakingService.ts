import ILockPosition from "stores/interfaces/ILockPosition";
import ActiveWeb3Transactions from "stores/transaction.store";

export default interface IStakingService {
  createLock(
    address: string,
    stakePosition: number,
    unlockPeriod: number,
    chainId: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;

  getLockPositions(account: string, chainId: number): Promise<ILockPosition[]>;

  handleUnlock(
    account: string,
    lockId: number,
    chainId: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;

  handleEarlyWithdrawal(
    account: string,
    lockId: number,
    chainId: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;

  handleClaimRewards(
    account: string,
    streamId: number,
    chainId: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;
  handleWithdrawRewards(
    account: string,
    streamId: number,
    chainId: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;
  getAPR(chainId: number): Promise<number>;
  getWalletBalance(account: string, chainId: number): Promise<number>;
  getVOTEBalance(account: string, chainId: number): Promise<number>;
  handleClaimRewardsSingle(
    account: string,
    lockId: number,
    chainId: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;

  getLockInfo(
    lockId: number,
    account: string,
    chainId: number
  ): Promise<ILockPosition>;

  getLockPositionsLength(account: string, chainId: number): Promise<number>;

  approvalStatusStakingFTHM(
    address: string,
    stakingPosition: number,
    chainId: number
  ): Promise<Boolean>;
  approveStakingFTHM(
    address: string,
    chainId: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;
}
