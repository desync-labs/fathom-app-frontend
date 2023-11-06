export default interface ILockPosition {
  rewardsAvailable: number;
  id: string;
  account: string;
  streamShares: string;
  nVoteToken: number;
  amount: number;
  lockId: number;
  end: number;
  blockNumber: number;
  blockTimestamp: number;
  transaction: string;
}
