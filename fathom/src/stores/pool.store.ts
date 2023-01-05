import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import IPoolService from "services/interfaces/IPoolService";
import Xdc3 from "xdc3";

export default class PoolStore {
  service: IPoolService;
  rootStore: RootStore;

  constructor(rootStore: RootStore, service: IPoolService) {
    makeAutoObservable(this);
    this.service = service;
    this.rootStore = rootStore;
  }

  async getCollateralTokenAddress(address: string, library: Xdc3) {
    try {
      return await this.service.getCollateralTokenAddress(address, library);
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
    }
  }
}
