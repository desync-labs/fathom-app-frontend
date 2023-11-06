import Xdc3 from "xdc3";

export default interface IStakingService {
  createLock(
    account: string,
    stakePosition: number,
    unlockPeriod: number,
    library: Xdc3
  ): Promise<number|Error>;

  handleUnlock(
    account: string,
    lockId: number,
    amount: number,
    library: Xdc3
  ): Promise<number|Error>;

  handleEarlyWithdrawal(
    account: string,
    lockId: number,
    library: Xdc3
  ): Promise<number|Error>;

  handleClaimRewards(
    account: string,
    streamId: number,
    library: Xdc3
  ): Promise<number|Error>;

  handleWithdrawAll(
    account: string,
    streamId: number,
    library: Xdc3
  ): Promise<number|Error>;

  approveStakingFTHM(
    address: string,
    fthmTokenAddress: string,
    library: Xdc3
  ): Promise<number|Error>;

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

  getMinLockPeriod(library: Xdc3): Promise<number>;
}
