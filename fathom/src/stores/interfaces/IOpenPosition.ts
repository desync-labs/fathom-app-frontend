export default interface IOpenPosition {
  collateralPool: string;
  collateralPoolName: string;
  debtShare: number;
  debtValue: number;
  id: string;
  liquidationPrice: number;
  lockedCollateral: number;
  positionAddress: string;
  positionId: string;
  positionStatus: string;
  safetyBuffer: string;
  safetyBufferInPercent: number;
  tvl: number;
  ltv: number;
  walletAddress: string;
}
