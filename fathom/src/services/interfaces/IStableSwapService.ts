import Xdc3 from "xdc3";
import { TransactionReceipt } from "web3-eth";

export default interface IStableSwapService {
  swapTokenToStableCoin(
    address: string,
    tokenIn: number,
    tokenName: string,
    library: Xdc3
  ): Promise<number>;
  swapStableCoinToToken(
    address: string,
    stableCoinIn: number,
    tokenName: string,
    library: Xdc3
  ): Promise<number>;
  approveStableCoin(
    address: string,
    library: Xdc3
  ): Promise<number>;
  approveUsdt(
    address: string,
    tokenName: string,
    library: Xdc3
  ): Promise<number>;
  approvalStatusStableCoin(
    address: string,
    tokenIn: number,
    library: Xdc3
  ): Promise<boolean | undefined>;
  approvalStatusUsdt(
    address: string,
    tokenIn: number,
    library: Xdc3
  ): Promise<boolean | undefined>;

  getFeeIn(library: Xdc3): Promise<number>;
  getFeeOut(library: Xdc3): Promise<number>;
  getLastUpdate(library: Xdc3): Promise<number>;
  getDailySwapLimit(library: Xdc3): Promise<number>;
  getPoolBalance(tokenAddress: string, library: Xdc3): Promise<number>;

  isDecentralizedState(library: Xdc3) : Promise<boolean>;
  isUserWhitelisted(address: string, library: Xdc3) : Promise<boolean>
}
