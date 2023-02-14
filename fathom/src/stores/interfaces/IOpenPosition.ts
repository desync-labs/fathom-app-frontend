export default interface IOpenPosition {
  collateralPool: string
  collateralPoolName: string;
  debtShare: string;
  debtValue: string;
  id: string;
  lockedCollateral: string;
  positionAddress: string;
  positionId: string
  positionStatus: string
  safetyBuffer: string;
  safetyBufferInPercent: string
  tvl: string
  walletAddress: string
}
