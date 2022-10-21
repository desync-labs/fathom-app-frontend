import { makeAutoObservable, runInAction } from "mobx";
import { RootStore } from ".";
import IPoolService from "services/interfaces/IPoolService";
import ICollateralPool from "stores/interfaces/ICollateralPool";

export default class PoolStore {
  pools: ICollateralPool[] = [];
  service: IPoolService;

  constructor(rootStore: RootStore, service: IPoolService) {
    makeAutoObservable(this);
    this.service = service;
  }

  setPool = (_pool: ICollateralPool[]) => {
    this.pools = _pool;
  };

  getPool = (poolId: string) => {
    const pool = this.pools.filter((pool) => poolId === pool.id)[0];
    return pool;
  };

  fetchPools = async () => {
    let pools = await this.service.fetchPools();
    runInAction(() => {
      this.setPool(pools);
    });
  };

  getPriceWithSafetyMargin = async (pool: ICollateralPool) => {
    return await this.service.getPriceWithSafetyMargin(pool);
  };

  getUserTokenBalance = async (address: string, pool: ICollateralPool) => {
    return await this.service.getUserTokenBalance(address, pool);
  };

  getDexPrice = async (address: string) => {
    return await this.service.getDexPrice(address);
  };
}