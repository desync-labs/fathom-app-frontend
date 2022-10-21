import ICollateralPool from "stores/interfaces/ICollateralPool";

export default interface IPoolService {
  fetchPools(): Promise<ICollateralPool[]>;
  getPriceWithSafetyMargin(pool: ICollateralPool): Promise<number>;
  getUserTokenBalance(address: string, pool: ICollateralPool): Promise<number>;
  getDexPrice(forAddress: string): Promise<number>;
}
