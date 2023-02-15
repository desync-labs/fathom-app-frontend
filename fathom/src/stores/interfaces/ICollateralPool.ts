export default interface ICollateralPool {
  id: string;
  collateralLastPrice: string;
  collateralPrice: string;
  debtAccumulatedRate: string;
  debtCeiling: string;
  liquidationRatio: string;
  lockedCollateral: string;
  poolName: string;
  priceWithSafetyMargin: string;
  stabilityFeeRate: string
  totalAvailable: string;
  totalBorrowed: string;
  tvl: string;
  tokenAdapterAddress: string;
}
