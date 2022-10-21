export default interface ICollateralPool {
  id: string;
  name: string;
  availableFathom: string;
  borrowedFathom: string;
  collateralContractAddress: string;
  CollateralTokenAdapterAddress: string;
  allowOpenPosition: boolean;
}
