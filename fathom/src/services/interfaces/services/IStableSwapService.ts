import Xdc3 from "xdc3";

export default interface IStableSwapService {
  swapTokenToStableCoin(
    address: string,
    tokenIn: string,
    tokenInDecimals: number,
    tokenName: string,
    library: Xdc3
  ): Promise<number|Error>;

  swapStableCoinToToken(
    address: string,
    stableCoinIn: string,
    stableCoinInDecimals: number,
    tokenName: string,
    library: Xdc3
  ): Promise<number|Error>;

  addLiquidity(
    amount: number,
    account: string,
    library: Xdc3
  ): Promise<number|Error>;

  removeLiquidity(
    amount: number,
    account: string,
    library: Xdc3
  ): Promise<number|Error>;

  approveStableCoin(
    address: string,
    library: Xdc3,
    isStableSwapWrapper?: boolean
  ): Promise<number|Error>;

  approveUsdt(
    address: string,
    tokenName: string,
    library: Xdc3,
    isStableSwapWrapper?: boolean
  ): Promise<number|Error>;

  claimFeesRewards(
    account: string,
    library: Xdc3
  ): Promise<number|Error>;

  withdrawClaimedFees(
    account: string,
    library: Xdc3
  ): Promise<number|Error>;

  approvalStatusStableCoin(
    address: string,
    tokenIn: string,
    inputDecimal: number,
    library: Xdc3,
    isStableSwapWrapper?: boolean
  ): Promise<boolean>;

  approvalStatusUsdt(
    address: string,
    tokenIn: string,
    inputDecimal: number,
    library: Xdc3,
    isStableSwapWrapper?: boolean
  ): Promise<boolean>;

  getFeeIn(library: Xdc3): Promise<string>;

  getFeeOut(library: Xdc3): Promise<string>;

  getLastUpdate(library: Xdc3): Promise<string>;

  getDailySwapLimit(library: Xdc3): Promise<number>;

  getPoolBalance(tokenAddress: string, library: Xdc3): Promise<number>;

  getAmounts(amount: string, account: string, library: Xdc3): Promise<number[]>;

  getTotalValueLocked(library: Xdc3): Promise<number>;

  getActualLiquidityAvailablePerUser(account: string, library: Xdc3): Promise<number>;

  getDepositTracker(account: string, library: Xdc3): Promise<number>;

  getClaimableFeesPerUser(account: string, library: Xdc3): Promise<{ 0: number, 1: number }>;

  getClaimedFXDFeeRewards(account: string, library: Xdc3): Promise<number>;

  getClaimedTokenFeeRewards(account: string, library: Xdc3): Promise<number>;

  isDecentralizedState(library: Xdc3): Promise<boolean>;

  isUserWhitelisted(address: string, library: Xdc3): Promise<boolean>;

  usersWrapperWhitelist(address: string, library: Xdc3): Promise<boolean>;
}
