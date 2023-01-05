import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import IPoolService from "services/interfaces/IPoolService";
import ICollateralPool from "stores/interfaces/ICollateralPool";
import Xdc3 from "xdc3";

export default class PoolStore {
  pools: ICollateralPool[] = [];
  service: IPoolService;
  rootStore: RootStore;

  constructor(rootStore: RootStore, service: IPoolService) {
    makeAutoObservable(this);
    this.service = service;
    this.rootStore = rootStore;
  }

  getPool(poolId: string) {
    return this.pools.filter((pool) => poolId === pool.id)[0];
  }

  async getUserTokenBalance(address: string, forAddress: string, library: Xdc3) {
    return this.service.getUserTokenBalance(address, forAddress, library);
  }

  getDexPrice(address: string, library: Xdc3) {
    return this.service.getDexPrice(address, library);
  }

  async getCollateralTokenAddress(address: string, library: Xdc3) {
    try {
      return await this.service.getCollateralTokenAddress(address, library);
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
    }
  }
}
