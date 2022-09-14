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

  fetchPools = async () =>{
    let pools = await this.service.fetchPools();
    runInAction(() =>{
      this.setPool(pools)
    })
  }

  openPosition = async () =>{
    await this.service.openPosition();
  }

}