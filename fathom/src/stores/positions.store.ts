import { makeAutoObservable, runInAction } from "mobx";
import { RootStore } from ".";
import IPositionService from "../services/interfaces/IPositionService";
import ICollatralPool from "./interfaces/ICollatralPool";
import IOpenPosition from "./interfaces/IOpenPosition";

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
    pool: ICollatralPool,
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
        this.rootStore.alertStore.setShowErrorAlert(
          true,
          "There is some error in opening the position!"
        );
        reject(e);
      }
    });
  };

  closePosition = async (
    positionId: string,
    pool: ICollatralPool,
    address: string,
    fathomToken: number
  ) => {
    console.log(
      `Close position clicked for address ${address}, positionId: ${positionId}, fathomToken: ${fathomToken}`
    );
    try {
      if (!address) return;

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
    } catch (e) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        "There is some error in closing the position!"
      );
    }
  };

  fetchPositions = async (address: string) => {
    if (address === undefined || address === null) return;

    let positions = await this.service.getPositionsWithSafetyBuffer(address);
    runInAction(() => {
      this.setPositions(positions);
    });
  };

  setPositions = (_positions: IOpenPosition[]) => {
    this.positions = _positions;
  };

  approve = async (address: string, pool: ICollatralPool) => {
    console.log(
      `Open position token approval clicked for address ${address}, poolId: ${pool.name}`
    );
    try {
      if (address === undefined || address === null) return;

      await this.service.approve(
        address,
        pool,
        this.rootStore.transactionStore
      );
      this.rootStore.alertStore.setShowSuccessAlert(
        true,
        `${pool.name} approval was successful!`
      );
    } catch (e) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        "There is some error approving the token!"
      );
      throw e;
    }
  };

  approvalStatus = async (
    address: string,
    collatral: number,
    pool: ICollatralPool
  ) => {
    console.log(
      `Checking approval status for address ${address}, poolId: ${pool.name}`
    );
    try {
      if (address === undefined || address === null) return;

      return await this.service.approvalStatus(
        address,
        pool,
        collatral,
        this.rootStore.transactionStore
      );
    } catch (e) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        "There is some error approving the token!"
      );
    }
  };

  approveStablecoin = async (address: string) => {
    console.log(`Open position token approval clicked for address ${address}`);
    try {
      if (!address) return;

      await this.service.approveStablecoin(
        address,
        this.rootStore.transactionStore
      );
      this.rootStore.alertStore.setShowSuccessAlert(
        true,
        "Token approval was successful!"
      );
    } catch (e) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        "There is some error approving the token!"
      );
      throw e;
    }
  };

  approvalStatusStablecoin = async (address: string) => {
    console.log(`Checking stablecoin approval status for address ${address}`);
    try {
      if (!address) return;

      return await this.service.approvalStatusStablecoin(address);
    } catch (e) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        "There is some error approving the token!"
      );
    }
  };

  partialyClosePosition = async (
    position: IOpenPosition,
    pool: ICollatralPool,
    address: string,
    fathomToken: number,
    collater: number
  ) => {
    console.log(
      `Close position clicked for address ${address}, positionId: ${position.id}, fathomToken: ${fathomToken}`
    );
    try {
      if (address === undefined || address === null) return;

      await this.service.partialyClosePosition(
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
    } catch (e) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        "There is some error in closing the position!"
      );
    }
  };
}
