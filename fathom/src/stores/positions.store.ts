import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import IPositionService from "services/interfaces/IPositionService";
import ICollateralPool from "stores/interfaces/ICollateralPool";
import IOpenPosition from "stores/interfaces/IOpenPosition";
import Xdc3 from "xdc3";

export default class PositionStore {
  positions: IOpenPosition[] = [];
  service: IPositionService;
  rootStore: RootStore;

  constructor(rootStore: RootStore, service: IPositionService) {
    makeAutoObservable(this);
    this.service = service;
    this.rootStore = rootStore;
  }

  async openPosition(
    address: string,
    pool: ICollateralPool,
    collateral: number,
    fathomToken: number,
    library: Xdc3,
  ): Promise<any> {
    try {
      return await this.service
        .openPosition(
          address,
          pool,
          collateral,
          fathomToken,
          this.rootStore.transactionStore,
          library,
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

  async approve(address: string, tokenAddress: string, library: Xdc3) {
    try {
      return await this.service
        .approve(
          address,
          tokenAddress,
          this.rootStore.transactionStore,
          library
        )
        .then((receipt) => {
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
    tokenAddress: string,
    library: Xdc3
  ) {
    try {
      return await this.service.approvalStatus(
        address,
        tokenAddress,
        collateral,
        this.rootStore.transactionStore,
        library
      );
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  async balanceStableCoin(address: string, library: Xdc3) {
    try {
      return await this.service.balanceStableCoin(address, library);
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  async approveStableCoin(address: string, library: Xdc3) {
    try {
      return await this.service
        .approveStableCoin(address, this.rootStore.transactionStore, library)
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

  async approvalStatusStableCoin(address: string, library: Xdc3) {
    try {
      return await this.service.approvalStatusStableCoin(address, library);
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  async fullyClosePosition(
    position: IOpenPosition,
    pool: ICollateralPool,
    address: string,
    collateral: number,
    library: Xdc3
  ) {
    try {
      return await this.service
        .closePosition(
          position.positionId,
          pool,
          address,
          collateral,
          this.rootStore.transactionStore,
          library
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
    collateral: number,
    library: Xdc3
  ): Promise<any> {
    try {
      return await this.service
        .partiallyClosePosition(
          position.positionId,
          pool,
          address,
          fathomToken,
          collateral,
          this.rootStore.transactionStore,
          library
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

  async getProxyWallet(account: string, library: Xdc3) {
    try {
      return await this.service.proxyWalletExist(account, library);
    } catch (e: any) {
      return this.rootStore.alertStore.setShowErrorAlert(true, e.message);
    }
  }
}
