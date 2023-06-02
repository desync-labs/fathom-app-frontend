import Xdc3 from "xdc3";
import { TransactionReceipt } from "web3-eth";

export default interface IStableSwapService {
  swapTokenToStableCoin(
    address: string,
    tokenIn: number,
    tokenInDecimals: number,
    tokenName: string,
    library: Xdc3
  ): Promise<number>;
  swapStableCoinToToken(
    address: string,
    stableCoinIn: number,
    stableCoinInDecimals: number,
    tokenName: string,
    library: Xdc3
  ): Promise<number>;
  addLiquidity(
    amount: number,
    account: string,
    library: Xdc3,
  ): Promise<any>;
  removeLiquidity(
    amount: number,
    account: string,
    library: Xdc3,
  ): Promise<any>;
  approveStableCoin(
    address: string,
    library: Xdc3,
    isStableSwapWrapper?: boolean,
  ): Promise<number>;
  approveUsdt(
    address: string,
    tokenName: string,
    library: Xdc3,
    isStableSwapWrapper?: boolean,
  ): Promise<number>;
  approvalStatusStableCoin(
    address: string,
    tokenIn: number,
    inputDecimal: number,
    library: Xdc3,
    isStableSwapWrapper?: boolean,
  ): Promise<boolean | undefined>;
  approvalStatusUsdt(
    address: string,
    tokenIn: number,
    inputDecimal: number,
    library: Xdc3,
    isStableSwapWrapper?: boolean,
  ): Promise<boolean | undefined>;

  getFeeIn(library: Xdc3): Promise<number>;
  getFeeOut(library: Xdc3): Promise<number>;
  getLastUpdate(library: Xdc3): Promise<number>;
  getDailySwapLimit(library: Xdc3): Promise<number>;
  getPoolBalance(tokenAddress: string, library: Xdc3): Promise<number>;
  getAmounts(amount: number, account: string, library: Xdc3): Promise<any>;
  getTotalValueLocked(library: Xdc3): Promise<number>;
  getActualLiquidityAvailablePerUser(account: string, library: Xdc3): Promise<number>;
  getDepositTracker(account: string, library: Xdc3): Promise<number>;

  isDecentralizedState(library: Xdc3) : Promise<boolean>;
  isUserWhitelisted(address: string, library: Xdc3) : Promise<boolean>
}
