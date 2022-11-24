import ICollateralPool from "stores/interfaces/ICollateralPool";

export default interface IPoolService {
  getPriceWithSafetyMargin(pool: ICollateralPool): Promise<number>;
  getUserTokenBalance(address: string, forAddress: string): Promise<number>;
  getDexPrice(forAddress: string): Promise<number>;
}
