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
  ) {
    if (!address) return;

    console.log(
      `Open position clicked for address ${address}, poolId: ${pool.poolName}, collatral:${collateral}, fathomToken: ${fathomToken}`
    );

    return new Promise(async (resolve, reject) => {
      try {
        await this.service.openPosition(
          address,
          pool,
          collateral,
          fathomToken,
          this.rootStore.transactionStore
        );

        this.rootStore.alertStore.setShowSuccessAlert(
          true,
          "New position opened successfully!"
        );

        resolve(null);
      } catch (e: any) {
        this.rootStore.alertStore.setShowErrorAlert(true, e.message);
        reject(e);
      }
    });
  }

  setPositions(_positions: IOpenPosition[]) {
    this.positions = _positions;
  }

  setStableCoinBalance(_stableCoinBalance: number) {
    this.stableCoinBalance = _stableCoinBalance;
  }

  async approve(address: string, pool: ICollateralPool) {
    if (!address) return;

    console.log(
      `Open position token approval clicked for address ${address}, poolId: ${pool.poolName}`
    );

    return new Promise(async (resolve, reject) => {
      try {
        await this.service.approve(
          address,
          pool,
          this.rootStore.transactionStore
        );
        this.rootStore.alertStore.setShowSuccessAlert(
          true,
          `${pool.poolName} approval was successful!`
        );
        resolve(null);
      } catch (e: any) {
        this.rootStore.alertStore.setShowErrorAlert(true, e.message);
        reject(e);
      }
    });
  }

  async approvalStatus(
    address: string,
    collateral: number,
    pool: ICollateralPool
  ) {
    if (!address) return;
    try {
      return await this.service.approvalStatus(
        address,
        pool,
        collateral,
        this.rootStore.transactionStore
      );
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  async balanceStableCoin(address: string) {
    try {
      const balance = await this.service.balanceStableCoin(address);
      this.setStableCoinBalance(balance);
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  async approveStableCoin(address: string) {
    if (!address) return;
    console.log(`Open position token approval clicked for address ${address}`);
    try {
      return this.service
        .approveStableCoin(address, this.rootStore.transactionStore)
        .then(() => {
          this.rootStore.alertStore.setShowSuccessAlert(
            true,
            "Token approval was successful!"
          );
        });
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
      throw e;
    }
  }

  async approvalStatusStableCoin(address: string) {
    try {
      if (!address) return;
      return await this.service.approvalStatusStableCoin(address);
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  async partiallyClosePosition(
    position: IOpenPosition,
    pool: ICollateralPool,
    address: string,
    fathomToken: number,
    collateral: number
  ) {
    if (!address) return;
    console.log(
      `Close position clicked for address ${address}, positionId: ${position.id}, fathomToken: ${fathomToken}`
    );

    return new Promise(async (resolve, reject) => {
      try {
        await this.service.partiallyClosePosition(
          position,
          pool,
          address,
          fathomToken,
          collateral,
          this.rootStore.transactionStore
        );

        this.rootStore.alertStore.setShowSuccessAlert(
          true,
          "Position closed successfully!"
        );
        resolve(null);
      } catch (e: any) {
        this.rootStore.alertStore.setShowErrorAlert(true, e.message);
        reject(e);
      }
    });
  }
}
