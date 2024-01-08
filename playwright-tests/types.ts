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
}

export interface PositionData {
  positionId: number;
  collateralAmount: number;
  borrowAmount: number;
  safetyBufferPercentage: number;
}

export interface VaultDepositData {
  stakedAmount: number | null;
  poolShare: number | null;
  shareTokens: number | null;
}

export interface ValidateVaultDataParams extends VaultDepositData {
  id: string;
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
