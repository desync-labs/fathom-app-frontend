export enum WalletConnectOptions {
  XDCPay = 'XDC Pay',
  Metamask = 'Metamask',
  WalletConnect = 'WalletConnect',
}

export enum AvailableNetworks {
  XDC = 'XDC',
  Apothem = 'Apothem',
}
export interface OpenPositionParams {
  collateralAmount: number | 'max';
  borrowAmount: number | 'safeMax';
}

export enum GraphOperationName {
  FathomHealth = 'FathomHealth',
  FXDUser = 'FXDUser',
  FXDPositions = 'FXDPositions',
}

export interface PositionData {
  positionId: number;
  collateralAmount: number;
  borrowAmount: number;
  safetyBufferPercentage: number;
}
