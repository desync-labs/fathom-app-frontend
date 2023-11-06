import Xdc3 from "xdc3";
import ICollateralPool from "services/interfaces/models/ICollateralPool";

export default interface IPositionService {
  openPosition(
    address: string,
    pool: ICollateralPool,
    collateral: string,
    fathomToken: string,
    library: Xdc3
  ): Promise<number | Error>;

  topUpPositionAndBorrow(
    address: string,
    pool: ICollateralPool,
    collateral: string,
    fathomToken: string,
    positionId: string,
    library: Xdc3
  ): Promise<number | Error>;

  topUpPosition(
    address: string,
    pool: ICollateralPool,
    collateral: string,
    positionId: string,
    library: Xdc3
  ): Promise<number | Error>;

  createProxyWallet(address: string, library: Xdc3): Promise<string>;

  proxyWalletExist(address: string, library: Xdc3): Promise<string>;

  closePosition(
    positionId: string,
    pool: ICollateralPool,
    address: string,
    collateral: string,
    library: Xdc3
  ): Promise<number | Error>;

  approve(
    address: string,
    tokenAddress: string,
    library: Xdc3
  ): Promise<number | Error>;

  approvalStatus(
    address: string,
    tokenAddress: string,
    collateral: string,
    library: Xdc3
  ): Promise<boolean>;

  balanceStableCoin(address: string, library: Xdc3): Promise<string>;

  approveStableCoin(
    address: string,
    library: Xdc3
  ): Promise<number | Error>;

  approvalStatusStableCoin(maxPositionDebtValue: number, address: string, library: Xdc3): Promise<boolean>;

  partiallyClosePosition(
    positionId: string,
    pool: ICollateralPool,
    address: string,
    debt: string,
    collateralValue: string,
    library: Xdc3
  ): Promise<number | Error>;

  getDebtValue(
    debtShare: number,
    poolId: string,
    library: Xdc3
  ): Promise<string>;

  getPositionDebtCeiling(
    poolId: string,
    library: Xdc3,
  ): Promise<string>

  isWhitelisted(address: string, library: Xdc3): Promise<boolean>;

  isDecentralizedMode(library: Xdc3): Promise<boolean>;
}