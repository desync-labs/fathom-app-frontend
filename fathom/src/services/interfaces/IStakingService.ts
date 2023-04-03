import Xdc3 from "xdc3";

export default interface IStakingService {
  createLock(
    account: string,
    stakePosition: number,
    unlockPeriod: number,
    library: Xdc3
  ): Promise<number>;

  handleUnlock(
    account: string,
    lockId: number,
    amount: number,
    library: Xdc3
  ): Promise<number>;

  handleEarlyWithdrawal(
    account: string,
    lockId: number,
    library: Xdc3
  ): Promise<number>;

  handleClaimRewards(
    account: string,
    streamId: number,
    library: Xdc3
  ): Promise<number>;

  handleWithdrawAll(
    account: string,
    streamId: number,
    library: Xdc3
  ): Promise<number>;

  approvalStatusStakingFTHM(
    address: string,
    stakingPosition: number,
    fthmTokenAddress: string,
    library: Xdc3
  ): Promise<boolean | undefined>;

  getStreamClaimableAmountPerLock(
    streamId: number,
    account: string,
    lockId: number,
    library: Xdc3
  ): Promise<number>;

  getPairPrice(token0: string, token1: string, library: Xdc3): Promise<number>;

  getStreamClaimableAmount(account: string, library: Xdc3): Promise<number>;

  getMinLockPeriod(library: Xdc3): Promise<number>;

  approveStakingFTHM(
    address: string,
    fthmTokenAddress: string,
    library: Xdc3
  ): Promise<number>;
}
