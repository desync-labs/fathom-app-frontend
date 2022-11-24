import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import IPoolService from "services/interfaces/IPoolService";
import ICollateralPool from "stores/interfaces/ICollateralPool";

export default class PoolStore {
  pools: ICollateralPool[] = [];
  service: IPoolService;

  constructor(rootStore: RootStore, service: IPoolService) {
    this.service = service;
    makeAutoObservable(this);
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
}
