import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import IPoolService from "services/interfaces/IPoolService";
import ICollateralPool from "stores/interfaces/ICollateralPool";

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

  async getUserTokenBalance(address: string, forAddress: string) {
    return this.service.getUserTokenBalance(address, forAddress);
  }

  getDexPrice(address: string) {
    return this.service.getDexPrice(address);
  }

  async getCollateralTokenAddress(address: string) {
    try {
      return await this.service.getCollateralTokenAddress(address);
    } catch (e: any) {
      this.rootStore.alertStore.setShowErrorAlert(true, e.message);
    }
  }
}
