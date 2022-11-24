export default interface IOpenPosition {
  collatralPool: string
  collatralPoolName: string;
  debtShare: string;
  id: string;
  liquidtionPrice: string;
  lockedCollateral: string;
  positionAddress: string;
  positionId: string
  positionStatus: string
  safetyBuffer: string;
  safetyBufferInPrecent: string
  tvl: string
  walletAddress: string
}
