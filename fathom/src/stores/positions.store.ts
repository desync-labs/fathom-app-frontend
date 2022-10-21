import { makeAutoObservable, runInAction } from "mobx";
import { RootStore } from ".";
import IPositionService from "services/interfaces/IPositionService";
import ICollateralPool from "stores/interfaces/ICollateralPool";
import IOpenPosition from "stores/interfaces/IOpenPosition";
import { processRpcError } from "utils/processRpcError";

export default class PositionStore {
  positions: IOpenPosition[] = [];
  service: IPositionService;
  rootStore: RootStore;

  constructor(rootStore: RootStore, service: IPositionService) {
    makeAutoObservable(this);
    this.service = service;
    this.rootStore = rootStore;
  }

  openPosition = async (
    address: string,
    pool: ICollateralPool,
    collatral: number,
    fathomToken: number
  ) => {
    if (!address) return;

    console.log(
      `Open position clicked for address ${address}, poolId: ${pool.name}, collatral:${collatral}, fathomToken: ${fathomToken}`
    );

    return new Promise(async (resolve, reject) => {
      try {
        await this.service.openPosition(
          address,
          pool,
          collatral,
          fathomToken,
          this.rootStore.transactionStore
        );

        await this.fetchPositions(address);
        await this.rootStore.poolStore.fetchPools();

        this.rootStore.alertStore.setShowSuccessAlert(
          true,
          "New position opened successfully!"
        );

        resolve(null);
      } catch (e) {
        const err = processRpcError(e);
        this.rootStore.alertStore.setShowErrorAlert(
          true,
          err.reason || err.message
        );
        reject(e);
      }
    });
  };

  closePosition = async (
    positionId: string,
    pool: ICollateralPool,
    address: string,
    fathomToken: number
  ) => {
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
      } catch (e) {
        const err = processRpcError(e);
        this.rootStore.alertStore.setShowErrorAlert(
          true,
          err.reason || err.message
        );

        reject(e);
      }
    });
  };

  fetchPositions = async (address: string) => {
    if (!address) return;

    const positions = await this.service.getPositionsWithSafetyBuffer(address);
    runInAction(() => {
      this.setPositions(positions);
    });
  };

  setPositions = (_positions: IOpenPosition[]) => {
    this.positions = _positions;
  };

  approve = async (address: string, pool: ICollateralPool) => {
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
      } catch (e) {
        const err = processRpcError(e);
        this.rootStore.alertStore.setShowErrorAlert(
          true,
          err.reason || err.message
        );
        reject(e);
      }
    });
  };

  approvalStatus = async (
    address: string,
    collatral: number,
    pool: ICollateralPool
  ) => {
    if (!address) return;
    console.log(
      `Checking approval status for address ${address}, poolId: ${pool.name}`
    );
    try {
      return this.service.approvalStatus(
        address,
        pool,
        collatral,
        this.rootStore.transactionStore
      );
    } catch (e) {
      const err = processRpcError(e);
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        err.reason || err.message
      );
    }
  };

  balanceStablecoin = async (address: string) => {
    if (!address) return;

    try {
      return this.service.balanceStablecoin(address);
    } catch (e) {
      const err = processRpcError(e);
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        err.reason || err.message
      );
    }
  };

  approveStablecoin = async (address: string) => {
    if (!address) return;
    console.log(`Open position token approval clicked for address ${address}`);
    try {
      return this.service
        .approveStablecoin(address, this.rootStore.transactionStore)
        .then(() => {
          this.rootStore.alertStore.setShowSuccessAlert(
            true,
            "Token approval was successful!"
          );
        });
    } catch (e) {
      const err = processRpcError(e);
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        err.reason || err.message
      );
      throw e;
    }
  };

  approvalStatusStablecoin = async (address: string) => {
    console.log(`Checking stablecoin approval status for address ${address}`);
    try {
      if (!address) return;
      return this.service.approvalStatusStablecoin(address);
    } catch (e) {
      const err = processRpcError(e);
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        err.reason || err.message
      );
    }
  };

  partialyClosePosition = async (
    position: IOpenPosition,
    pool: ICollateralPool,
    address: string,
    fathomToken: number,
    collater: number
  ) => {
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
          collater,
          this.rootStore.transactionStore
        );
        await this.fetchPositions(address);
        await this.rootStore.poolStore.fetchPools();
        this.rootStore.alertStore.setShowSuccessAlert(
          true,
          "Position closed successfully!"
        );

        resolve(null);
      } catch (e) {
        const err = processRpcError(e);
        this.rootStore.alertStore.setShowErrorAlert(
          true,
          err.reason || err.message
        );
        reject(e);
      }
    });
  };
}
