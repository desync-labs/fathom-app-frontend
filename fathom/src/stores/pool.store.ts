// src/stores/user.store.js

import { makeAutoObservable, runInAction } from "mobx";
import { RootStore } from ".";
import IPoolService from "../services/interfaces/IPoolService";
import ICollatralPool from "./interfaces/ICollatralPool";

export default class PoolStore {

  pools:ICollatralPool[] = [];
  service:IPoolService;

  constructor(rootStore:RootStore, service: IPoolService) { 
    makeAutoObservable(this);
    this.service = service;
  }

  setPool = (_pool:ICollatralPool[]) => {
    this.pools = _pool;
  };

  getPool = (poolId:string) =>{
    const pool = this.pools.filter(pool => poolId === pool.id)[0];
    return pool
  }

  fetchPools = async () =>{
    let pools = await this.service.fetchPools();
    runInAction(() =>{
      this.setPool(pools)
    })
  }

  getPriceWithSafetyMargin = async (pool:ICollatralPool) => {
    return await this.service.getPriceWithSafetyMargin(pool);
  }

}