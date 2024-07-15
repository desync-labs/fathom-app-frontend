export enum WalletConnectOptions {
  XDCPay = "XDC Pay",
  Metamask = "Metamask",
  WalletConnect = "WalletConnect",
}

export enum AvailableNetworks {
  XDC = "XDC",
  Apothem = "Apothem",
}
export interface OpenPositionParams {
  collateralAmount: number | "max";
  borrowAmount: number | "safeMax";
}

export enum GraphOperationName {
  FathomHealth = "FathomHealth",
  FXDUser = "FXDUser",
  FXDPositions = "FXDPositions",
  AccountVaultPositions = "AccountVaultPositions",
  Vaults = "Vaults",
  Stakers = "Stakers",
  Vault = "Vault",
}

export interface PositionData {
  positionId: number;
  collateralAmount: number;
  borrowAmount: number;
  safetyBufferPercentage: number;
}

export interface VaultDepositData {
  stakedAmountDialogBefore?: number | null;
  poolShareDialogBefore?: number | null;
  shareTokensDialogBefore?: number | null;
  stakedAmountDialogAfter?: number | null;
  poolShareDialogAfter?: number | null;
  shareTokensDialogAfter?: number | null;
}

export interface ValidateVaultDataParams extends VaultDepositData {
  id: string;
  action: VaultAction;
  amountChanged: number;
}

export enum VaultFilterName {
  LiveNow = "Live Now",
  Finished = "Finished",
}

export enum VaultDetailsTabs {
  YourPosition = "Your position",
  About = "About",
  Strategies = "Strategies",
}

export enum VaultAction {
  Withdraw = "Withdraw",
  Deposit = "Deposit",
}

export interface SwapData {
  fromAmountExpected: string;
  fromTokenNameExpected: string;
  toAmountExpected: string;
  toTokenNameExpected: string;
}

export enum DexTabs {
  Swap = "Swap",
  Pool = "Pool",
  Transactions = "Transactions",
}

export interface DexTokenData {
  name: string;
  tokenId: string;
}

export enum LendingSection {
  Supply = "Supply",
  Supplied = "Supplied",
  Borrow = "Borrow",
  Borrowed = "Borrowed",
}

export enum LendingAssets {
  CGO = "CGO",
  FXD = "FXD",
  USDTX = "USDTX",
  XDC = "XDC",
  EURS = "EURS",
  WXDC = "WXDC",
}
