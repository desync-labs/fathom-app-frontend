import BigNumber from "bignumber.js";

export const XDC_BLOCK_TIME = 2.666; // 2.666 seconds
export const DEFAULT_CHAIN_ID = process.env.REACT_APP_ENV === "prod" ? 50 : 51;

export const YEAR_IN_SECONDS = 365 * 24 * 60 * 60;
export const DAY_IN_SECONDS = 24 * 60 * 60;

export const DANGER_SAFETY_BUFFER = 0.25;

export const FXD_MINIMUM_BORROW_AMOUNT = 1;

export enum ProposalStatus {
  Pending = "Pending",
  OpenToVote = "Open-to-Vote",
  Canceled = "Canceled",
  Defeated = "Defeated",
  Succeeded = "Succeeded",
  Queued = "Queued",
  Expired = "Expired",
  Executed = "Executed",
}

export const WeiPerWad = new BigNumber("1e18");
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const TransactionCheckUpdateInterval = 2000;

export const COUNT_PER_PAGE = 4;
export const COUNT_PER_PAGE_VAULT = 20;
/**
 * Step for trade FI vault report in hours.
 */
export const TRADE_FI_VAULT_REPORT_STEP = 1;
