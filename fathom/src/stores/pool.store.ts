// src/stores/user.store.js

import { makeAutoObservable } from "mobx";
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

  setPool = (_pool:ICollatralPool) => {
    this.pools.push(_pool);
  };

  fetchPools = async () =>{
    let pool = await this.service.fetchPools();
    this.setPool(pool)
  }
}