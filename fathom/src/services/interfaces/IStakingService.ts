import ActiveWeb3Transactions from "stores/transaction.store";
import { Web3Utils } from "../../helpers/Web3Utils";
import { SmartContractFactory } from "../../config/SmartContractFactory";

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
    amount: number,
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
    fthmTokenAddress: string
  ): Promise<boolean>;

  getStreamClaimableAmountPerLock(
    streamId: number,
    account: string,
    lockId: number
  ): Promise<number>;

  getPairPrice(token0: string, token1: string): Promise<number>;

  getStreamClaimableAmount(account: string): Promise<number>;

  approveStakingFTHM(
    address: string,
    fthmTokenAddress: string,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;
}
