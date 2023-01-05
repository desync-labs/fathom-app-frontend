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

  createProxyWallet(address: string, library: Xdc3): Promise<string>;
  proxyWalletExist(address: string, library: Xdc3): Promise<string>;

  closePosition(
    positionId: string,
    pool: ICollateralPool,
    address: string,
    collateral: number,
    library: Xdc3
  ): Promise<TransactionReceipt | undefined>;
  approve(address: string, tokenAddress: string, library: Xdc3): Promise<TransactionReceipt | undefined>;
  approvalStatus(
    address: string,
    tokenAddress: string,
    collateral: number,
    library: Xdc3
  ): Promise<Boolean>;
  balanceStableCoin(address: string, library: Xdc3): Promise<number>;
  approveStableCoin(
    address: string,
    library: Xdc3
  ): Promise<TransactionReceipt | undefined>;
  approvalStatusStableCoin(address: string, library: Xdc3): Promise<boolean>;
  partiallyClosePosition(
    positionId: string,
    pool: ICollateralPool,
    address: string,
    debt: number,
    collateralValue: number,
    library: Xdc3
  ): Promise<TransactionReceipt | undefined>;
}
