import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import IPositionService from "services/interfaces/IPositionService";
import ICollateralPool from "stores/interfaces/ICollateralPool";
import IOpenPosition from "stores/interfaces/IOpenPosition";
import BigNumber from "bignumber.js";

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
      `Open position clicked for address ${address}, poolId: ${pool.name}, collatral:${collateral}, fathomToken: ${fathomToken}`
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

        Promise.all([
          this.fetchPositions(address),
          this.rootStore.poolStore.fetchPools(),
        ]);

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

  async closePosition(
    positionId: string,
    pool: ICollateralPool,
    address: string,
    fathomToken: BigNumber
  ) {
    if (!address) return;

    console.log(
      `Close position clicked for address ${address}, positionId: ${positionId}, fathomToken: ${fathomToken}`
    );

    return new Promise(async (resolve, reject) => {
      try {
        await this.service.closePosition(
          positionId,
          pool,
          address,
          fathomToken,
          this.rootStore.transactionStore
        );
        await this.fetchPositions(address);
        await this.rootStore.poolStore.fetchPools();
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

  async fetchPositions(address: string) {
    if (!address) return;
    try {
      const positions = await this.service.getPositionsWithSafetyBuffer(
        address
      );
      this.setPositions(positions);
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
    }
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
      `Open position token approval clicked for address ${address}, poolId: ${pool.name}`
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
          `${pool.name} approval was successful!`
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

        Promise.all([
          this.fetchPositions(address),
          this.rootStore.poolStore.fetchPools(),
        ]);
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
