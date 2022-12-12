import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import IPositionService from "services/interfaces/IPositionService";
import ICollateralPool from "stores/interfaces/ICollateralPool";
import IOpenPosition from "stores/interfaces/IOpenPosition";

export default class PositionStore {
  positions: IOpenPosition[] = [];
  service: IPositionService;
  rootStore: RootStore;
  stableCoinBalance: number = 0;

  constructor(rootStore: RootStore, service: IPositionService) {
    makeAutoObservable(this);
    this.service = service;
    this.rootStore = rootStore;
  }

  async openPosition(
    address: string,
    pool: ICollateralPool,
    collateral: number,
    fathomToken: number
  ): Promise<any> {
    try {
      return await this.service
        .openPosition(
          address,
          pool,
          collateral,
          fathomToken,
          this.rootStore.transactionStore
        )
        .then((receipt) => {
          this.rootStore.alertStore.setShowSuccessAlert(
            true,
            "New position opened successfully!"
          );
          return receipt;
        });
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
      throw e;
    }
  }

  setPositions(_positions: IOpenPosition[]) {
    this.positions = _positions;
  }

  setStableCoinBalance(_stableCoinBalance: number) {
    this.stableCoinBalance = _stableCoinBalance;
  }

  async approve(address: string, tokenAddress: string) {
    try {
      return await this.service.approve(
        address,
        tokenAddress,
        this.rootStore.transactionStore
      ).then((receipt) => {
        this.rootStore.alertStore.setShowSuccessAlert(
          true,
          "Approval was successful!"
        );

        return receipt;
      });
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
      throw e;
    }
  }

  async approvalStatus(
    address: string,
    collateral: number,
    tokenAddress: string
  ) {
    try {
      return await this.service.approvalStatus(
        address,
        tokenAddress,
        collateral,
        this.rootStore.transactionStore
      );
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  async balanceStableCoin(address: string) {
    try {
      return await this.service.balanceStableCoin(address);
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  async approveStableCoin(address: string) {
    try {
      return await this.service
        .approveStableCoin(address, this.rootStore.transactionStore)
        .then(() => {
          this.rootStore.alertStore.setShowSuccessAlert(
            true,
            "Token approval was successful!"
          );
        });
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  async approvalStatusStableCoin(address: string) {
    try {
      return await this.service.approvalStatusStableCoin(address);
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  async fullyClosePosition(
    position: IOpenPosition,
    pool: ICollateralPool,
    address: string,
    collateral: number
  ) {
    try {
      return await this.service
        .closePosition(
          position.positionId,
          pool,
          address,
          collateral,
          this.rootStore.transactionStore
        )
        .then((receipt) => {
          this.rootStore.alertStore.setShowSuccessAlert(
            true,
            "Position closed successfully!"
          );

          return receipt;
        });
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
      throw e;
    }
  }

  async partiallyClosePosition(
    position: IOpenPosition,
    pool: ICollateralPool,
    address: string,
    fathomToken: number,
    collateral: number
  ): Promise<any> {
    try {
      return await this.service
        .partiallyClosePosition(
          position.positionId,
          pool,
          address,
          fathomToken,
          collateral,
          this.rootStore.transactionStore
        )
        .then((receipt) => {
          this.rootStore.alertStore.setShowSuccessAlert(
            true,
            "Position closed successfully!"
          );

          return receipt;
        });
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
      throw e;
    }
  }

  async getProxyWallet(account: string) {
    try {
      return await this.service.proxyWalletExist(account);
    } catch (e: any) {
      return this.rootStore.alertStore.setShowErrorAlert(true, e.message);
    }
  }
}
