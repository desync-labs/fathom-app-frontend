import ICollateralPool from "stores/interfaces/ICollateralPool";
import ActiveWeb3Transactions from "stores/transaction.store";
import Xdc3 from "xdc3";

export default interface IPositionService {
  openPosition(
    address: string,
    pool: ICollateralPool,
    collateral: number,
    fathomToken: number,
    transactionStore: ActiveWeb3Transactions,
    library: Xdc3
  ): Promise<void>;

  createProxyWallet(address: string, library: Xdc3): Promise<string>;
  proxyWalletExist(address: string, library: Xdc3): Promise<string>;

  closePosition(
    positionId: string,
    pool: ICollateralPool,
    address: string,
    collateral: number,
    transactionStore: ActiveWeb3Transactions,
    library: Xdc3
  ): Promise<void>;
  approve(
    address: string,
    tokenAddress: string,
    transactionStore: ActiveWeb3Transactions,
    library: Xdc3
  ): Promise<void>;
  approvalStatus(
    address: string,
    tokenAddress: string,
    collateral: number,
    transactionStore: ActiveWeb3Transactions,
    library: Xdc3
  ): Promise<Boolean>;
  balanceStableCoin(address: string, library: Xdc3): Promise<number>;
  approveStableCoin(
    address: string,
    transactionStore: ActiveWeb3Transactions,
    library: Xdc3
  ): Promise<void>;
  approvalStatusStableCoin(address: string, library: Xdc3): Promise<Boolean>;
  partiallyClosePosition(
    positionId: string,
    pool: ICollateralPool,
    address: string,
    debt: number,
    collateralValue: number,
    transactionStore: ActiveWeb3Transactions,
    library: Xdc3
  ): Promise<void>;
}
