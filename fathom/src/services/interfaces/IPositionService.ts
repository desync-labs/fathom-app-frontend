import ICollateralPool from "stores/interfaces/ICollateralPool";
import IOpenPosition from "stores/interfaces/IOpenPosition";
import ActiveWeb3Transactions from "stores/transaction.store";
import BigNumber from "bignumber.js";

export default interface IPositionService {
  openPosition(
    address: string,
    pool: ICollateralPool,
    collatral: number,
    fathomToken: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;
  createProxyWallet(address: string): Promise<string>;
  proxyWalletExist(address: string): Promise<string>;
  getPositionsForAddress(address: string): Promise<IOpenPosition[]>;
  getPositionsWithSafetyBuffer(address: string): Promise<IOpenPosition[]>;
  closePosition(
    positionId: string,
    pool: ICollateralPool,
    address: string,
    lockedCollateral: BigNumber,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;
  approve(
    address: string,
    pool: ICollateralPool,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;
  approvalStatus(
    address: string,
    pool: ICollateralPool,
    collatral: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<Boolean>;
  balanceStablecoin(address: string): Promise<number>;
  approveStablecoin(
    address: string,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;
  approvalStatusStablecoin(address: string): Promise<Boolean>;
  partiallyClosePosition(
    position: IOpenPosition,
    pool: ICollateralPool,
    address: string,
    debt: number,
    collateralValue: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;
}
