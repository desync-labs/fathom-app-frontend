import ICollateralPool from "stores/interfaces/ICollateralPool";

export default interface IPoolService {
  getUserTokenBalance(address: string, forAddress: string): Promise<number>;
  getDexPrice(forAddress: string): Promise<number>;
}
