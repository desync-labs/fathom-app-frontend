export default interface ICollateralPool {
  id: string;
  collatralLastPrice: string;
  collatralPrice: string;
  debtAccumulatedRate: string;
  debtCeiling: string;
  liquidtionRatio: string;
  lockedCollatral: string;
  poolName: string;
  priceWithSafetyMargin: string;
  stabilityFeeRate: string
  totalAvailable: string;
  totalBorrowed: string;
  tvl: string;

  collateralContractAddress: string;
  tokenAdapterAddress: string;
}
