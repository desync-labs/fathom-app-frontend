import Xdc3 from "xdc3";
import { TransactionReceipt } from "web3-eth";
import ICollateralPool from "stores/interfaces/ICollateralPool";

export default interface IPositionService {
  openPosition(
    address: string,
    pool: ICollateralPool,
    collateral: number,
    fathomToken: number,
    library: Xdc3
  ): Promise<TransactionReceipt | undefined>;

  topUpPositionAndBorrow(
    address: string,
    pool: ICollateralPool,
    collateral: number,
    fathomToken: number,
    positionId: string,
    library: Xdc3
  ): Promise<TransactionReceipt | undefined>;

  topUpPosition(
    address: string,
    pool: ICollateralPool,
    collateral: number,
    positionId: string,
    library: Xdc3
  ): Promise<TransactionReceipt | undefined>;

  createProxyWallet(address: string, library: Xdc3): Promise<string>;
  proxyWalletExist(address: string, library: Xdc3): Promise<string>;

  closePosition(
    positionId: string,
    pool: ICollateralPool,
    address: string,
    collateral: string,
    library: Xdc3
  ): Promise<TransactionReceipt | undefined>;
  approve(
    address: string,
    tokenAddress: string,
    library: Xdc3
  ): Promise<TransactionReceipt | undefined>;
  approvalStatus(
    address: string,
    tokenAddress: string,
    collateral: string,
    library: Xdc3
  ): Promise<Boolean>;
  balanceStableCoin(address: string, library: Xdc3): Promise<string>;
  approveStableCoin(
    address: string,
    library: Xdc3
  ): Promise<TransactionReceipt | undefined>;
  approvalStatusStableCoin(address: string, library: Xdc3): Promise<boolean>;
  partiallyClosePosition(
    positionId: string,
    pool: ICollateralPool,
    address: string,
    debt: string,
    collateralValue: string,
    library: Xdc3
  ): Promise<TransactionReceipt | undefined>;

  getDebtValue(
    debtShare: number,
    poolId: string,
    library: Xdc3
  ): Promise<string>;
}
