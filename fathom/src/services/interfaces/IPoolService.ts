
export default interface IPoolService {
  getUserTokenBalance(address: string, forAddress: string): Promise<number>;
  getDexPrice(forAddress: string): Promise<number>;
  getCollateralTokenAddress(forAddress: string): Promise<string>;
}
