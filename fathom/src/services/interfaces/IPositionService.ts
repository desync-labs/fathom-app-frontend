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

  closePosition(
    positionId: string,
    pool: ICollateralPool,
    address: string,
    collateral: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;
  approve(
    address: string,
    tokenAddress: string,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;
  approvalStatus(
    address: string,
    tokenAddress: string,
    collateral: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<Boolean>;
  balanceStableCoin(address: string): Promise<number>;
  approveStableCoin(
    address: string,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;
  approvalStatusStableCoin(address: string): Promise<Boolean>;
  partiallyClosePosition(
    positionId: string,
    pool: ICollateralPool,
    address: string,
    debt: number,
    collateralValue: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void>;
}
