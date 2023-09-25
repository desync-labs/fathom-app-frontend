import Xdc3 from "xdc3";

export default interface IStableSwapService {
  swapTokenToStableCoin(
    address: string,
    tokenIn: string,
    tokenInDecimals: number,
    tokenName: string,
    library: Xdc3
  ): Promise<number>;
  swapStableCoinToToken(
    address: string,
    stableCoinIn: string,
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
  claimFeesRewards(
    account: string,
    library: Xdc3
  ): Promise<number>;
  withdrawClaimedFees(
    account: string,
    library: Xdc3
  ): Promise<number>;
  approvalStatusStableCoin(
    address: string,
    tokenIn: string,
    inputDecimal: number,
    library: Xdc3,
    isStableSwapWrapper?: boolean,
  ): Promise<boolean | undefined>;
  approvalStatusUsdt(
    address: string,
    tokenIn: string,
    inputDecimal: number,
    library: Xdc3,
    isStableSwapWrapper?: boolean,
  ): Promise<boolean | undefined>;

  getFeeIn(library: Xdc3): Promise<string>;
  getFeeOut(library: Xdc3): Promise<string>;
  getLastUpdate(library: Xdc3): Promise<string>;
  getDailySwapLimit(library: Xdc3): Promise<number>;
  getPoolBalance(tokenAddress: string, library: Xdc3): Promise<number>;
  getAmounts(amount: number, account: string, library: Xdc3): Promise<any>;
  getTotalValueLocked(library: Xdc3): Promise<number>;
  getActualLiquidityAvailablePerUser(account: string, library: Xdc3): Promise<number>;
  getDepositTracker(account: string, library: Xdc3): Promise<number>;
  getClaimableFeesPerUser(account: string, library: Xdc3): Promise<any>;

  getClaimedFXDFeeRewards(account: string, library: Xdc3): Promise<number>;
  getClaimedTokenFeeRewards(account: string, library: Xdc3): Promise<number>;

  isDecentralizedState(library: Xdc3) : Promise<boolean>;
  isUserWhitelisted(address: string, library: Xdc3) : Promise<boolean>
  usersWrapperWhitelist(address: string, library: Xdc3): Promise<boolean>;
}
