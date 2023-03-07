export default interface ICollateralPool {
  id: string;
  collateralLastPrice: number;
  collateralPrice: number;
  debtAccumulatedRate: number;
  debtCeiling: number;
  liquidationRatio: number;
  lockedCollateral: number;
  poolName: string;
  priceWithSafetyMargin: number;
  stabilityFeeRate: number
  totalAvailable: number;
  totalBorrowed: number;
  tvl: number;
  tokenAdapterAddress: string;
}
