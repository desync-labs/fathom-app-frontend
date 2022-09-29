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
    console.log(
      `Open position clicked for address ${address}, poolId: ${pool.name}, collatral:${collatral}, fathomToken: ${fathomToken}`
    );
    try {
      if (address === undefined || address === null) return;

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
        "New position opened succesfully!"
      );
    } catch (e) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        "There is some error in opening the position!"
      );
    }
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
      if (address === undefined || address === null) return;

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
