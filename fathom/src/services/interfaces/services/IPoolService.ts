import Xdc3 from "xdc3";

export default interface IPoolService {
  getUserTokenBalance(address: string, forAddress: string, library: Xdc3): Promise<number>;

  getTokenDecimals(forAddress: string, library: Xdc3): Promise<number>;

  getDexPrice(forAddress: string, library: Xdc3): Promise<number>;

  getCollateralTokenAddress(forAddress: string, library: Xdc3): Promise<string>;
}
