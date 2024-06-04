import { ReactElement } from "react";

export enum TxAction {
  APPROVAL,
  MAIN_ACTION,
  GAS_ESTIMATION,
}

export type TxErrorType = {
  blocking: boolean;
  actionBlocked: boolean;
  rawError: Error;
  error: ReactElement | string | undefined;
  txAction: TxAction;
};

export const getErrorTextFromError = (
  error: any,
  txAction: TxAction,
  blocking = true
): TxErrorType => {
  let errorNumber = 1;

  if (
    error.code === 4001 ||
    error.code === "ACTION_REJECTED" ||
    error.code === 5000
  ) {
    return {
      error: errorMapping[4001],
      blocking: false,
      actionBlocked: false,
      rawError: error,
      txAction,
    };
  }

  // Try to parse the Pool error number from RPC provider revert error
  const errorBody = (error as any)?.error?.body;

  if (errorBody) {
    const parsedError = JSON.parse((error as any)?.error?.body);
    const parsedNumber = Number(parsedError.error.message.split(": ")[1]);
    if (!isNaN(parsedNumber)) {
      errorNumber = parsedNumber;
    }
  }

  const errorRender = errorMapping[errorNumber];

  if (errorRender) {
    return {
      error: errorRender,
      blocking,
      actionBlocked: true,
      rawError: error,
      txAction,
    };
  }

  return {
    error: undefined,
    blocking,
    actionBlocked: true,
    rawError: error,
    txAction,
  };
};

export const errorMapping: Record<number, string> = {
  1: "An unknown error occurred. Please try again.",
  7: "Pool addresses provider is not registered",
  9: "Address is not a contract",
  11: "The caller of the function is not an AToken",
  12: "The address of the pool addresses provider is invalid",
  13: "Invalid return value of the flashloan executor function",
  19: "Invalid flashloan premium",
  22: "Invalid bridge protocol fee",
  23: "The caller of this function must be a pool",
  24: "Invalid amount to mint",
  25: "Invalid amount to burn",
  26: "Amount must be greater than 0",
  27: "Action requires an active reserve",
  28: "Action cannot be performed because the reserve is frozen",
  29: "Action cannot be performed because the reserve is paused",
  30: "Borrowing is not enabled",
  31: "Stable borrowing is not enabled",
  32: "User cannot withdraw more than the available balance",
  34: "The collateral balance is 0",
  35: "Health factor is lesser than the liquidation threshold",
  36: "There is not enough collateral to cover a new borrow",
  37: "Collateral is (mostly) the same currency that is being borrowed",
  38: "The requested amount is greater than the max loan size in stable rate mode",
  39: "For repayment of a specific type of debt, the user needs to have debt that type",
  40: "To repay on behalf of a user an explicit amount to repay is needed",
  41: "User does not have outstanding stable rate debt on this reserve",
  42: "User does not have outstanding variable rate debt on this reserve",
  43: "The underlying balance needs to be greater than 0",
  44: "Interest rate rebalance conditions were not met",
  45: "Health factor is not below the threshold",
  46: "The collateral chosen cannot be liquidated",
  47: "User did not borrow the specified currency",
  48: "Borrow and repay in same block is not allowed",
  49: "Inconsistent flashloan parameters",
  50: "Borrow cap is exceeded",
  51: "Supply cap is exceeded",
  52: "Unbacked mint cap is exceeded",
  53: "Debt ceiling is exceeded",
  54: "AToken supply is not zero",
  55: "Stable debt supply is not zero",
  56: "Variable debt supply is not zero",
  57: "Ltv validation failed",
  60: "Asset is not borrowable in isolation mode",
  62: "User is in isolation mode",
  76: "Array parameters that should be equal length are not",
  77: "Zero address not valid",
  78: "Invalid expiration",
  79: "Invalid signature",
  80: "Operation not supported",
  81: "Debt ceiling is not zero",
  82: "Asset is not listed",
  85: "The underlying asset cannot be rescued",
  88: "Stable borrowing is enabled",
  89: "User is trying to borrow multiple assets including a siloed one",
  4001: "You cancelled the transaction.",
};
