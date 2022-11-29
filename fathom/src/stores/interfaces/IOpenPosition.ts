export default interface IOpenPosition {
  collateralPool: string
  collateralPoolName: string;
  debtShare: string;
  id: string;
  liquidationPrice: string;
  lockedCollateral: string;
  positionAddress: string;
  positionId: string
  positionStatus: string
  safetyBuffer: string;
  safetyBufferInPrecent: string
  tvl: string
  walletAddress: string
}
